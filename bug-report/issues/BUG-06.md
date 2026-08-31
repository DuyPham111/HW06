# [BUG-06][High][API-01] Crash 500 + lộ stack trace khi thiếu đúng `Content-Type: application/json`

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `high`, `api-01` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-01 |
| **Mức độ** | High |
| **Test case** | TC-LOGIN-016 |
| **Vị trí mã nguồn** | `server.js:33` — `const {email, password} = req.body` khi `req.body` là `undefined` |

**Kết quả thực tế** (curl, `Content-Type: text/plain`):
```
TypeError: Cannot destructure property 'email' of 'req.body' as it is undefined.
    at D:\...\server.js:33:11
    ...9 dòng stack trace kèm đường dẫn tuyệt đối của server...
HTTP 500
```

**Ảnh hưởng** — lộ cấu trúc thư mục server, tên thư viện và phiên bản (`body-parser`, `router`) — dữ
liệu trinh sát hữu ích cho tấn công tiếp theo. Đây là lỗi 500 KHÔNG được catch, khác với BUG-07.
