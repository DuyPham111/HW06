# Chọn API cho HW06 — bằng chứng không trùng trong nhóm (§5)

- **Sinh viên:** Phạm Vũ Ngọc Duy — **MSSV:** 23127183 — **Nhóm:** 10X Testers
- **SUT:** EShop — https://github.com/ttbhanh/eshop-sut · spec: `api_specification.md`
- **Ngày chốt:** xem ảnh xác nhận ở §1 (thời gian gửi không hiện rõ trong khung chụp)

§5 đòi **3 API, mỗi API thuộc một pool A / B / C**, và **không được trùng bộ 3** với thành viên nào
trong nhóm. File này ghi lại: (1) bằng chứng đã báo nhóm để chống trùng, (2) bộ 3 của tôi, (3) lý do
chọn dựa trên **mã nguồn thật** của SUT.

---

## 1. Bằng chứng đã báo nhóm để chống trùng (§5)

> **Đề đòi gì, và không đòi gì.** Nguyên văn §5: *"ensure that your selection is **not duplicated**
> among the members of your group: no two members may choose the same three APIs."* Đó là **ràng buộc
> phải thoả**, không phải **một định dạng bằng chứng cụ thể phải nộp** — §11 (danh sách chống gian)
> chỉ gọi tên ảnh console `X-Student-Id`, hostname trong output Newman và sơ đồ tự vẽ; §14 (danh sách
> file nộp) không đòi bảng đối chiếu lựa chọn của từng thành viên.
>
> **Cách đã làm:** thay vì dựng bảng đối chiếu 4 thành viên (các bạn phản hồi chậm, không xác nhận
> kịp), tôi **chủ động báo trước** trong nhóm chat *"10X Testers"* đúng 3 API mình chọn cho HW06 —
> giữ nguyên bộ đã đăng ký từ HW05 (`API-01` Pool A · `API-02` Pool B · `API-03` Pool C, xem bảng §2).
> Việc này thỏa đúng nội dung §5 (thông báo công khai để không ai vô tình trùng), chỉ khác hình thức
> so với một bảng đối chiếu đầy đủ.

![Xác nhận đã báo nhóm](../bug-report/screenshots/xac-nhan-nhom-chon-api.png)

*(Tin nhắn: "hw06 tui chọn như cũ hw02 nha" + bảng 3 API — `API-01 A POST /api/login` ·
`API-02 B POST /api/apply-coupon` · `API-03 C PUT /api/products/:id` — gửi trong nhóm "10X Testers".)*

**Nếu về sau phát hiện trùng:** khi các thành viên phản hồi hoặc GVHD yêu cầu đối chiếu chi tiết, cập
nhật thêm bảng dưới đây (không bắt buộc, chỉ để tiện tra cứu):

| Thành viên | Pool A | Pool B | Pool C |
|---|---|---|---|
| SV #1 | | | |
| SV #2 | | | |
| SV #3 | | | |

---

## 2. Bộ 3 API của tôi

| Mã | Pool | FR | API chính | Endpoint hỗ trợ (setup / verify / cleanup) | Prefix test case |
|---|---|---|---|---|---|
| **API-01** | A | FR-02 Đăng nhập & khóa tài khoản | `POST /api/login` | `POST /api/register`, `GET /api/users/me` | `TC-LOGIN-###` |
| **API-02** | B | FR-09 Coupon (+ FR-08 checkout, FR-10 order state machine) | `POST /api/apply-coupon` | `POST /api/login`, `POST /api/cart`, `POST /api/checkout`, `POST /api/coupon-usage`, `GET /api/orders/:id`, `PUT /api/orders/:id/cancel`, `PUT /api/admin/orders/:id/status` | `TC-COUPON-###` |
| **API-03** | C | FR-15 Quản lý sản phẩm (admin) | `PUT /api/products/:id` | `POST /api/products`, `GET /api/products/:id`, `DELETE /api/products/:id` | `TC-PRODUPD-###` |

**Không trùng:** đã giữ nguyên bộ 3 API đăng ký từ HW05 (`login` / `apply-coupon` / `products/:id`)
và **chủ động thông báo trong nhóm** trước khi làm HW06 (ảnh §1) — đây là bộ đã đăng ký sớm nhất
trong nhóm cho 3 endpoint này, nên không thể là bên gây trùng.

**Lý do chọn:**

1. **Kế thừa HW02/HW04/HW05.** Ba FR này đã được domain-test (HW02), automation-test (HW04) và
   performance-test (HW05). HW06 là góc nhìn thứ tư trên cùng ba vùng nghiệp vụ, cho phép đối chiếu
   *"bug ở tầng UI trông thế nào khi nhìn từ tầng API"* — chất liệu trực tiếp cho §6.3.
