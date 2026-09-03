#!/usr/bin/env python3
"""package.py - Dong goi file nop theo §14.

    npm run package

Ten file theo dung §14: <MSSV>_HW06_AI_API_<DiemTuCham>.zip
Dung `git archive HEAD` nen chi lay file DA COMMIT -> tu dong loai node_modules,
.git va moi file tam; bai nop luon khop dung voi thu muc tren GitHub.
"""
import subprocess
import sys
from pathlib import Path

SID = "23127183"
GRADE = "100"                      # §14: dung 3 chu so
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT.parent / f"{SID}_HW06_AI_API_{GRADE}.zip"

# §14 doi dung 12 muc bat buoc (muc 9 OpenAPI la tuy chon)
REQUIRED = [
    "report/main-report.md", "report/main-report.pdf",
    "postman/collections/23127183_api-01-login.postman_collection.json",
    "postman/README.md",
    "ci/ci-report.md", "ci/screenshots/ci-run-xanh.png", "ci/screenshots/ci-run-do.png",
    "excel/23127183_HW06_TestCases.xlsx",
    "generator/diagram/generator-flow-selfdrawn.png", "generator/pseudocode.py",
    "bug-report/bug-report.md", "bug-report/screenshots/github-issues-list.png",
    "ai-audit/ai-audit-report.md", "ai-audit/ai-audit-report.pdf",
    "ai-audit/ai-critique.md", "ai-audit/ai-critique.pdf",
    "git-log/commit-log.txt", "README.md",
]


def tracked():
    r = subprocess.run(["git", "ls-files"], cwd=ROOT, capture_output=True, text=True, check=True)
    return set(r.stdout.splitlines())


def main():
    files = tracked()

    dirty = subprocess.run(["git", "status", "--porcelain"], cwd=ROOT,
                           capture_output=True, text=True, check=True).stdout.strip()
    if dirty:
        print("CANH BAO: con thay doi CHUA COMMIT - se KHONG nam trong zip:")
        for line in dirty.splitlines():
            print("   ", line)
        print()

    missing = [f for f in REQUIRED if f not in files]
    if missing:
        print("THIEU tai lieu §14 doi (§17: thieu 1 muc = 0 diem):")
        for m in missing:
            print("   ", m)
        return 1

    # co it nhat 1 bao cao Newman HTML
    if not any(f.startswith("reports/newman/") and f.endswith(".html") for f in files):
        print("THIEU bao cao Newman HTML trong reports/newman/")
        return 1

    OUT.unlink(missing_ok=True)
    subprocess.run(["git", "archive", "--format=zip", "-o", str(OUT), "HEAD"],
                   cwd=ROOT, check=True)

    mb = OUT.stat().st_size / 1024 / 1024
    print(f"Da dong goi: {OUT}")
    print(f"  {len(files)} file · {mb:.1f} MB")
    print(f"  Du 12/12 muc §14 bat buoc (muc 9 OpenAPI: tuy chon, khong lam)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
