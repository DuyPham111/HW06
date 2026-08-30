#!/usr/bin/env bash
# run-newman.sh — chay 1 hoac ca 3 collection, xuat HTML + JSON co timestamp.
#
# Cach dung:
#   bash tools/run-newman.sh api-01-login
#   bash tools/run-newman.sh --all
#
# Ba dieu script nay lo ho ban:
#   1. Goi preflight truoc  -> khong chay tren SUT chet / tai khoan bi khoa
#   2. Dat ten file theo <MSSV>_<slug>_<YYYYmmdd-HHMMSS> -> khong ghi de luot cu (§14 doi bang chung)
#   3. Xuat CA HTML (de nop) VA JSON (de tools/summarize-newman.mjs tinh lai so lieu)
set -uo pipefail

SID=23127183
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENVF="$ROOT/postman/environments/HW06-local.postman_environment.json"
OUT="$ROOT/reports/newman"
TS="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$OUT"

# Dung newman global neu co; khong thi fallback ve npx (node_modules cuc bo, xem package.json).
if command -v newman >/dev/null 2>&1; then
  NEWMAN=(newman)
else
  NEWMAN=(npx --no-install newman)
fi

node "$ROOT/tools/preflight.mjs" || { echo "preflight that bai - dung lai"; exit 1; }

run_one() {
  local slug="$1"
  local col="$ROOT/postman/collections/${SID}_${slug}.postman_collection.json"
  [ -f "$col" ] || { echo "::bo qua:: chua co $col"; return 0; }
  echo "=== Newman: $slug ==="
  "${NEWMAN[@]}" run "$col" \
    -e "$ENVF" \
    --reporters cli,json,htmlextra \
    --reporter-json-export "$OUT/${SID}_${slug}_${TS}.json" \
    --reporter-htmlextra-export "$OUT/${SID}_${slug}_${TS}.html" \
    --reporter-htmlextra-logs \
    --reporter-htmlextra-title "HW06 ${slug} — ${SID}" \
    --timeout-request 10000
  echo "exit=$? (assertion do la KET QUA MONG DOI cua bo test nay - xem docs/07)"
}

if [ "${1:---all}" = "--all" ]; then
  for s in api-01-login api-02-apply-coupon api-03-product-update; do run_one "$s"; done
else
  run_one "$1"
fi

echo
echo "Bao cao: $OUT"
echo "Tiep theo: npm run summary   (tinh lai so lieu tu raw JSON - DUNG go tay)"