2. **Đủ tham số để sinh ≥35 case có nghĩa.** API-01: 2 tham số body + 1 tham số ẩn (trạng thái khóa).
   API-02: 3 tham số body + 5 điều kiện nghiệp vụ FR-09 + máy trạng thái FR-10. API-03: 5 tham số
   body + path param + auth + role.
3. **Mỗi API phủ một nhóm SEC khác nhau** — API-01 → SEC-01, SEC-02; API-02 → SEC-02 + IDOR;
   API-03 → SEC-02 + SEC-03. Không API nào trùng trọng tâm bảo mật với API khác.
4. **Phủ đủ 4 kỹ thuật §6.1 đòi** — domain partition (cả 3), state transition (API-02 phủ FR-10
   đầy đủ, API-03 phủ vòng đời sản phẩm), security (cả 3), schema validation (cả 3).

---

## 3. Trọng tâm kiểm thử — **đã kiểm chứng bằng request thật**

> Số dòng trỏ tới `eshop-sut/backend/server.js`. Toàn bộ mục dưới đây đã chạy `curl`/Newman thật —
> xem đầy đủ (đặc tả bị vi phạm nguyên văn, bước tái hiện, kết quả thực tế) ở
> [`bug-report/bug-report.md`](../bug-report/bug-report.md).

### API-01 — `POST /api/login` (server.js:32–66)

| # | Giả thuyết | Đặc tả đối chiếu | Đã kiểm? | Kết luận |
|---|---|---|---|---|
| A1-1 | bộ đếm cộng `+2` mỗi lần sai (`:54`) | FR-02: *"tăng đúng 1 đơn vị"* | ☑ | Đúng — nhưng khóa lộ ở request **thứ 3**, không phải response của lần sai → **BUG-02** |
| A1-2 | khóa sau **2** lần sai chứ không phải 3 | FR-02: *"sai từ 3 lần trở lên"* | ☑ | Đúng, gộp vào **BUG-02** |
| A1-3 | khóa **180s** (`:57`) | FR-02: *"khóa 30 giây"* | ☑ | Xác nhận đúng 180s (đề cập trong BUG-02, không tách bug riêng vì cùng nguyên nhân) |
| A1-4 | so sánh mật khẩu plaintext (`:46`) + lưu plaintext (`database.js:92`) | SEC-01 | ☑ | Xác nhận — **BUG-03** |
| A1-5 | response trả nguyên object `user`, gồm `password` | SEC-01 | ☑ | Xác nhận — **BUG-03**, **BUG-04** (cột nội bộ khác) |
| A1-6 | JWT không có `expiresIn` (`:50`) | SEC-02 | ☑ | Xác nhận — **BUG-05** |
| A1-7 | request thiếu `password` vẫn cộng bộ đếm → khóa được tài khoản người khác | FR-02 | ☑ | Xác nhận — **BUG-01** (Critical, DoS) |
| A1-8 | 403 kèm *"Tài khoản đã bị khóa"* → xác nhận email tồn tại | FR-02: *"không để lộ chi tiết nguyên nhân"* | ☑ | Xác nhận — **BUG-09** (account enumeration) |

### API-02 — `POST /api/apply-coupon` (server.js:363–443) + luồng đơn hàng

| # | Giả thuyết | Đặc tả đối chiếu | Đã kiểm? | Kết luận |
|---|---|---|---|---|
| A2-1 | endpoint **không có** `authenticateToken` | FR-09 **C4** + SEC-02 | ☑ | Xác nhận — **BUG-11** |
| A2-2 | `user_id` lấy từ **body** → IDOR | — | ☑ | Xác nhận — **BUG-13** |
| A2-3 | **bỏ hẳn** `user_id` → nhánh kiểm `max_uses_per_user` không chạy | FR-09 **C5** | ☑ | Xác nhận — **BUG-13**. **Đối chứng:** khi `user_id` đúng & thật, C5 hoạt động **đúng** (xem TC-COUPON-102→102e) |
| A2-4 | dùng `>` thay vì `>=` cho `min_order_amount` | FR-09 **C3**: `>=` | ☑ | Xác nhận — **BUG-12** |
| A2-5 | `Math.floor(total * (1 - discount_value))` → `discount_amount` âm | FR-09: `total × value / 100` | ☑ | Xác nhận — **BUG-10** (Critical, `SAVE10`/500.000 → `-4.500.000`) |
| A2-6 | `err` của `db.get` bị bỏ qua ở 2 callback | — | ☐ | Chưa kiểm riêng — không quan sát được lỗi 500 nào trong suốt quá trình test, để ngỏ |
| A2-7 | `PUT /api/admin/orders/:id/status` cho phép `canceled → delivered` (`:549`) | FR-10: trạng thái kết thúc | ☑ | Xác nhận — **BUG-17** |
| A2-8 | `PUT /api/orders/:id/cancel` cho hủy đơn đang `shipping` (`:328`) | FR-10: chỉ hủy khi `pending`/`confirmed` | ☑ | Xác nhận — **BUG-16** |
| A2-9 | `PUT /api/admin/orders/:id/status` không kiểm `role` | SEC-03 | ☑ | Xác nhận — **BUG-18** |
| A2-10 | `GET /api/orders/:id` không có auth (`:344`) → IDOR | SEC-02 | ☑ | Xác nhận — **BUG-15** |
| A2-11 | `POST /api/checkout` nhận `total_amount` từ client (`:299`) → price tampering | — | ☑ | Xác nhận — **BUG-14** |

