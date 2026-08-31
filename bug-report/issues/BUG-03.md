# [BUG-03][Critical][API-01] Response đăng nhập thành công lộ nguyên mật khẩu dạng plaintext

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `critical`, `api-01` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-01 |
| **Mức độ** | **Critical** |
| **Đặc tả bị vi phạm** | SEC-01: *"Mật khẩu không được lưu dưới dạng plaintext"* |
| **Test case** | TC-LOGIN-028 |
| **Vị trí mã nguồn** | `server.js:32-50` — `res.json({message, token, user})` với `user` là nguyên dòng DB |

**Kết quả thực tế:**
```json
{"message":"Login successful","token":"...","user":{"id":3,"name":"Dup1","email":"dup-test@x.com","password":"Abc12345!","role":"user","login_attempts":0,"locked_until":null,"reset_token":null,"shipping_address":null,"phone":null}}
```
Trường `password` xuất hiện **nguyên văn, đúng bằng giá trị vừa gửi lên**, xác nhận nó cũng được
**lưu plaintext trong DB** (không hash) — vi phạm kép: vừa lưu sai, vừa trả về sai.

**Kết quả mong đợi** — `user` trong response không được có field `password`.

**Ảnh hưởng** — ai chặn được response (log, proxy, trình duyệt debug) đều lấy được mật khẩu thật của
người dùng; kết hợp thói quen dùng lại mật khẩu, ảnh hưởng ra ngoài phạm vi hệ thống này.
