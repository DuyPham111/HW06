# [BUG-07][High][API-01] HTML lỗi lộ stack trace khi body không phải JSON hợp lệ

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `high`, `api-01` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-01 (và tương tự API-03, xem BUG-27) |
| **Mức độ** | High |
| **Test case** | TC-LOGIN-036, TC-LOGIN-104 |

**Kết quả thực tế:** gửi body không phải JSON (nhưng đúng `Content-Type: application/json`) →
`body-parser` ném `SyntaxError`, Express dùng trang lỗi HTML mặc định, trả nguyên `stack trace` gồm
đường dẫn tuyệt đối `D:\Nam3\HK3\...\node_modules\body-parser\lib\types\json.js:109:10` và tên các
hàm nội bộ.

**Ảnh hưởng** — cùng loại rò rỉ thông tin với BUG-06, nhưng do một nguyên nhân khác (SUT chưa cấu
hình error-handling middleware tuỳ chỉnh để bắt lỗi parse và trả JSON gọn).