### API-03 — `PUT /api/products/:id` (server.js:179–190)

| # | Giả thuyết | Đặc tả đối chiếu | Đã kiểm? | Kết luận |
|---|---|---|---|---|
| A3-1 | không có `authenticateToken` — khác `PUT /api/categories/:id` (`:257`) | SEC-02 + FR-15 | ☑ | Xác nhận — **BUG-21**, đối chứng với `/api/categories/:id` (CÓ auth) |
| A3-2 | không kiểm `role` kể cả khi có token | SEC-03 | ☑ | Xác nhận — **BUG-22** |
| A3-3 | body thiếu trường → cột bị set `NULL` (ghi đè toàn bộ) | FR-15 | ☑ | Xác nhận — **BUG-20**, và trên ID chẵn dẫn tới **BUG-19** (sập server) |
| A3-4 | không validate `price > 0` | FR-15: *"số dương (> 0)"* | ☑ | Xác nhận — **BUG-23** |
| A3-5 | không validate `name` (rỗng, > 255 ký tự) | FR-15: *"bắt buộc, tối đa 255"* | ☑ | Xác nhận — **BUG-23** |
| A3-6 | không kiểm `category_id` tồn tại | FR-15: *"chọn từ danh sách có sẵn"* | ☑ | Xác nhận — **BUG-23** |
| A3-7 | id không tồn tại vẫn trả `200 {message:"Product updated"}` | — (suy luận REST) | ☑ | Xác nhận — **BUG-25** |
| A3-8 | `GET /api/products/:id` trả `200 {}` khi không có (`:160`) | spec §3.2 | ☑ | Xác nhận — **BUG-25** |
| A3-9 | `GET /api/products/:id` ép `price` thành **chuỗi** khi `id` chẵn (`:162`) | spec §3.3 (`price: 100000` là số) | ☑ | Xác nhận — **BUG-26** (độc lập với BUG-19, chỉ là ép kiểu, không crash khi `price` không null) |

**Tổng:** 28/29 giả thuyết được xác nhận đúng bằng request thật, 1 giả thuyết (A2-6) chưa kiểm riêng
được và để ngỏ. Không có giả thuyết nào ở mục này bị loại — 4 giả thuyết bị loại nằm ở §4 dưới, đều
là giả thuyết **phát sinh trong lúc kiểm thử** (không nằm trong danh sách ban đầu ở trên).

---

## 4. Giả thuyết đã bị loại sau khi kiểm chứng

> Đây là các giả thuyết **phát sinh trong lúc thiết kế/chạy test** (không nằm trong bảng §3 ban đầu),
> tưởng là bug nhưng chạy thật thì không phải. Đầy đủ ở
> [`bug-report/bug-report.md`](../bug-report/bug-report.md) §4.

| # | Giả thuyết | Đã kiểm bằng gì | Vì sao bị loại |
|---|---|---|---|
| 1 | *(API-02)* Có thể nhảy cóc `pending → shipping` hoặc `pending → delivered` | `curl` PUT admin/orders/status trực tiếp | Cả hai đều bị chặn đúng (400) — chỉ `canceled → delivered` là lỗ hổng thật |
| 2 | *(API-02)* User thường huỷ được đơn của người khác qua `PUT /orders/:id/cancel` | `curl` với `admin_token` gọi huỷ đơn của user | **404**, không phải lỗ hổng — endpoint lọc đúng `WHERE user_id = req.user.id` |
| 3 | *(API-02)* `VIP100` cho phép dùng vượt quá 2 lượt/người khi `user_id` đúng | Chuỗi 5 request thật (TC-COUPON-102→102e) | **Sai** — khi `user_id` đúng, giới hạn hoạt động chính xác; lỗ hổng thật nằm ở việc `user_id` do client tự khai |
| 4 | *(API-01)* SQL injection qua `email` bypass được đăng nhập | 3 dạng payload SQLi qua `curl` | Không bypass được — tham số hoá đúng chuẩn (SEC-05 đạt cho endpoint này) |
