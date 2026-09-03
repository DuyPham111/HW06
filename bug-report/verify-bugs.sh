#!/usr/bin/env bash
# ============================================================================
# verify-bugs.sh — chay lai bang chung tung bug bang curl, DOC LAP voi Postman.
#
# Cach dung:
#   bash bug-report/verify-bugs.sh          # chay tat ca (TRU BUG-19, xem duoi)
#   bash bug-report/verify-bugs.sh 08        # chay rieng 1 bug (vd BUG-08)
#   bash bug-report/verify-bugs.sh 19        # BUG-19 - LAM SAP SUT, chi chay khi go so nay
#
# YEU CAU: SUT vua duoc restart (DB seed lai sach) truoc khi chay `--all`.
# LUU Y: BUG-19 lam SAP TOAN BO BACKEND. Khong nam trong nhom --all mac dinh.
#        Chay xong BUG-19 phai KHOI DONG LAI SUT truoc khi chay bug khac.
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

get_token() {
  curl -s -X POST "$BASE/api/login" "${H[@]}" -d "{\"email\":\"$1\",\"password\":\"$2\"}" \
    | grep -o '"token":"[^"]*"' | cut -d'"' -f4
}

# ---------------------------------------------------------------------------
if [ -z "$ONLY" ] || [ "$ONLY" = "01" ]; then
  bug 01 "DoS lockout - khoa tai khoan nguoi khac chi bang email, khong can mat khau"
  want "request thieu password phai bi tu choi (400) truoc khi cham bo dem sai"
  V="victim-$(date +%s)@x.com"
  run curl -s "${H[@]}" -X POST "$BASE/api/register" -d "{\"name\":\"Victim\",\"email\":\"$V\",\"password\":\"RealPass1!\"}"
  echo "-- request 1 (thieu password):"; run curl -s -w " -> HTTP %{http_code}\n" "${H[@]}" -X POST "$BASE/api/login" -d "{\"email\":\"$V\"}"
  echo "-- request 2 (thieu password):"; run curl -s -w " -> HTTP %{http_code}\n" "${H[@]}" -X POST "$BASE/api/login" -d "{\"email\":\"$V\"}"
  echo "-- request 3 (CHU THAT, mat khau DUNG):"; run curl -s -w " -> HTTP %{http_code}\n" "${H[@]}" -X POST "$BASE/api/login" -d "{\"email\":\"$V\",\"password\":\"RealPass1!\"}"
fi

if [ -z "$ONLY" ] || [ "$ONLY" = "02" ]; then
  bug 02 "Khoa tu lan sai thu 2, khong phai lan thu 3 nhu FR-02"
  want "request thu 3 (mat khau DUNG) phai THANH CONG vi moi 2 lan sai that su"
  V="lock2-$(date +%s)@x.com"
  run curl -s "${H[@]}" -X POST "$BASE/api/register" -d "{\"name\":\"L2\",\"email\":\"$V\",\"password\":\"Right1!\"}"
  run curl -s -w " -> HTTP %{http_code}\n" "${H[@]}" -X POST "$BASE/api/login" -d "{\"email\":\"$V\",\"password\":\"sai1\"}"
  run curl -s -w " -> HTTP %{http_code}\n" "${H[@]}" -X POST "$BASE/api/login" -d "{\"email\":\"$V\",\"password\":\"sai2\"}"
  run curl -s -w " -> HTTP %{http_code}\n" "${H[@]}" -X POST "$BASE/api/login" -d "{\"email\":\"$V\",\"password\":\"Right1!\"}"
fi

if [ -z "$ONLY" ] || [ "$ONLY" = "03" ]; then
  bug 03 "SEC-01: response dang nhap lo nguyen mat khau plaintext"
  want "user.password KHONG duoc xuat hien trong response"
  run curl -s "${H[@]}" -X POST "$BASE/api/login" -d '{"email":"test@eshop.com","password":"Test1234!"}'
