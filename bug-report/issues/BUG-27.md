# [BUG-27][High][API-03] HTML lỗi lộ stack trace khi body PUT không phải JSON hợp lệ

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `high`, `api-03` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-03 |
| **Mức độ** | High |
| **Test case** | TC-PRODUPD-045 |

Cùng nguyên nhân và mức độ với BUG-07 (API-01) — `body-parser` ném lỗi parse, Express trả trang HTML
mặc định kèm đường dẫn tuyệt đối của server.
