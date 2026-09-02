#!/usr/bin/env bash
# run-newman.sh — WRAPPER MONG. Toan bo logic nam o tools/run-newman.mjs (mot nguon duy nhat).
#
# Giu file nay lai vi cac doc cu (docs/07, docs/12...) va thoi quen go tay van dung:
#   bash tools/run-newman.sh api-01-login
#   bash tools/run-newman.sh --all
#
# Vi sao logic chuyen sang .mjs: tren Windows, "npm run test:api1" duoc cmd.exe chay, va cmd.exe
# resolve "bash" theo PATH -> trung C:\WINDOWS\system32\bash.exe (WSL) TRUOC Git Bash. WSL khong
# co Node -> "node: command not found". Ban .mjs khong phu thuoc shell nen chay o dau cung duoc.
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec node "$ROOT/tools/run-newman.mjs" "$@"