fi

if [ -z "$ONLY" ] || [ "$ONLY" = "05" ]; then
  bug 05 "SEC-02: JWT khong co claim exp"
  want "token phai co claim exp"
  T=$(get_token "test@eshop.com" "Test1234!")
  PAYLOAD=$(echo "$T" | cut -d. -f2 | tr '_-' '/+')
  echo "payload JWT (base64): $PAYLOAD"
  echo "$PAYLOAD==" | base64 -d 2>/dev/null || echo "(khong decode duoc bang base64 CLI - xem token o tren, dan vao jwt.io)"
fi

if [ -z "$ONLY" ] || [ "$ONLY" = "06" ]; then
  bug 06 "Crash 500 + lo stack trace khi thieu dung Content-Type"
  want "khong duoc 500, khong duoc lo duong dan he thong"
  run curl -s -w "\nHTTP %{http_code}\n" -X POST "$BASE/api/login" -H "Content-Type: text/plain" -H "X-Student-Id: $SID" -d '{"email":"test@eshop.com","password":"Test1234!"}'
fi

if [ -z "$ONLY" ] || [ "$ONLY" = "08" ]; then
  bug 08 "Dang ky email trung khong bi chan - tai khoan sau mat quyen dang nhap"
  want "tai khoan dang ky SAU phai dang nhap duoc bang DUNG mat khau cua no"
  E="dup-$(date +%s)@x.com"
  run curl -s "${H[@]}" -X POST "$BASE/api/register" -d "{\"name\":\"D1\",\"email\":\"$E\",\"password\":\"Pass1!\"}"
  run curl -s "${H[@]}" -X POST "$BASE/api/register" -d "{\"name\":\"D2\",\"email\":\"$E\",\"password\":\"Pass2!\"}"
  echo "-- login voi mat khau tai khoan D2 (dang ky SAU):"
  run curl -s -w " -> HTTP %{http_code}\n" "${H[@]}" -X POST "$BASE/api/login" -d "{\"email\":\"$E\",\"password\":\"Pass2!\"}"
fi

if [ -z "$ONLY" ] || [ "$ONLY" = "09" ]; then
  bug 09 "Account enumeration qua kenh phu - so sanh status code cua request thu 3"
  want "email TON TAI va email KHONG ton tai phai cho ket qua GIONG NHAU (FR-02: khong lo chi tiet nguyen nhan)"

  V="enum-$(date +%s)@x.com"
  run curl -s "${H[@]}" -X POST "$BASE/api/register" -d "{\"name\":\"EN\",\"email\":\"$V\",\"password\":\"Right1!\"}"

  echo "-- A) email TON TAI: 3 lan sai mat khau lien tiep"
  for i in 1 2 3; do
    run curl -s -o /dev/null -w "   lan $i -> HTTP %{http_code}
