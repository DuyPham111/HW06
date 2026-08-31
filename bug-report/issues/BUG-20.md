# [BUG-20][Critical][API-03] Cập nhật một phần xoá mất dữ liệu (set NULL) thay vì giữ nguyên

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `critical`, `api-03` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-03 |
| **Mức độ** | **Critical** |
| **Đặc tả bị vi phạm** | FR-15: *"Khi Sửa một sản phẩm, chỉ sản phẩm đó bị thay đổi — các sản phẩm khác giữ nguyên"* (ngụ ý ở cấp trường: trường không gửi phải giữ nguyên) |
| **Test case** | TC-PRODUPD-022, 038, 105 |
| **Vị trí mã nguồn** | `server.js` handler PUT — `UPDATE products SET name=?, price=?, ... WHERE id=?` luôn ghi đè **cả 5 cột** bằng giá trị từ body, kể cả khi field không được gửi (`undefined` → `NULL`) |

**Kết quả thực tế:** `PUT /api/products/3` chỉ gửi `{"name": "..."}` → `price`, `description`,
`imageUrl`, `category_id` của sản phẩm đều thành `NULL`. `PUT` với body rỗng `{}` xoá **sạch** cả 5
trường cùng lúc.

**Ảnh hưởng** — bất kỳ form sửa sản phẩm nào chỉ gửi các trường người dùng thực sự chỉnh (hành vi
thông thường của UI) đều vô tình xoá sạch dữ liệu các trường còn lại — và trên sản phẩm `id` chẵn,
còn trực tiếp gây ra BUG-19.
