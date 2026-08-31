# [BUG-08][Critical][API-01] Đăng ký trùng email không bị chặn → tài khoản đăng ký sau mất quyền đăng nhập

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `critical`, `api-01` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-01 |
| **Mức độ** | **Critical** |
| **Test case** | TC-LOGIN-103 |
| **Vị trí mã nguồn** | `database.js:47-56` — cột `email TEXT` **không có `UNIQUE`** |

**Kết quả thực tế:**
```bash
curl -X POST /api/register -d '{"email":"dup-test@x.com","password":"Abc12345!"}'  # id=3, thành công
curl -X POST /api/register -d '{"email":"dup-test@x.com","password":"Zzz99999!"}'  # id=4, thành công
curl -X POST /api/login    -d '{"email":"dup-test@x.com","password":"Abc12345!"}'  # 200 (tài khoản id=3)
curl -X POST /api/login    -d '{"email":"dup-test@x.com","password":"Zzz99999!"}'  # 401 !!!
```
`SELECT * FROM users WHERE email=?` luôn trả **dòng đầu tiên khớp** (`id` nhỏ nhất) — tài khoản đăng
ký sau, dù đúng email và đúng mật khẩu của chính nó, **không bao giờ đăng nhập được**.

**Ảnh hưởng** — nếu 2 người vô tình dùng cùng email (hoặc 1 người đăng ký lại vì tưởng thất bại),
tài khoản mới tạo ra là **vô dụng vĩnh viễn**, không có thông báo lỗi nào cảnh báo trước.
