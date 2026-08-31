# [BUG-23][High][API-03] Không validate `name`/`price`/`category_id` theo FR-15

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `high`, `api-03` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-03 |
| **Mức độ** | High |
| **Test case** | TC-PRODUPD-002, 004, 006, 007, 008, 009, 010 |

Tổng hợp 7 test case: `name` rỗng, `name` 256 ký tự (vượt 255), `price = 0`, `price` âm, `price` sai
kiểu (chuỗi chữ), `category_id` không tồn tại, `category_id` thiếu — **tất cả đều được chấp nhận**
(200), không một ràng buộc nào trong FR-15 được thực thi ở phía server.
