#!/usr/bin/env node
// gen-artifacts.mjs — GD5 cua generator/design.md: doc 1 file generator/specs/<api>.mjs
// (export `generated` + `own`), sinh RA CA:
//   - test-cases/<api>/generated.md   (bang 12 cot, cases AI, Nguon=AI)
//   - test-cases/<api>/extended.md    (bang cases SV + bang ly do bo sot, Nguon=SV)
//   - postman/collections/23127183_<api>.postman_collection.json
//
// Day la NGUON DUY NHAT: sua case thi sua trong generator/specs/*.mjs roi chay lai script nay,
// KHONG sua tay generated.md / extended.md / file .json (se bi ghi de).
//
// Chay: node tools/gen-artifacts.mjs <api-slug>   (vd: api-01-login)
//       node tools/gen-artifacts.mjs --all
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mdTable, pmItem, folder, collection } from "./lib/postman-builder.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SID = "23127183";

const APIS = {
  "api-01-login": { title: "API-01 — Pool A · `POST /api/login`", fr: "FR-02 Đăng nhập & khóa tài khoản" },
  "api-02-apply-coupon": { title: "API-02 — Pool B · `POST /api/apply-coupon`", fr: "FR-09 Coupon (+FR-08, FR-10)" },
  "api-03-product-update": { title: "API-03 — Pool C · `PUT /api/products/:id`", fr: "FR-15 Quản lý sản phẩm" },
};

function techCounts(cases) {
  const c = { Domain: 0, State: 0, Security: 0, Schema: 0 };
  for (const x of cases) c[x.technique] = (c[x.technique] || 0) + 1;
  return c;
}

