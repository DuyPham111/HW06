# 10 — §6.5 Bug report trong Markdown **và** trên GitHub Issues

> Output: `bug-report/bug-report.md`, `bug-report/issues/BUG-XX.md`, Issues trên GitHub kèm ảnh,
> `bug-report/verify-bugs.sh`.
> **Commit:** `docs: bug report + GitHub Issues (§6.5)`

---

## 1. §6.5 đòi gì

*"Report any genuine bugs you find — including bugs the AI missed — both in the Markdown report and
on your GitHub Issues page, **with a screenshot attached to each issue**."*

Ba điều kiện: **genuine** (thật, tái hiện được) · **cả hai nơi** (Markdown + Issues) · **mỗi issue có ảnh**.

---

## 2. Luật: chưa chạy request thật thì chưa phải bug

Bảng giả thuyết ở [02](02-CHON-API.md) §3 là **giả thuyết**. Để thành bug phải có:

1. **Lệnh tái hiện** — `curl` chạy độc lập, không phụ thuộc collection.
2. **Output thật** — dán nguyên văn, không tóm tắt.
3. **Trích đặc tả bị vi phạm** — `FR-xx` / `SEC-0x` / `spec §x.y`, nguyên văn.
4. **Ảnh** — báo cáo Newman HTML chỗ assertion đỏ, hoặc terminal chạy `curl`.

Thiếu bất kỳ mục nào thì để trong `bug-report.md` ở phần **"giả thuyết đã loại"**, không đưa vào
danh sách bug. Phần đó cũng đáng viết: nó chứng minh bạn kiểm chứng chứ không nhận vơ.

---

## 3. Script tái hiện bug — viết ngay, đừng để cuối

Tạo `bug-report/verify-bugs.sh` để chạy lại bằng chứng từng bug bằng `curl`. Mẫu:

```bash
#!/usr/bin/env bash
# verify-bugs.sh — chay lai bang chung tung bug bang curl doc lap voi Postman.
#   bash bug-report/verify-bugs.sh        # chay tat ca
#   bash bug-report/verify-bugs.sh 03     # chay rieng BUG-03
BASE=http://localhost:3000
SID=23127183
H=(-H "Content-Type: application/json" -H "X-Student-Id: $SID")

bug() { echo; echo "===== BUG-$1: $2 ====="; }

if [ -z "${1:-}" ] || [ "$1" = "03" ]; then
  bug 03 "FR-09: cong thuc percent sai — SAVE10 tren don 500.000"
  echo "-- FR-09 doi: discount_amount=50000, final_amount=450000"
  curl -s "${H[@]}" -X POST "$BASE/api/apply-coupon" \
    -d '{"code":"SAVE10","total_amount":500000,"user_id":2}'
  echo
fi

if [ -z "${1:-}" ] || [ "$1" = "05" ]; then
  bug 05 "SEC-02: PUT /api/products/:id khong can token"
  echo "-- truoc:"; curl -s "$BASE/api/products/3"
  echo; echo "-- PUT khong co Authorization:"
  curl -s "${H[@]}" -X PUT "$BASE/api/products/3" \
    -d '{"name":"BI SUA BOI NGUOI LA","price":1,"description":"x","imageUrl":"","category_id":1}'
  echo; echo "-- sau:"; curl -s "$BASE/api/products/3"; echo
fi
```

Chạy rồi lưu output: `bash bug-report/verify-bugs.sh > bug-report/verify-bugs-output.txt 2>&1`.
Commit file output — nó là bằng chứng mạnh nhất của cả bài, và bạn tự chạy được nó trước mặt TA
lúc vấn đáp (§13).

---

## 4. Khuôn một bug — dùng chung cho `bug-report.md` và Issue