" "${H[@]}"       -X POST "$BASE/api/login" -d "{\"email\":\"$V\",\"password\":\"sai$i\"}"
  done

  echo "-- B) email KHONG ton tai: cung 3 lan sai"
  G="khong-ton-tai-$(date +%s)@x.com"
  for i in 1 2 3; do
    run curl -s -o /dev/null -w "   lan $i -> HTTP %{http_code}
" "${H[@]}"       -X POST "$BASE/api/login" -d "{\"email\":\"$G\",\"password\":\"sai$i\"}"
  done

  echo "   => Lan 3 khac nhau (403 vs 401) = do duoc email nao CO tai khoan that."
fi

if [ -z "$ONLY" ] || [ "$ONLY" = "10" ]; then
  bug 10 "Cong thuc coupon percent sai dau - SAVE10 tren 500.000"
  want "discount_amount=50000, final_amount=450000 (FR-09: total x value / 100)"
  run curl -s "${H[@]}" -X POST "$BASE/api/apply-coupon" -d '{"code":"SAVE10","total_amount":500000}'
fi

if [ -z "$ONLY" ] || [ "$ONLY" = "11" ]; then
  bug 11 "apply-coupon khong yeu cau xac thuc (FR-09 C4)"
  want "401 khi khong co Authorization"
  run curl -s -w " -> HTTP %{http_code}\n" "${H[@]}" -X POST "$BASE/api/apply-coupon" -d '{"code":"SAVE10","total_amount":500000}'
fi

if [ -z "$ONLY" ] || [ "$ONLY" = "12" ]; then
  bug 12 "Bien min_order_amount dung > thay vi >= (FR-09 C3)"
  want "total_amount = 300000 (dung bang min_order_amount cua SAVE10) phai duoc CHAP NHAN"
  run curl -s -w " -> HTTP %{http_code}\n" "${H[@]}" -X POST "$BASE/api/apply-coupon" -d '{"code":"SAVE10","total_amount":300000}'
fi

if [ -z "$ONLY" ] || [ "$ONLY" = "13" ]; then
  bug 13 "IDOR/bo qua han muc qua user_id trong body"
  want "khong gui user_id thi PHAI van bi kiem han muc, khong duoc bo qua"
  UT=$(get_token "test@eshop.com" "Test1234!")
  UID_REAL=$(curl -s -X POST "$BASE/api/login" -H "Content-Type: application/json" -d '{"email":"test@eshop.com","password":"Test1234!"}' | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
  echo "-- dung het 2/2 luot That (user_id=$UID_REAL that):"
  run curl -s "${H[@]}" -X POST "$BASE/api/apply-coupon" -d "{\"code\":\"VIP100\",\"total_amount\":400000,\"user_id\":$UID_REAL}"
  run curl -s "${H[@]}" -H "Authorization: Bearer $UT" -X POST "$BASE/api/coupon-usage" -d '{"coupon_id":3}'
  run curl -s "${H[@]}" -X POST "$BASE/api/apply-coupon" -d "{\"code\":\"VIP100\",\"total_amount\":400000,\"user_id\":$UID_REAL}"
  run curl -s "${H[@]}" -H "Authorization: Bearer $UT" -X POST "$BASE/api/coupon-usage" -d '{"coupon_id":3}'
  echo "-- lan 3 KHONG gui user_id (phai van bi chan neu C5 dung, nhung se THANH CONG):"
  run curl -s -w " -> HTTP %{http_code}\n" "${H[@]}" -X POST "$BASE/api/apply-coupon" -d '{"code":"VIP100","total_amount":400000}'
fi

if [ -z "$ONLY" ] || [ "$ONLY" = "14" ]; then
  bug 14 "Checkout khong xac thuc total_amount (price tampering)"
  want "400 - total_amount khong duoc tin tuong tu client khong qua kiem tra"
  UT=$(get_token "test@eshop.com" "Test1234!")
  run curl -s -w " -> HTTP %{http_code}\n" "${H[@]}" -H "Authorization: Bearer $UT" -X POST "$BASE/api/checkout" -d '{"total_amount":1,"shipping_address":"gia mao"}'
fi

if [ -z "$ONLY" ] || [ "$ONLY" = "15" ]; then
  bug 15 "GET /api/orders/:id khong yeu cau xac thuc (IDOR)"
  want "401 khi khong co token"
  run curl -s -w " -> HTTP %{http_code}\n" "$BASE/api/orders/1"
fi

if [ -z "$ONLY" ] || [ "$ONLY" = "16" ]; then
  bug 16 "Huy duoc don dang shipping (vi pham FR-10)"
  want "400 - chi duoc huy khi pending/confirmed"
  UT=$(get_token "test@eshop.com" "Test1234!")
  AT=$(get_token "admin@eshop.com" "Admin123!")
  OID=$(curl -s "${H[@]}" -H "Authorization: Bearer $UT" -X POST "$BASE/api/checkout" -d '{"total_amount":100000,"shipping_address":"x"}' | grep -o '"orderId":[0-9]*' | cut -d: -f2)
  echo "orderId=$OID"
  run curl -s "${H[@]}" -H "Authorization: Bearer $AT" -X PUT "$BASE/api/admin/orders/$OID/status" -d '{"status":"confirmed"}'
  run curl -s "${H[@]}" -H "Authorization: Bearer $AT" -X PUT "$BASE/api/admin/orders/$OID/status" -d '{"status":"shipping"}'
  echo "-- user tu huy don dang shipping:"
  run curl -s -w " -> HTTP %{http_code}\n" "${H[@]}" -H "Authorization: Bearer $UT" -X PUT "$BASE/api/orders/$OID/cancel"
fi

if [ -z "$ONLY" ] || [ "$ONLY" = "17" ]; then
  bug 17 "canceled khong phai trang thai ket thuc that (chuyen duoc sang delivered)"
  want "400 - canceled la trang thai ket thuc, khong duoc chuyen di dau"
  UT=$(get_token "test@eshop.com" "Test1234!")
  AT=$(get_token "admin@eshop.com" "Admin123!")
  OID=$(curl -s "${H[@]}" -H "Authorization: Bearer $UT" -X POST "$BASE/api/checkout" -d '{"total_amount":100000,"shipping_address":"x"}' | grep -o '"orderId":[0-9]*' | cut -d: -f2)
  run curl -s "${H[@]}" -H "Authorization: Bearer $UT" -X PUT "$BASE/api/orders/$OID/cancel"
  run curl -s -w " -> HTTP %{http_code}\n" "${H[@]}" -H "Authorization: Bearer $AT" -X PUT "$BASE/api/admin/orders/$OID/status" -d '{"status":"delivered"}'
fi

if [ -z "$ONLY" ] || [ "$ONLY" = "18" ]; then
  bug 18 "Doi trang thai don khong kiem role admin (SEC-03)"
  want "403 - user thuong khong duoc goi endpoint admin"
  UT=$(get_token "test@eshop.com" "Test1234!")
  OID=$(curl -s "${H[@]}" -H "Authorization: Bearer $UT" -X POST "$BASE/api/checkout" -d '{"total_amount":100000,"shipping_address":"x"}' | grep -o '"orderId":[0-9]*' | cut -d: -f2)
  run curl -s -w " -> HTTP %{http_code}\n" "${H[@]}" -H "Authorization: Bearer $UT" -X PUT "$BASE/api/admin/orders/$OID/status" -d '{"status":"confirmed"}'
fi

if [ "$ONLY" = "19" ]; then
  bug 19 "!!! DoS - PUT thieu truong tren id CHAN + GET lam SAP TOAN BO BACKEND !!!"
  want "PUT thieu truong phai bi tu choi TRUOC khi cham DB; du co NULL thi GET khong duoc crash tien trinh"
  AT=$(get_token "admin@eshop.com" "Admin123!")
  echo "-- truoc (id=2):"; run curl -s "$BASE/api/products/2"
  echo "-- PUT chi gui {name} tren id=2 (CHAN):"
  run curl -s "${H[@]}" -H "Authorization: Bearer $AT" -X PUT "$BASE/api/products/2" -d '{"name":"Trigger Crash"}'
  echo "-- GET lai id=2 (SE LAM SAP SERVER):"
  run curl -s --max-time 5 "$BASE/api/products/2" || echo "!!! KHONG KET NOI DUOC - SUT DA SAP (dung nhu du doan) !!!"
  echo
  echo "!!! SUT DA CHET. Phai khoi dong lai truoc khi chay bug khac: cd eshop-sut/backend && node server.js !!!"
fi

if [ -z "$ONLY" ] || [ "$ONLY" = "20" ]; then
  bug 20 "Cap nhat mot phan xoa mat du lieu (set NULL) - dung id LE (an toan)"
  want "cac truong khong gui phai GIU NGUYEN, khong duoc NULL"
  AT=$(get_token "admin@eshop.com" "Admin123!")
  echo "-- truoc (id=3):"; run curl -s "$BASE/api/products/3"
  run curl -s "${H[@]}" -H "Authorization: Bearer $AT" -X PUT "$BASE/api/products/3" -d '{"name":"Chi doi ten"}'
  echo "-- sau (cac truong khac co con khong):"; run curl -s "$BASE/api/products/3"
fi

if [ -z "$ONLY" ] || [ "$ONLY" = "21" ]; then
  bug 21 "PUT/DELETE /api/products/:id khong yeu cau xac thuc"
  want "401 khi khong co token"
  echo "-- truoc (id=5):"; run curl -s "$BASE/api/products/5"
  run curl -s "${H[@]}" -X PUT "$BASE/api/products/5" -d '{"name":"BI SUA KHONG TOKEN","price":1,"description":"x","imageUrl":"","category_id":1}'
  echo "-- sau:"; run curl -s "$BASE/api/products/5"
fi

if [ -z "$ONLY" ] || [ "$ONLY" = "22" ]; then
  bug 22 "PUT khong kiem role admin (SEC-03)"
  want "403 - user thuong khong duoc sua san pham"
  UT=$(get_token "test@eshop.com" "Test1234!")
  run curl -s -w " -> HTTP %{http_code}\n" "${H[@]}" -H "Authorization: Bearer $UT" -X PUT "$BASE/api/products/1" -d '{"name":"x","price":1,"description":"x","imageUrl":"","category_id":1}'
fi

if [ -z "$ONLY" ] || [ "$ONLY" = "23" ]; then
  bug 23 "Khong validate name/price/category_id (FR-15)"
  want "400 cho tung truong hop"
  AT=$(get_token "admin@eshop.com" "Admin123!")
  echo "-- name rong:"; run curl -s -w " -> HTTP %{http_code}\n" "${H[@]}" -H "Authorization: Bearer $AT" -X PUT "$BASE/api/products/1" -d '{"name":"","price":1000,"description":"x","imageUrl":"","category_id":1}'
  echo "-- price = 0:"; run curl -s -w " -> HTTP %{http_code}\n" "${H[@]}" -H "Authorization: Bearer $AT" -X PUT "$BASE/api/products/1" -d '{"name":"x","price":0,"description":"x","imageUrl":"","category_id":1}'
  echo "-- category_id khong ton tai:"; run curl -s -w " -> HTTP %{http_code}\n" "${H[@]}" -H "Authorization: Bearer $AT" -X PUT "$BASE/api/products/1" -d '{"name":"x","price":1000,"description":"x","imageUrl":"","category_id":999}'
fi

if [ -z "$ONLY" ] || [ "$ONLY" = "25" ]; then
  bug 25 "id khong ton tai van bao thanh cong / GET tra 200 rong thay vi 404"
  want "404 ca hai chieu"
  AT=$(get_token "admin@eshop.com" "Admin123!")
  echo "-- GET id khong ton tai:"; run curl -s -w " -> HTTP %{http_code}\n" "$BASE/api/products/999999"
  echo "-- PUT id khong ton tai:"; run curl -s -w " -> HTTP %{http_code}\n" "${H[@]}" -H "Authorization: Bearer $AT" -X PUT "$BASE/api/products/999999" -d '{"name":"Ghost","price":1,"description":"x","imageUrl":"","category_id":1}'
fi

if [ -z "$ONLY" ] || [ "$ONLY" = "26" ]; then
  bug 26 "price bi ep thanh string tren id CHAN"
  want "price phai la number bat ke id chan/le"
  echo "-- id=1 (LE):"; run curl -s "$BASE/api/products/1"
  echo "-- id=2 (CHAN):"; run curl -s "$BASE/api/products/2"
fi

echo
echo "Xong. Nho khoi dong lai SUT truoc khi chay lai bo test chinh thuc (DB duoc seed lai moi lan khoi dong)."
