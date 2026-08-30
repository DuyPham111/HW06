#!/usr/bin/env bash
# ============================================================================
# verify-bugs.sh — chay lai bang chung tung bug bang curl, DOC LAP voi Postman.
#
# Vi sao can file nay:
#   1. §6.5 doi bug "genuine" - tai hien duoc, khong phai suy tu doc code
#   2. §13 co van dap: mo file nay chay tai cho truoc mat TA
#   3. Assertion do trong Newman chi noi "co gi do sai"; script nay cho thay
#      DU LIEU THAT SU DOI - do moi la bang chung
#
# Cach dung:
#   bash bug-report/verify-bugs.sh          # chay tat ca
#   bash bug-report/verify-bugs.sh 03       # chay rieng BUG-03
#
# Luu output:
#   bash bug-report/verify-bugs.sh > bug-report/verify-bugs-output.txt 2>&1
#
# YEU CAU: SUT vua duoc restart (DB seed lai sach) truoc khi chay.
# ============================================================================
set -uo pipefail

BASE=${BASE_URL:-http://localhost:3000}
SID=23127183
H=(-H "Content-Type: application/json" -H "X-Student-Id: $SID")
ONLY=${1:-}

bug() { echo; echo "===== BUG-$1: $2 ====="; }
want() { echo "-- DAC TA DOI: $*"; }
run()  { echo "\$ $*"; "$@"; echo; }

echo "verify-bugs.sh | SUT=$BASE | SV=$SID | $(date -Iseconds)"

# ---------------------------------------------------------------------------
# MAU - xoa comment va sua lai theo bug that cua ban.
# Moi khoi: bug() -> want() -> cac lenh curl -> ket qua tu no lo ra.
# ---------------------------------------------------------------------------

# if [ -z "$ONLY" ] || [ "$ONLY" = "01" ]; then
#   bug 01 "FR-09: cong thuc percent sai - SAVE10 tren don 500.000"
#   want "discount_amount=50000, final_amount=450000 (FR-09: total x value / 100)"
#   run curl -s "${H[@]}" -X POST "$BASE/api/apply-coupon" \
#       -d '{"code":"SAVE10","total_amount":500000,"user_id":2}'
# fi

# if [ -z "$ONLY" ] || [ "$ONLY" = "02" ]; then
#   bug 02 "SEC-02/SEC-03: PUT /api/products/:id khong yeu cau xac thuc"
#   want "401 (khong token) hoac 403 (khong phai admin), du lieu KHONG doi"
#   echo "-- truoc:"; run curl -s "$BASE/api/products/3"
#   echo "-- PUT khong co header Authorization:"
#   run curl -s "${H[@]}" -X PUT "$BASE/api/products/3" \
#       -d '{"name":"BI SUA BOI NGUOI LA","price":1,"description":"x","imageUrl":"","category_id":1}'
#   echo "-- sau:"; run curl -s "$BASE/api/products/3"
# fi

# if [ -z "$ONLY" ] || [ "$ONLY" = "03" ]; then
#   bug 03 "FR-02: khoa tai khoan sai nguong va sai thoi gian"
#   want "bo dem +1 moi lan sai; khoa tu lan thu 3; khoa 30 giay"
#   run curl -s -o /dev/null -w "lan 1 -> HTTP %{http_code}\n" "${H[@]}" \
#       -X POST "$BASE/api/login" -d '{"email":"test@eshop.com","password":"SAI"}'
#   run curl -s -w "\nlan 2 -> HTTP %{http_code}\n" "${H[@]}" \
#       -X POST "$BASE/api/login" -d '{"email":"test@eshop.com","password":"SAI"}'
#   echo "-- dang nhap DUNG sau 2 lan sai (theo FR-02 phai vao duoc):"
#   run curl -s -w "\n-> HTTP %{http_code}\n" "${H[@]}" \
#       -X POST "$BASE/api/login" -d '{"email":"test@eshop.com","password":"Test1234!"}'
# fi

echo
echo "Xong. Nho restart SUT truoc khi chay lai (DB duoc seed lai moi lan khoi dong)."
