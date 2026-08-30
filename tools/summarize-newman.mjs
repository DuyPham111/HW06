#!/usr/bin/env node
// summarize-newman — NGUON SO LIEU DUY NHAT cua bai nay.
// Doc reports/newman/*.json (raw cua Newman) -> sinh test-cases/test-summary/summary.md
// README va main-report deu PHAI copy so tu file nay, khong go tay.
//
// Chay: npm run summary
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "reports", "newman");
const SLUGS = ["api-01-login", "api-02-apply-coupon", "api-03-product-update"];

// Voi moi slug lay luot chay MOI NHAT (ten file co timestamp nen sort la du).
const latest = {};
let files = [];
try { files = readdirSync(DIR).filter((f) => f.endsWith(".json")); } catch {}
for (const slug of SLUGS) {
  const m = files.filter((f) => f.includes(slug)).sort();
  if (m.length) latest[slug] = m[m.length - 1];
}

const rows = [];
let T = { req: 0, asr: 0, pass: 0, fail: 0 };
const failedList = [];

for (const slug of SLUGS) {
  const f = latest[slug];
  if (!f) { rows.push([slug, "—", "—", "—", "—", "*(chua chay)*"]); continue; }
  const run = JSON.parse(readFileSync(join(DIR, f), "utf8")).run;
  const req = run.stats.requests.total;
  const asr = run.stats.assertions.total;
  const fail = run.stats.assertions.failed;
  const pass = asr - fail;
  T = { req: T.req + req, asr: T.asr + asr, pass: T.pass + pass, fail: T.fail + fail };
  rows.push([slug, req, asr, pass, fail, f]);
  for (const e of run.failures || []) {
    failedList.push({ slug, item: e.source?.name ?? "(?)", test: e.error?.test ?? e.error?.message ?? "" });
  }
}

const md = `# Test summary — sinh tu dong bang \`npm run summary\`

> **Dung go tay so nao trong file nay.** Moi con so doc tu \`reports/newman/*.json\`.
> Sinh luc: ${new Date().toISOString()}

| Collection | Request | Assertion | Pass | **Fail** | Raw JSON |
|---|--:|--:|--:|--:|---|
${rows.map((r) => `| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} | **${r[4]}** | \`${r[5]}\` |`).join("\n")}
| **Tong** | **${T.req}** | **${T.asr}** | **${T.pass}** | **${T.fail}** | |

## Assertion do — moi dong phai map toi 1 bug trong bug-report/bug-report.md

| Collection | Request | Assertion that bai |
|---|---|---|
${failedList.map((x) => `| ${x.slug} | ${x.item} | ${x.test} |`).join("\n") || "| — | — | *(chua co luot chay nao)* |"}

> **Assertion do o day la KET QUA MONG DOI.** Expected cua bo test bam theo DAC TA (FR/SEC),
> khong bam theo hanh vi hien tai cua SUT. SUT co bug co y -> do = phat hien duoc bug.
> Sua expected cho khop SUT la cach nhanh nhat de bo test mat het gia tri.
`;

mkdirSync(join(ROOT, "test-cases", "test-summary"), { recursive: true });
writeFileSync(join(ROOT, "test-cases", "test-summary", "summary.md"), md, "utf8");
console.log(md);
console.log("-> test-cases/test-summary/summary.md");
