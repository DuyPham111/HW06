#!/usr/bin/env python3
"""build-pdfs.py - Xuat 6 tai lieu §14 doi kem ban PDF.

Cach dung:  npm run pdf     (hoac: python tools/build-pdfs.py)

Khong can cai them gi: dung python-markdown (da co) + Microsoft Edge o che do
headless (--print-to-pdf) da cai san tren Windows. File .html trung gian duoc
ghi CANH file .md de duong dan anh tuong doi (screenshots/...) van phan giai dung,
sau do xoa di.
"""
import os
import subprocess
import sys
import time
from pathlib import Path

import markdown

ROOT = Path(__file__).resolve().parent.parent
DOCS = [
    "report/main-report.md",
    "ai-audit/ai-audit-report.md",
    "ai-audit/ai-critique.md",
    "bug-report/bug-report.md",
    "ci/ci-report.md",
    "generator/design.md",
]

EDGE_CANDIDATES = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
]

CSS = """
@page { size: A4; margin: 16mm 14mm; }
body { font-family: "Segoe UI", Arial, sans-serif; font-size: 10.5pt; line-height: 1.5;
       color: #111; max-width: 100%; }
h1 { font-size: 19pt; border-bottom: 2px solid #333; padding-bottom: 4px; }
h2 { font-size: 15pt; margin-top: 18px; border-bottom: 1px solid #bbb; padding-bottom: 3px; }
h3 { font-size: 12.5pt; margin-top: 14px; }
h4 { font-size: 11pt; }
code { background: #f2f2f2; padding: 1px 4px; border-radius: 3px;
       font-family: Consolas, "Courier New", monospace; font-size: 9pt; }
pre { background: #f6f6f6; border: 1px solid #ddd; border-radius: 4px; padding: 8px;
      overflow-x: auto; white-space: pre-wrap; word-wrap: break-word; font-size: 8.5pt; }
pre code { background: none; padding: 0; font-size: 8.5pt; }
table { border-collapse: collapse; width: 100%; margin: 10px 0; font-size: 8.5pt;
        table-layout: fixed; }
th, td { border: 1px solid #ccc; padding: 4px 6px; text-align: left; vertical-align: top;
         word-wrap: break-word; overflow-wrap: anywhere; }
th { background: #eee; font-weight: 600; }
blockquote { border-left: 3px solid #888; margin: 10px 0; padding: 4px 12px;
             background: #fafafa; color: #333; }
img { max-width: 100%; height: auto; border: 1px solid #ddd; }
a { color: #0645ad; text-decoration: none; word-break: break-all; }
hr { border: 0; border-top: 1px solid #ccc; margin: 16px 0; }
h1, h2, h3 { page-break-after: avoid; }
table, pre, img { page-break-inside: avoid; }
"""


def find_edge():
    for p in EDGE_CANDIDATES:
        if Path(p).exists():
            return p
    return None


def main():
    edge = find_edge()
    if not edge:
        print("Khong tim thay Microsoft Edge. Cach thay the: VS Code + extension yzane.markdown-pdf")
        return 1

    md = markdown.Markdown(extensions=["tables", "fenced_code", "toc", "sane_lists", "nl2br"])
    ok = 0
    for rel in DOCS:
        src = ROOT / rel
        if not src.exists():
            print(f"  BO QUA  {rel} (khong ton tai)")
            continue

        md.reset()
        body = md.convert(src.read_text(encoding="utf-8"))
        html = (
            f'<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8">'
            f"<title>{src.stem}</title><style>{CSS}</style></head><body>{body}</body></html>"
        )

        tmp_html = src.with_suffix(".pdf.tmp.html")  # canh file .md -> anh tuong doi van dung
        pdf = src.with_suffix(".pdf")
        tmp_html.write_text(html, encoding="utf-8")

        try:
            subprocess.run(
                [edge, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                 f"--print-to-pdf={pdf}", tmp_html.as_uri()],
                check=False, capture_output=True, timeout=120,
            )
            for _ in range(20):          # Edge ghi file bat dong bo
                if pdf.exists() and pdf.stat().st_size > 0:
                    break
                time.sleep(0.5)
        finally:
            tmp_html.unlink(missing_ok=True)

        if pdf.exists() and pdf.stat().st_size > 0:
            print(f"  OK      {rel}  ->  {pdf.name}  ({pdf.stat().st_size // 1024} KB)")
            ok += 1
        else:
            print(f"  LOI     {rel}  (Edge khong xuat duoc PDF)")

    print(f"\nXuat duoc {ok}/{len(DOCS)} PDF.")
    return 0 if ok == len(DOCS) else 1


if __name__ == "__main__":
    sys.exit(main())
