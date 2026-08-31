# 02 — Chọn 3 API và viết bằng chứng §5

> Output: `docs/api-selection.md` đã điền đủ 3 mục.
> **Commit:** `docs: chot 3 API va ly do chon (§5)`

---

## 1. §5 đòi gì, và **không** đòi gì

Nguyên văn: *"Select three (3) APIs, one implementing a feature from each of Pool A, Pool B, and
Pool C… ensure that your selection is not duplicated among the members of your group: no two members
may choose the same three APIs."*

- **Đòi:** 3 API, mỗi pool 1, và bộ 3 không trùng với thành viên nào trong nhóm.
- **Không đòi:** ảnh chat nhóm. §11 (danh sách chống gian) chỉ gọi tên 3 thứ: ảnh console
  `X-Student-Id`, hostname trong output Newman, sơ đồ tự vẽ. §14 (danh sách file nộp) không có ảnh chat.

→ Cứ ghi bảng đối chiếu vào `docs/api-selection.md`. Nếu TA hỏi thì xuất trình chat trực tiếp lúc
vấn đáp. **Đừng** commit ảnh chat: nó chứa nội dung của người khác.

---

## 2. Bộ 3 API của bạn — đã chốt

| Mã | Pool | FR | API chính | Endpoint hỗ trợ | Prefix |
|---|---|---|---|---|---|
| **API-01** | A | FR-02 | `POST /api/login` | `POST /api/register`, `GET /api/users/me` | `TC-LOGIN-###` |
| **API-02** | B | FR-09 (+FR-08, FR-10) | `POST /api/apply-coupon` | `POST /api/login`, `POST /api/cart`, `POST /api/checkout`, `POST /api/coupon-usage`, `GET /api/orders/:id`, `PUT /api/orders/:id/cancel`, `PUT /api/admin/orders/:id/status` | `TC-COUPON-###` |
| **API-03** | C | FR-15 | `PUT /api/products/:id` | `POST /api/products`, `GET /api/products/:id`, `DELETE /api/products/:id` | `TC-PRODUPD-###` |

**Vì sao đúng ba API này** (viết lý do vào `api-selection.md`, đây là phần được chấm):

1. **Kế thừa HW02/HW04/HW05.** Ba FR này bạn đã domain-test (HW02), automation-test (HW04) và
   performance-test (HW05). HW06 là góc nhìn thứ tư trên cùng ba vùng nghiệp vụ — báo cáo có thể
   đối chiếu *"bug B00x của HW02 nhìn từ tầng API thì trông thế nào"*, và đó là chất liệu tốt cho
   phần Extend §6.3.
2. **Đủ tham số để sinh ≥35 case có nghĩa.** API quá ít tham số (ví dụ `GET /api/categories`) sẽ
   phải độn case vô nghĩa cho đủ số. Ba API này có: 2 tham số body + 1 header auth (API-01),
   3 tham số body + 4 điều kiện nghiệp vụ + state machine (API-02), 5 tham số body + path param
   + auth + role (API-03).
3. **Mỗi API phủ một nhóm SEC khác nhau.** API-01 → SEC-01 (mật khẩu) và SEC-02 (JWT);
   API-02 → SEC-02 + IDOR (`user_id` nằm trong body); API-03 → SEC-02 + SEC-03 (role admin).
   Không API nào trùng trọng tâm bảo mật với API khác.

---

## 3. Trọng tâm kiểm thử từng API — **giả thuyết**, chưa phải bug

> Đọc mã nguồn để **biết chỗ nào đáng chọc**, không phải để chép kết luận. Mọi mục dưới đây là
> **giả thuyết**; chỉ được viết vào `bug-report/bug-report.md` sau khi **chạy request thật** ra kết quả.
> Số dòng trỏ tới `eshop-sut/backend/server.js`.

### API-01 — `POST /api/login` (server.js:32–66)

| Đáng chọc | Đối chiếu đặc tả | Giả thuyết |
|---|---|---|
| bộ đếm sai lần đăng nhập | FR-02: *"tăng bộ đếm lên **đúng 1 đơn vị**"* | dòng ~54 cộng `+2` |
| ngưỡng khóa | FR-02: *"sai từ **3 lần trở lên**"* | `if (newAttempts >= 3)` cộng với bước nhảy 2 → khóa sau **2** lần sai |
| thời gian khóa | FR-02: *"khóa **30 giây**"* | `Date.now() + 180000` → **180 giây** |
| so sánh mật khẩu | SEC-01: *"không lưu plaintext"* | `user.password === password` — so sánh chuỗi trần |
| response trả về | SEC-01 | trả nguyên object `user`, gồm cả cột `password` |
| JWT | FR-02 | `jwt.sign(...)` **không có `expiresIn`** → token không bao giờ hết hạn |
| thiếu trường `password` | — | `user.password === undefined` → false → **vẫn cộng bộ đếm** → khóa được tài khoản người khác mà không cần biết mật khẩu |
| thông báo khi bị khóa | FR-02: *"không để lộ chi tiết nguyên nhân"* | 403 kèm *"Tài khoản đã bị khóa"* → xác nhận email đó có tồn tại |

### API-02 — `POST /api/apply-coupon` (server.js:363–443)

