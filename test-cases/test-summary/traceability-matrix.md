# Ma trận truy vết — yêu cầu → test case → bug

> Điền song song với việc viết test case. Mục đích: chứng minh **phủ hết** yêu cầu, và khi một bug
> được sửa thì biết ngay phải chạy lại case nào.

## 1. FR → test case

| FR | Nội dung | API | Test case phủ | Bug tìm được |
|---|---|---|---|---|
| FR-02 | Đăng nhập & khóa tài khoản | API-01 | | |
| FR-08 | Checkout | API-02 | | |
| FR-09 C1 | Mã tồn tại & `is_active = 1` | API-02 | | |
| FR-09 C2 | Còn hạn sử dụng | API-02 | | |
| FR-09 C3 | Tổng đơn **>=** `min_order_amount` | API-02 | | |
| FR-09 C4 | Đã đăng nhập (JWT hợp lệ) | API-02 | | |
| FR-09 C5 | Chưa dùng hết lượt | API-02 | | |
| FR-09 | Công thức `discount_amount` / `final_amount` | API-02 | | |
| FR-10 | `pending → confirmed → shipping → delivered` | API-02 | | |
| FR-10 | Hủy chỉ khi `pending`/`confirmed` | API-02 | | |
| FR-10 | `delivered`/`canceled` là trạng thái kết thúc | API-02 | | |
| FR-15 | `name` bắt buộc, ≤255 ký tự | API-03 | | |
| FR-15 | `price` phải > 0 | API-03 | | |
| FR-15 | `category_id` phải tồn tại | API-03 | | |
| FR-15 | Sửa 1 sản phẩm không ảnh hưởng sản phẩm khác | API-03 | | |
| FR-18 | Admin đổi trạng thái theo state machine FR-10 | API-02 | | |

## 2. SEC → test case

| SEC | Nội dung | API phủ | Test case | Bug |
|---|---|---|---|---|
| SEC-01 | Mật khẩu không lưu plaintext | API-01 | | |
| SEC-02 | API bảo mật phải yêu cầu JWT hợp lệ | API-01, 02, 03 | | |
| SEC-03 | API Admin phải kiểm `role = 'admin'` | API-02, 03 | | |
| SEC-04 | Escape dữ liệu người dùng | API-03 | | |
| SEC-05 | Parameterized query | API-01, 02, 03 | | |
| SEC-06 | Không cho đổi `role` từ client | API-03 (mass assignment) | | |
| SEC-07 | OTP đủ entropy | *(ngoài phạm vi 3 API đã chọn)* | — | — |

> SEC-07 thuộc FR-03 (quên mật khẩu), không nằm trong 3 API đã chọn. Ghi rõ ở đây thay vì để trống —
> người chấm cần thấy bạn đã cân nhắc cả 7 SEC.

## 3. Kỹ thuật §6.1 → số case

| Kỹ thuật §6.1 đòi | API-01 | API-02 | API-03 | Tổng |
|---|--:|--:|--:|--:|
| Domain partition trên **mọi** tham số | | | | |
| State transition | | | | |
| Security SEC-01..07 | | | | |
| Schema validation | | | | |
| **Tổng** | | | | |
