#!/usr/bin/env node
// ci-gate — quyet dinh CI xanh hay do.
//
// Vi sao khong lay "0 assertion do" lam cong cho ca bo test:
// bo test chinh CO Y bat bug that cua SUT nen luon co assertion do. Lay 0 lam cong thi
// pipeline do vinh vien va mat het tin hieu hoi quy.
//
//   --strict          : do neu co BAT KY assertion do nao (dung cho regression suite,
//                       va dung de tao LUOT DO MAU ma §6 doi)
//   (mac dinh)        : so voi ci/expected-failures.json
//                       do tang  = hoi quy moi
//                       do giam  = SUT da sua HOAC test cua minh yeu di (ca hai deu can nguoi xem)
import { readFileSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const strict = args.includes("--strict");
const files = args.filter((a) => !a.startsWith("--"));
if (!files.length) { console.error("ci-gate: khong co file JSON nao"); process.exit(1); }

const baselinePath = join(ROOT, "ci", "expected-failures.json");
const baseline = existsSync(baselinePath) ? JSON.parse(readFileSync(baselinePath, "utf8")) : {};

let bad = false;
for (const f of files) {
  const run = JSON.parse(readFileSync(f, "utf8")).run;
  const failed = run.stats.assertions.failed;
  const key = basename(f).replace(/^ci-/, "").replace(/\.json$/, "");

  if (strict) {
    console.log(`${key}: ${failed} assertion do (cong: strict, phai = 0)`);
    if (failed !== 0) bad = true;
    continue;
  }
  const exp = baseline[key];
  if (exp === undefined) { console.log(`::warning::${key}: chua co baseline - them vao ci/expected-failures.json`); continue; }
  console.log(`${key}: ${failed} do / baseline ${exp}`);
  if (failed > exp) { console.error(`::error::${key}: HOI QUY MOI (+${failed - exp} assertion do)`); bad = true; }
  if (failed < exp) console.log(`::warning::${key}: do GIAM (${exp} -> ${failed}) - SUT da sua hay test yeu di? Nguoi phai xem.`);
}
process.exit(bad ? 1 : 0);
