# [BUG-04][High][API-01] Response lộ các cột nội bộ (`login_attempts`, `locked_until`, `reset_token`)

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `high`, `api-01` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-01 |
| **Mức độ** | High |
| **Test case** | TC-LOGIN-029, TC-LOGIN-037 |
| **Vị trí mã nguồn** | `server.js:50` |

Cùng nguyên nhân với BUG-03 (trả nguyên dòng DB). Lộ `reset_token` nghiêm trọng hơn: nếu người dùng
từng gọi quên mật khẩu, OTP còn hiệu lực bị lộ ngay trong response đăng nhập.