async function run(slug) {
  const meta = APIS[slug];
  const specPath = join(ROOT, "generator", "specs", `${slug}.mjs`);
  if (!existsSync(specPath)) { console.error(`Khong tim thay spec: ${specPath}`); process.exit(1); }
  const spec = await import("file://" + specPath.replace(/\\/g, "/"));
  const { generated, own } = spec;

  const genOut = join(ROOT, "test-cases", slug);
  mkdirSync(genOut, { recursive: true });

  const counts = techCounts(generated);
  const genMd = `# ${meta.title} · bước 1 (§6.1): test case do AI sinh

- **${meta.fr}** · prefix \`${generated[0].id.replace(/-\d+$/, "")}-###\` · **${generated.length} test case** (đề đòi ≥35, tính cả case tự thêm)
- Sinh từ \`generator/specs/${slug}.mjs\` bằng \`node tools/gen-artifacts.mjs ${slug}\` — **đừng sửa file này bằng tay**, sửa spec rồi sinh lại.
- Quy trình 5 bước của [\`docs/03-GENERATE-AI.md\`](../../docs/03-GENERATE-AI.md); mỗi bước một lượt AI riêng.
- **File này là bằng chứng lượt AI đầu tiên (bao gồm cả chỗ AI dự đoán sai) — sau audit thì đừng sửa nữa. Bản đúng nằm ở \`audit.md\`.**

## Phân bố theo kỹ thuật

| Kỹ thuật | Số case |
|---|--:|
| Domain | ${counts.Domain} |
| State | ${counts.State} |
| Security | ${counts.Security} |
| Schema | ${counts.Schema} |
| **Tổng** | **${generated.length}** |

## Bảng test case

> Cột \`Audit\` và \`Kết quả\` để **trống** ở bước này — điền ở \`audit.md\` và sau khi chạy Newman.

${mdTable(generated)}
`;
  writeFileSync(join(genOut, "generated.md"), genMd, "utf8");

  const ownMd = `# ${meta.title} · bước 3 (§6.3): case do **sinh viên** thêm

- **${own.length} case** (đề đòi ≥5/API), cột \`Nguồn\` = **SV**, ID từ \`${own[0].id}\`.
- Sinh từ \`generator/specs/${slug}.mjs\` bằng \`node tools/gen-artifacts.mjs ${slug}\`.

> Case do **sinh viên chọn phạm vi** (kiểm gì, ở đâu, vì sao đáng kiểm) khi đọc lại \`server.js\` +
> \`database.js\` sau lượt AI đầu — AI chỉ chấp bút thành dòng bảng. Không phải case AI sinh ở lượt hai
> (loại đó phải đánh dấu \`AI-2\`, không tính vào §6.3).

## Bảng test case

${mdTable(own)}

## Vì sao lượt AI đầu bỏ sót (§6.3)

| TC ID | AI bỏ sót gì | Nhóm lý do | Giải thích |
|---|---|---|---|
${own.filter((c) => c.why).map((c) => `| ${c.id} | ${c.partition.replace(/^SV: /, "")} | ${c.why_group} | ${c.why} |`).join("\n")}

> Một số TC ID không xuất hiện ở bảng trên (vd \`-102b\`, \`-102c\`...) vì đó là các bước **trong cùng
> một chuỗi** với case đứng trước nó (chung một lý do bỏ sót), không phải case độc lập mới.
`;
  writeFileSync(join(genOut, "extended.md"), ownMd, "utf8");

  // ---- Postman collection: gom TAT CA case (generated + own), xep folder theo ky thuat ----
  // Case co `excludeFromCollection: true` (vd: payload lam SAP SUT) van xuat hien trong bang .md
  // nhung KHONG dua vao collection Postman - tranh 1 request lam chet SUT giua luot chay khien
  // moi case sau do do VI MOI TRUONG. Bang chung cua case do nam o bug-report/verify-bugs.sh.
  const all = [...generated, ...own].filter((c) => !c.excludeFromCollection);
  const bySetup = (c) => c.technique === "State" ? "02-state" : c.technique === "Security" ? "03-security" : c.technique === "Schema" ? "04-schema" : "01-domain";
  const domain = all.filter((c) => bySetup(c) === "01-domain");
  const state = all.filter((c) => bySetup(c) === "02-state");
  const security = all.filter((c) => bySetup(c) === "03-security");
  const schema = all.filter((c) => bySetup(c) === "04-schema");

  const setupItem = {
    id: "00-setup-admin", technique: "Domain", partition: "setup: login admin -> luu admin_token",
    method: "POST", path: "/api/login", auth: "không có header",
    body: { email: "{{admin_email}}", password: "{{admin_password}}" },
    expectedStatus: 200, expectedBody: "-", basis: "-", source: "setup",
    test: `pm.test("setup: login admin", () => { pm.response.to.have.status(200); });\nconst b = pm.response.json();\npm.environment.set("admin_token", b.token);\npm.environment.set("admin_id", b.user.id);`,
  };
  const setupUser = {
    id: "00-setup-user", technique: "Domain", partition: "setup: login user -> luu user_token",
    method: "POST", path: "/api/login", auth: "không có header",
    body: { email: "{{user_email}}", password: "{{user_password}}" },
    expectedStatus: 200, expectedBody: "-", basis: "-", source: "setup",
    test: `pm.test("setup: login user", () => { pm.response.to.have.status(200); });\nconst b = pm.response.json();\npm.environment.set("user_token", b.token);\npm.environment.set("user_id", b.user.id);`,
  };

  const folders = [
    folder("00-setup", [setupItem, setupUser]),
    folder("01-domain", domain),
    folder("02-state", state),
    folder("03-security", security),
    folder("04-schema", schema),
  ];

  const preReq = readFileSync(join(ROOT, "postman", "prerequest-collection.js"), "utf8");
  const col = collection(`${SID}_${slug}`, folders, preReq);
  mkdirSync(join(ROOT, "postman", "collections"), { recursive: true });
  writeFileSync(join(ROOT, "postman", "collections", `${SID}_${slug}.postman_collection.json`), JSON.stringify(col, null, 2), "utf8");

  console.log(`[${slug}] generated.md: ${generated.length} case · extended.md: ${own.length} case · collection: ${all.length + 2} request`);
}

const args = process.argv.slice(2);
if (args[0] === "--all") {
  for (const slug of Object.keys(APIS)) await run(slug);
} else if (args[0]) {
  await run(args[0]);
} else {
  console.error("Dung: node tools/gen-artifacts.mjs <api-slug> | --all");
  process.exit(1);
}