| Đáng chọc | Đối chiếu đặc tả | Giả thuyết |
|---|---|---|
| không có `authenticateToken` | FR-09 **C4**: *"Người dùng phải có JWT Token hợp lệ"* + SEC-02 | endpoint public hoàn toàn |
| `user_id` lấy từ **body** | — | IDOR: hỏi/tiêu hạn mức của user khác; **bỏ hẳn** `user_id` thì nhánh kiểm `max_uses_per_user` không chạy → bỏ qua C5 |
| ngưỡng đơn tối thiểu | FR-09 **C3**: `>=` | code dùng `total_amount > coupon.min_order_amount` → biên `= min` bị từ chối |
| công thức percent | FR-09: `total × discount_value / 100` | `Math.floor(total * (1 - discount_value))` — với `SAVE10` (`discount_value = 10`) thì `1-10 = -9` → `discount_amount` **âm**, `final_amount` **lớn hơn** tổng đơn |
| `err` của `db.get` | — | bị bỏ qua ở cả hai callback |
| `total_amount` không validate | — | chuỗi `"500000"` bị JS ép kiểu; thiếu hẳn → `undefined > min` = false → 400 sai lý do |
| **state machine** (FR-10) | FR-10: `delivered`/`canceled` là trạng thái kết thúc | `PUT /api/admin/orders/:id/status` cho phép `canceled → delivered` (server.js:~549) |
| hủy đơn | FR-10: chỉ hủy khi `pending`/`confirmed` | `PUT /api/orders/:id/cancel` chỉ chặn `delivered`/`canceled` → **hủy được đơn đang `shipping`** |
| đổi trạng thái đơn | SEC-03: API admin phải kiểm `role='admin'` | `PUT /api/admin/orders/:id/status` chỉ có `authenticateToken`, **không** kiểm role |
| xem đơn hàng | — | `GET /api/orders/:id` **không có auth** → IDOR đọc đơn của bất kỳ ai |
| tổng tiền | — | `POST /api/checkout` nhận `total_amount` từ client, không tính lại → price tampering |

### API-03 — `PUT /api/products/:id` (server.js:179–190)

| Đáng chọc | Đối chiếu đặc tả | Giả thuyết |
|---|---|---|
| không có `authenticateToken` | SEC-02 + FR-15 (*"Admin có thể Sửa"*) | ai cũng sửa được sản phẩm, không cần token |
| không kiểm `role` | SEC-03 | kể cả khi thêm token, user thường vẫn sửa được |
| ghi đè toàn bộ | FR-15: *"chỉ sản phẩm đó bị thay đổi"* | body thiếu trường nào thì cột đó bị set `NULL` → mất dữ liệu khi cập nhật một phần |
| `price` | FR-15: *"phải là số **dương** (> 0)"* | không validate: `0`, `-1`, `"abc"` đều nhận |
| `name` | FR-15: *"bắt buộc, tối đa 255 ký tự"* | không validate: rỗng, 1000 ký tự đều nhận |
| `category_id` | FR-15: *"phải chọn từ danh sách có sẵn"* | không kiểm tồn tại |
| id không tồn tại | — | `this.changes === 0` nhưng vẫn trả `200 {message:"Product updated"}` thay vì 404 |
| verify bằng GET | — | `GET /api/products/:id` trả `200 {}` khi không có (server.js:160) và **ép `price` thành chuỗi khi `id` chẵn** (server.js:162) |

---

## 4. Điền `docs/api-selection.md`

File `docs/api-selection.md` đã có sẵn khung 3 mục. Việc của bạn:

1. **Mục 1 — bằng chứng chống trùng.** Cách chuẩn là bảng đối chiếu 4 thành viên; nhưng nếu nhóm
   phản hồi chậm (thực tế đã xảy ra ở bài này), cách hợp lệ khác là **chủ động báo trước** trong chat
   nhóm đúng 3 API bạn chọn, rồi **chụp ảnh tin nhắn đó** làm bằng chứng — §5 chỉ đòi *"not
   duplicated"*, không đòi đúng định dạng bảng. Lưu ảnh vào `bug-report/screenshots/`, nhúng vào
   `api-selection.md` §1. (Bài này đã làm theo cách thứ hai — xem file thật để lấy khuôn mẫu.)
2. **Mục 2 — bộ 3 của bạn.** Đã điền sẵn, chỉ cần đọc lại.
3. **Mục 3 — lý do chọn.** Chép bảng §3 ở trên, thêm cột *"đã kiểm chưa"* để sau khi chạy Newman
   bạn quay lại đánh dấu giả thuyết nào thành bug thật, giả thuyết nào bị loại.

> **Mục "giả thuyết bị loại" là thứ làm bài của bạn khác bài chép.** Ghi lại 2–4 giả thuyết bạn
> tưởng là bug nhưng chạy thật thì không phải, kèm lý do. Người chấm đọc mục đó là biết bạn có
> thật sự chạy hay không.

---

## 5. Checklist kết thúc phiên 2

- [ ] Đã hỏi nhóm và biết 3 API của từng thành viên khác
- [ ] `docs/api-selection.md` điền đủ mục 1, 2, 3
- [ ] Bảng giả thuyết đã có cột "đã kiểm chưa", tất cả đang để trống
- [ ] Commit: `docs: chot 3 API va ly do chon (§5)`
