#!/usr/bin/env node
// split-bug-issues.mjs — tach bug-report/bug-report.md thanh tung file issue rieng trong
// bug-report/issues/BUG-XX.md, de ban chi viec MO FILE -> COPY toan bo noi dung -> DAN vao
// GitHub New Issue -> KEO ANH minh hoa vao (buoc duy nhat khong tu dong hoa duoc).
//
// Chay: node tools/split-bug-issues.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(ROOT, "bug-report", "bug-report.md"), "utf8");
const outDir = join(ROOT, "bug-report", "issues");
mkdirSync(outDir, { recursive: true });

// Cat theo "### BUG-XX — ..." toi truoc "---" hoac "### BUG-" tiep theo hoac het section 3.
const lines = src.split("\n");
let cur = null;
const bugs = [];
for (const line of lines) {
  const m = line.match(/^### (BUG-\d+) — (.+)$/);
  if (m) {
    if (cur) bugs.push(cur);
    cur = { id: m[1], title: m[2], body: [] };
    continue;
  }
  if (cur) {
    if (line.startsWith("## 4. Giả thuyết")) { bugs.push(cur); cur = null; continue; }
    cur.body.push(line);
  }
}
if (cur) bugs.push(cur);

let count = 0;
for (const bug of bugs) {
  // bo dong '---' cuoi cung neu co
  let body = bug.body.join("\n").trim();
  body = body.replace(/\n---\s*$/, "").trim();
  const num = bug.id.replace("BUG-", "");
  const levelMatch = body.match(/\*\*Mức độ\*\*\s*\|\s*(\*\*)?([A-Za-z]+)/);
  const level = levelMatch ? levelMatch[2] : "?";
  const apiMatch = body.match(/\*\*API\*\*\s*\|\s*(API-\d+)/);
  const api = apiMatch ? apiMatch[1] : "?";

  const md = `# [BUG-${num}][${level}][${api}] ${bug.title}

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label \`bug\`, \`${level.toLowerCase()}\`, \`${api.toLowerCase()}\` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

${body}
`;
  writeFileSync(join(outDir, `BUG-${num.padStart(2, "0")}.md`), md, "utf8");
  count++;
}

console.log(`Da tach ${count} bug -> bug-report/issues/BUG-XX.md`);
