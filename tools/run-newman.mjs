#!/usr/bin/env node
// run-newman.mjs — chay 1 hoac ca 3 collection, xuat HTML + JSON co timestamp.
//
// Cach dung:
//   npm run test:api1
//   node tools/run-newman.mjs api-01-login
//   node tools/run-newman.mjs --all
//
// VI SAO LA .mjs CHU KHONG PHAI .sh:
//   Ban .sh cu goi qua "bash tools/run-newman.sh". Tren Windows, npm chay script bang cmd.exe,
//   va cmd.exe resolve "bash" theo PATH -> trung C:\WINDOWS\system32\bash.exe (WSL launcher)
//   TRUOC Git Bash. WSL la mot he thong file khac, khong co Node -> "node: command not found".
//   Ban Node nay khong phu thuoc shell nao ca: chay giong het tren PowerShell, cmd, Git Bash, Linux.
//
// Ba dieu script nay lo ho ban (giu nguyen tu ban .sh):
//   1. Goi preflight truoc  -> khong chay tren SUT chet / tai khoan bi khoa
//   2. Dat ten file theo <MSSV>_<slug>_<YYYYmmdd-HHMMSS> -> khong ghi de luot cu (§14 doi bang chung)
//   3. Xuat CA HTML (de nop) VA JSON (de tools/summarize-newman.mjs tinh lai so lieu)

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import newman from "newman";

const SID = "23127183";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ENVF = join(ROOT, "postman/environments/HW06-local.postman_environment.json");
const OUT = join(ROOT, "reports/newman");
const ALL = ["api-01-login", "api-02-apply-coupon", "api-03-product-update"];

const ts = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
};
const TS = ts();

mkdirSync(OUT, { recursive: true });

// --- Preflight ---------------------------------------------------------------
// process.execPath = dung chinh binary Node dang chay, khong tra PATH -> khong the "not found".
const pre = spawnSync(process.execPath, [join(ROOT, "tools/preflight.mjs")], { stdio: "inherit" });
if (pre.status !== 0) {
  console.error("preflight that bai - dung lai");
  process.exit(1);
}

// --- Chay 1 collection -------------------------------------------------------
function runOne(slug) {
  return new Promise((done) => {
    const col = join(ROOT, `postman/collections/${SID}_${slug}.postman_collection.json`);
    if (!existsSync(col)) {
      console.log(`::bo qua:: chua co ${col}`);
      return done();
    }
    const htmlOut = join(OUT, `${SID}_${slug}_${TS}.html`);
    const jsonOut = join(OUT, `${SID}_${slug}_${TS}.json`);
    console.log(`=== Newman: ${slug} ===`);
    newman.run(
      {
        collection: col,
        environment: ENVF,
        reporters: ["cli", "json", "htmlextra"],
        reporter: {
          json: { export: jsonOut },
          htmlextra: { export: htmlOut, logs: true, title: `HW06 ${slug} — ${SID}` },
        },
        timeoutRequest: 10000,
      },
      (err, summary) => {
        if (err) {
          console.error(`Newman loi khi chay ${slug}:`, err.message);
          return done();
        }
        const f = summary.run.stats.assertions.failed;
        // KHONG exit(1) khi co assertion do: bo test nay CO Y bat bug, do la ket qua mong doi.
        console.log(`assertion do: ${f} (assertion do la KET QUA MONG DOI cua bo test nay - xem docs/07)`);
        // In thang duong dan: quay video / nop bai khong phai mo thu muc mo file moi nhat.
        console.log(`Bao cao HTML: ${htmlOut}`);
        console.log(`Bao cao JSON: ${jsonOut}`);
        done();
      },
    );
  });
}

// --- Main --------------------------------------------------------------------
const arg = process.argv[2] || "--all";
const slugs = arg === "--all" ? ALL : [arg];

for (const s of slugs) await runOne(s); // tuan tu: SUT co trang thai, chay song song se nhiem ban nhau

console.log(`\nBao cao: ${OUT}`);
console.log("Tiep theo: npm run summary   (tinh lai so lieu tu raw JSON - DUNG go tay)");