```markdown
## BUG-05 — `PUT /api/products/:id` không yêu cầu xác thực (SEC-02, SEC-03)

| | |
|---|---|
| **API** | API-03 · Pool C · FR-15 |
| **Endpoint** | `PUT /api/products/:id` |
| **Mức độ** | **Critical** |
| **Đặc tả bị vi phạm** | SEC-02: *"Các API có tính bảo mật phải yêu cầu JWT Token hợp lệ."* · SEC-03: *"API Admin phải kiểm tra `role = 'admin'` trong Token."* · FR-15: *"**Admin** có thể Thêm / Xem / Sửa / Xóa sản phẩm."* |
| **Test case bắt được** | `TC-PRODUPD-058`, `TC-PRODUPD-059`, `TC-PRODUPD-102` |
| **Vị trí trong mã nguồn** | `backend/server.js:179` — handler không có middleware `authenticateToken`, khác với `PUT /api/categories/:id` (`:257`) cùng là thao tác admin |
| **AI có bắt được không** | Có (case 058) nhưng **chỉ kiểm status code**; case `102` do sinh viên thêm mới kiểm **dữ liệu đã thật sự bị đổi** |

**Các bước tái hiện**

```bash
bash bug-report/verify-bugs.sh 05
```

**Kết quả thực tế**

```
-- truoc: {"id":3,"name":"MacBook Pro M3","price":45000000,...}
-- PUT khong co Authorization: {"message":"Product updated"}
-- sau: {"id":3,"name":"BI SUA BOI NGUOI LA","price":1,...}
```

**Kết quả mong đợi** — `401 Unauthorized` (không có token) hoặc `403 Forbidden` (token không phải
admin), và dữ liệu sản phẩm **không đổi**.

**Ảnh** — ![](screenshots/bug-05-put-khong-token.png)

**Ảnh hưởng** — bất kỳ ai biết URL đều đổi được giá và tên mọi sản phẩm mà không cần tài khoản.
Kết hợp với `POST /api/checkout` nhận `total_amount` từ client (BUG-08), kẻ tấn công đặt giá về `1`
rồi mua thật.
```

**Cột "AI có bắt được không" là chỗ ăn điểm §6.3 và §10.** Điền cho mọi bug.

---

## 5. Bảng quy đổi assertion đỏ → bug

`bug-report.md` phải có bảng này ở đầu. Nó trả lời câu hỏi đầu tiên của người chấm:
*"47 assertion đỏ mà chỉ có 27 bug — số nào đúng?"* (một bug thường làm đỏ nhiều assertion)

| Bug | Mức độ | API | Test case liên quan | Số assertion đỏ |
|---|---|---|---|--:|
| BUG-01 | Critical | API-01 | TC-LOGIN-023, 024, 031 | 6 |
| … | | | | |
| **Tổng** | | | | **= cột Fail trong `summary.md`** |

**Mọi assertion đỏ phải nằm trong bảng này.** Đỏ không map được về bug nào = lỗi test của bạn
(xem [07](07-CHAY-NEWMAN-BANG-CHUNG.md) §2), phải sửa hoặc giải thích.

**Thang mức độ** dùng thống nhất:

| Mức | Nghĩa | Ví dụ ở SUT này |
|---|---|---|
| **Critical** | mất tiền / mất dữ liệu / bỏ qua hoàn toàn xác thực | `PUT /api/products/:id` không cần token · công thức coupon cho `final_amount > total` · price tampering ở checkout |
| **High** | vi phạm SEC hoặc FR cốt lõi, cần điều kiện | khóa tài khoản sai ngưỡng · `canceled → delivered` · IDOR đọc đơn người khác |
| **Medium** | sai đặc tả nhưng ảnh hưởng hẹp | biên `>=` của `min_order_amount` · trả `200 {}` thay vì 404 |
| **Low** | lệch nhỏ, không ảnh hưởng nghiệp vụ | thông báo lỗi tiếng Việt lẫn tiếng Anh · thiếu field `message` |

---

## 6. Nếu SUT chết giữa lượt chạy

Nếu một payload làm backend crash: **đó là bug Critical (DoS)**, nhưng **đừng để nó trong collection
Postman**. Một lượt Newman chạm vào payload đó sẽ làm SUT chết giữa đường và mọi case sau đỏ **vì môi
trường**, làm hỏng toàn bộ số liệu.

Cách xử lý đúng:

1. Bỏ payload đó ra khỏi collection.
2. Đưa nó vào `verify-bugs.sh` như một mục riêng.
3. Lưu log crash của backend (`stack trace` trong terminal chạy `node server.js`) vào
   `bug-report/sut-crash.log`.
4. Trong `bug-report.md` ghi rõ: *"BUG-xx không nằm trong collection Postman — có chủ ý. Bằng chứng
   ở `verify-bugs.sh` + `sut-crash.log`."*

---

## 7. Đưa bug lên GitHub Issues

### 7.1 Tạo issue

Vào https://github.com/DuyPham111/HW06/issues → **New issue**.

- **Title:** `[BUG-05][Critical][API-03] PUT /api/products/:id không yêu cầu xác thực (SEC-02, SEC-03)`
- **Body:** dán nguyên khuôn ở §4.
- **Labels:** tạo trước 6 nhãn rồi gắn: `bug`, `critical`/`high`/`medium`/`low`, `api-01`/`api-02`/`api-03`.

### 7.2 Đính ảnh — **bắt buộc**, §6.5 nói rõ

Kéo-thả file ảnh **thẳng vào ô soạn issue** trên web. GitHub upload và chèn markdown
`![](https://user-images.githubusercontent.com/...)`. Ảnh hiện **trong** issue.

> **Đừng chỉ ghi đường dẫn tương đối** `![](screenshots/bug-05.png)` trong issue — đường dẫn đó
> không phân giải được trên trang Issues, ảnh sẽ hiện thành icon vỡ. Trong `bug-report.md` (file
> trong repo) thì đường dẫn tương đối lại đúng. **Hai nơi dùng hai kiểu link khác nhau.**

Ảnh nên chụp gì:

| Loại bug | Chụp gì |
|---|---|
| Sai giá trị trả về | báo cáo Newman HTML, chỗ assertion đỏ, thấy rõ expected vs actual |
| Thiếu xác thực | terminal chạy `verify-bugs.sh`, thấy trước/sau dữ liệu đổi |
| Sai state machine | 2 request liên tiếp + `GET /api/orders/:id` xác nhận trạng thái |
| Crash | stack trace trong terminal backend |

### 7.3 Ghi link ngược lại

Sau khi tạo xong, thêm cột **Issue** vào bảng quy đổi trong `bug-report.md`:

| Bug | … | Issue |
|---|---|---|
| BUG-05 | … | [#12](https://github.com/DuyPham111/HW06/issues/12) |

Và trong README ghi khoảng issue: *"Bug đã báo: [#8–#27](https://github.com/DuyPham111/HW06/issues)"*.

### 7.4 Tạo nhanh nhiều issue bằng `gh` (tuỳ chọn)

Nếu đã cài GitHub CLI:

```bash
gh issue create --repo DuyPham111/HW06 \
  --title "[BUG-05][Critical][API-03] PUT /api/products/:id khong yeu cau xac thuc (SEC-02, SEC-03)" \
  --body-file bug-report/issues/BUG-05.md \
  --label bug --label critical --label api-03
```

**Nhưng ảnh vẫn phải kéo-thả tay trên web** — `gh` không upload ảnh được. Cách làm: tạo issue bằng
`gh` cho nhanh, rồi mở từng issue trên web **Edit** và kéo ảnh vào.

---

## 8. Checklist

- [ ] Mọi bug đều **tái hiện được** bằng `verify-bugs.sh`, output đã lưu
- [ ] `bug-report/bug-report.md` có bảng quy đổi assertion đỏ → bug, tổng khớp `summary.md`
- [ ] Mỗi bug có: đặc tả bị vi phạm (nguyên văn) · vị trí mã nguồn · bước tái hiện · kết quả thực tế · kết quả mong đợi · ảnh · cột "AI có bắt được không"
- [ ] Mục **"giả thuyết đã loại"** có ≥2 mục
- [ ] Mọi bug đã có Issue trên GitHub, **mỗi issue có ảnh hiện được trong issue**
- [ ] Bảng trong `bug-report.md` có cột link Issue
- [ ] Commit: `docs: bug report + GitHub Issues (§6.5)`
