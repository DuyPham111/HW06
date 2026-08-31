# [BUG-26][Low][API-03] `price` bị ép kiểu thành **string** khi `id` chẵn

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `low`, `api-03` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-03 |
| **Mức độ** | Low |
| **Test case** | TC-PRODUPD-039 |
| **Vị trí mã nguồn** | `server.js:162` |

Độc lập với BUG-19/20 (crash khi giá trị là `null`): ngay cả khi `price` là số hợp lệ, `GET` sản
phẩm `id` chẵn luôn trả `price` dạng **chuỗi** (`"100000"`), trong khi `id` lẻ trả **number**
(`100000`) — client phải tự xử lý 2 kiểu dữ liệu khác nhau cho cùng một field.
