# API-01 — Pool A · `POST /api/login` · bước 3 (§6.3): case do **sinh viên** thêm

- **6 case** (đề đòi ≥5/API), cột `Nguồn` = **SV**, ID từ `TC-LOGIN-101`.
- Sinh từ `generator/specs/api-01-login.mjs` bằng `node tools/gen-artifacts.mjs api-01-login`.

> Case do **sinh viên chọn phạm vi** (kiểm gì, ở đâu, vì sao đáng kiểm) khi đọc lại `server.js` +
> `database.js` sau lượt AI đầu — AI chỉ chấp bút thành dòng bảng. Không phải case AI sinh ở lượt hai
> (loại đó phải đánh dấu `AI-2`, không tính vào §6.3).

## Bảng test case

| TC ID | Kỹ thuật | Tham số & phân vùng | Request | Auth | Query / Body | Expected status | Expected body / schema | Căn cứ | Nguồn | Audit | Kết quả |
|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-LOGIN-101 | Security (DoS lockout) | SV: DoS khóa tài khoản NGƯỜI KHÁC — kẻ tấn công gửi thêm 1 request thiếu `password` nữa (bước 2, sau bước 1 ở TC-LOGIN-031) — CHƯA phản ánh khóa ở response này (đúng mô hình đã xác nhận) | `POST /api/login` | không có header | {"email":"{{lockout_email_4}}"} | 401 | 401 — response của chính request thứ 2 này chưa đổi, nhưng khóa đã được đặt ngầm cho request kế tiếp | hệ quả nguy hiểm của FR-02 khi thiếu validate — tự phát hiện khi đọc code, không phải suy từ 1 prompt | SV |  |  |
| TC-LOGIN-101b | Security (DoS lockout) | SV: hoàn tất chứng minh DoS — nạn nhân (chủ tài khoản thật) thử đăng nhập bằng ĐÚNG mật khẩu của mình (request thứ 3) và VẪN bị chặn, dù kẻ tấn công chưa từng biết mật khẩu | `POST /api/login` | không có header | {"email":"{{lockout_email_4}}","password":"MatKhauThatCuaNanNhan!"} | 403 | 403 — nạn nhân bị khóa hoàn toàn dù kẻ tấn công KHÔNG hề biết mật khẩu, chỉ cần biết email | hệ quả nguy hiểm của FR-02 khi thiếu validate `password` tồn tại trước khi cộng bộ đếm | SV |  |  |
| TC-LOGIN-102 | Security (account enumeration) | SV: so sánh response giữa email KHÔNG tồn tại và email TỒN TẠI + đã bị khóa — phải KHÔNG phân biệt được | `POST /api/login` | không có header | {"email":"khong-ton-tai-enum-test@x.com","password":"x"} | 401 | 401 `{error:"Invalid email or password"}` — PHẢI KHÁC 403 mà tài khoản tồn tại+bị khóa trả về, nếu không kẻ tấn công dò được email nào có thật | FR-02 'không để lộ chi tiết nguyên nhân' — áp dụng chéo 2 request để lộ ra kênh ngầm (side channel) | SV |  |  |
| TC-LOGIN-103 | Domain | SV: đăng ký 2 tài khoản CÙNG email → tài khoản thứ 2 vĩnh viễn không đăng nhập được bằng mật khẩu của chính nó | `POST /api/login` | không có header | 2×`POST /api/register` cùng email khác mật khẩu, rồi login bằng mật khẩu của tài khoản ĐĂNG KÝ SAU | 200 | 200 — nếu hệ thống coi email là định danh duy nhất (ngụ ý bởi việc dùng email để login) thì tài khoản mới nhất với email đó phải đăng nhập được bằng đúng mật khẩu của nó | spec §1.1/§1.2 dùng email làm định danh đăng nhập duy nhất — ngụ ý email phải là duy nhất | SV |  |  |
| TC-LOGIN-104 | Schema | SV: response lỗi khi body không phải JSON KHÔNG được là trang HTML có đường dẫn tuyệt đối của server | `POST /api/login` | không có header | "khong phai JSON hop le nua" | 400 | body KHÔNG được chứa chuỗi đường dẫn hệ thống (`D:\`, `node_modules`, `at Object.`) | nguyên tắc chung: response lỗi không được lộ cấu trúc filesystem/thư viện nội bộ của server | SV |  |  |
| TC-LOGIN-105 | State | SV: token lấy từ `POST /api/login` phải dùng được ngay cho `GET /api/users/me` (dùng token đã lưu ở bước 00-setup) | `GET /api/users/me` | user (token vừa login) | dùng `{{user_token}}` đã lưu từ 00-setup → gọi `GET /api/users/me` | 200 | 200, `email` khớp tài khoản vừa login | spec §2.1 + §1.2 (token dùng cho các request có xác thực) | SV |  |  |

## Vì sao lượt AI đầu bỏ sót (§6.3)

| TC ID | AI bỏ sót gì | Nhóm lý do | Giải thích |
|---|---|---|---|
| TC-LOGIN-101 | DoS khóa tài khoản NGƯỜI KHÁC — kẻ tấn công gửi thêm 1 request thiếu `password` nữa (bước 2, sau bước 1 ở TC-LOGIN-031) — CHƯA phản ánh khóa ở response này (đúng mô hình đã xác nhận) | prompt quality | AI (bước 4b — Security) chỉ sinh case SQLi/XSS vì prompt yêu cầu 'security: SQL injection' — nó không tự nghĩ ra việc *thiếu* một field cũng là một vector tấn công (DoS), vì đó không khớp khuôn mẫu payload độc hại quen thuộc. |
| TC-LOGIN-101b | hoàn tất chứng minh DoS — nạn nhân (chủ tài khoản thật) thử đăng nhập bằng ĐÚNG mật khẩu của mình (request thứ 3) và VẪN bị chặn, dù kẻ tấn công chưa từng biết mật khẩu | prompt quality | Cùng nhóm lý do với TC-LOGIN-101 — chuỗi 2 case này là MỘT cuộc tấn công hoàn chỉnh (request 1 ở TC-LOGIN-031, request 2 ở đây, request 3 xác nhận nạn nhân bị khóa). |
| TC-LOGIN-102 | so sánh response giữa email KHÔNG tồn tại và email TỒN TẠI + đã bị khóa — phải KHÔNG phân biệt được | model limitations | AI chỉ kiểm 'có lộ lý do trong 1 response hay không', không nghĩ tới việc SO SÁNH 2 response với nhau mới lộ ra khác biệt trạng thái tài khoản (403 vs 401) — đây là lỗi suy luận 1-bước-1-request, không mô phỏng được góc nhìn kẻ tấn công dò nhiều tài khoản. |
| TC-LOGIN-103 | đăng ký 2 tài khoản CÙNG email → tài khoản thứ 2 vĩnh viễn không đăng nhập được bằng mật khẩu của chính nó | characteristics of the API | characteristics of the API — không có trong đặc tả API (`api_specification.md` không nói 'email phải duy nhất'), và không nằm ở tầng logic mà nằm ở TẦNG SCHEMA CSDL (`database.js` không có `UNIQUE` trên cột `email`). AI chỉ đọc file đặc tả và mã handler, không đọc schema bảng nên không thấy được ràng buộc còn thiếu. |
| TC-LOGIN-104 | response lỗi khi body không phải JSON KHÔNG được là trang HTML có đường dẫn tuyệt đối của server | prompt quality | AI (bước 5 — Schema) chỉ kiểm shape của response THÀNH CÔNG khớp đặc tả — prompt nói 'response shape matches the spec', và đặc tả chỉ mô tả response THÀNH CÔNG. Nhánh lỗi khi body không parse được là hành vi của middleware `body-parser`, nằm hoàn toàn ngoài đặc tả API, nên AI không có cơ sở nào để tự sinh case này. |
| TC-LOGIN-105 | token lấy từ `POST /api/login` phải dùng được ngay cho `GET /api/users/me` (dùng token đã lưu ở bước 00-setup) | prompt quality | AI sinh case cho từng endpoint RIÊNG LẺ theo đúng phạm vi API đã chọn (`POST /api/login`), không tự nối sang endpoint khác (`GET /api/users/me`) để xác nhận TOKEN THẬT SỰ DÙNG ĐƯỢC — đây là kiểm tra tích hợp xuyên-API mà một prompt chỉ nhắm 1 endpoint sẽ không tạo ra. |

> Một số TC ID không xuất hiện ở bảng trên (vd `-102b`, `-102c`...) vì đó là các bước **trong cùng
> một chuỗi** với case đứng trước nó (chung một lý do bỏ sót), không phải case độc lập mới.
