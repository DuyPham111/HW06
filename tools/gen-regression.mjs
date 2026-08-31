#!/usr/bin/env node
// gen-regression.mjs — sinh collection "23127183_regression" = tap con cac REQUEST dang XANH
// trong lan chay Newman MOI NHAT cua ca 3 API. Dung cho CI (§9 - luot XANH).
//
// Doc lai chinh 3 spec (generator/specs/*.mjs) + raw JSON moi nhat trong reports/newman/,
// giu NGUYEN expected (khong noi long assertion nao) - chi LOAI BO cac request dang do.
//
// Chay: node tools/gen-regression.mjs
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { pmItem, folder, collection } from "./lib/postman-builder.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SID = "23127183";
const SLUGS = ["api-01-login", "api-02-apply-coupon", "api-03-product-update"];

function latestJson(slug) {
  const dir = join(ROOT, "reports", "newman");
  const files = readdirSync(dir).filter((f) => f.includes(slug) && f.endsWith(".json") && !f.startsWith("ci-"));
  if (!files.length) throw new Error(`Chua co lan chay Newman nao cho ${slug} - chay npm run test:${slug.replace(/-.*/, "")} truoc`);
  files.sort();
  return JSON.parse(readFileSync(join(dir, files[files.length - 1]), "utf8"));
}

// Ten request trong Newman JSON la "<TC ID> <mo ta>" - lay TC ID (tu dau chuoi toi khoang trang dau).
function tcIdOf(itemName) {
  return itemName.split(" ")[0];
}

async function passedIdsFor(slug) {
  const raw = latestJson(slug);
  const failedIds = new Set();
  for (const f of raw.run.failures || []) {
    const name = f.source?.name;
    if (name) failedIds.add(tcIdOf(name));
  }
  const allIds = new Set();
  for (const ex of raw.run.executions || []) {
    const name = ex.item?.name;
    if (name) allIds.add(tcIdOf(name));
  }
  return [...allIds].filter((id) => !failedIds.has(id) && id !== "00-setup-admin" && id !== "00-setup-user");
}

const folders = [];
const setupItem = {
  id: "00-setup-admin", technique: "Domain", partition: "setup", method: "POST", path: "/api/login", auth: "-",
  body: { email: "{{admin_email}}", password: "{{admin_password}}" }, expectedStatus: 200, expectedBody: "-", basis: "-", source: "setup",
  test: `pm.test("setup: login admin", () => { pm.response.to.have.status(200); });\nconst b = pm.response.json();\npm.environment.set("admin_token", b.token);\npm.environment.set("admin_id", b.user.id);`,
};
const setupUser = {
  id: "00-setup-user", technique: "Domain", partition: "setup", method: "POST", path: "/api/login", auth: "-",
  body: { email: "{{user_email}}", password: "{{user_password}}" }, expectedStatus: 200, expectedBody: "-", basis: "-", source: "setup",
  test: `pm.test("setup: login user", () => { pm.response.to.have.status(200); });\nconst b = pm.response.json();\npm.environment.set("user_token", b.token);\npm.environment.set("user_id", b.user.id);`,
};
folders.push(folder("00-setup", [setupItem, setupUser]));

let totalKept = 0, totalAll = 0;
for (const slug of SLUGS) {
  const spec = await import("file://" + join(ROOT, "generator", "specs", `${slug}.mjs`).replace(/\\/g, "/"));
  const all = [...spec.generated, ...spec.own].filter((c) => !c.excludeFromCollection);
  totalAll += all.length;
  const passed = new Set(await passedIdsFor(slug));
  const kept = all.filter((c) => passed.has(c.id));
  totalKept += kept.length;
  console.log(`${slug}: ${kept.length}/${all.length} case dang xanh -> dua vao regression`);
  folders.push(folder(slug, kept));
}

const preReq = readFileSync(join(ROOT, "postman", "prerequest-collection.js"), "utf8");
const col = collection(`${SID}_regression`, folders, preReq);
mkdirSync(join(ROOT, "postman", "collections"), { recursive: true });
writeFileSync(join(ROOT, "postman", "collections", `${SID}_regression.postman_collection.json`), JSON.stringify(col, null, 2), "utf8");

console.log(`\nTong: ${totalKept}/${totalAll} case dang xanh -> postman/collections/${SID}_regression.postman_collection.json`);
console.log("Chay thu: bash tools/run-newman.sh --regression   (hoac newman run truc tiep)");
