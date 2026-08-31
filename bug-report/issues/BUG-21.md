# [BUG-21][Critical][API-03] `PUT`/`DELETE /api/products/:id` không yêu cầu xác thực

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `critical`, `api-03` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-03 |
| **Mức độ** | **Critical** |
| **Đặc tả bị vi phạm** | SEC-02 + FR-15: *"Admin có thể Thêm/Sửa/Xóa sản phẩm"* |
| **Test case** | TC-PRODUPD-027, 028, 030, 102 |
| **Đối chứng** | TC-PRODUPD-035 (`PUT /api/categories/:id` — route "anh em" cùng nhóm admin — **CÓ** `authenticateToken`, xác nhận đây là thiếu sót không nhất quán, không phải chủ đích) |

`PUT` và `DELETE` trên sản phẩm thành công với **không có header, token rác, hay bất kỳ trạng thái
xác thực nào** — route hoàn toàn không có middleware `authenticateToken`, khác hẳn route
`/api/categories/:id` cùng nhóm chức năng.
