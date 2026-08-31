# [BUG-01][Critical][API-01] Khóa tài khoản người khác (DoS) chỉ bằng email, không cần biết mật khẩu

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `critical`, `api-01` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-01 · `POST /api/login` |
| **Mức độ** | **Critical** |
| **Đặc tả bị vi phạm** | Hệ quả bất lợi của FR-02 khi thiếu validate `password` tồn tại trước khi cộng bộ đếm sai |
| **Test case** | TC-LOGIN-031, TC-LOGIN-101, TC-LOGIN-101b |
| **Vị trí mã nguồn** | `server.js:32-66` — nhánh `else` (sai mật khẩu) không kiểm `password !== undefined` trước khi so sánh |
| **AI có bắt được không** | Có (bước 4b), nhưng phải bổ sung 1 case SV (101b) mới đủ chứng minh hết chuỗi 3 request |

**Các bước tái hiện**

```bash
bash bug-report/verify-bugs.sh 01
```

**Kết quả thực tế** (đã chạy qua Newman): 2 request `POST /api/login` chỉ có `{email}` (không có
`password`) tới cùng một tài khoản `victim@x.com` → cả 2 đều 401 (không lộ ngay), nhưng request thứ 3
— **chủ nhân thật của tài khoản** đăng nhập bằng đúng mật khẩu của mình — nhận **403 "Tài khoản đã
bị khóa"**.

**Kết quả mong đợi** — request thiếu `password` phải bị từ chối ngay ở bước validate đầu vào
(400), không được chạm tới nhánh cộng bộ đếm sai.

**Ảnh hưởng** — Bất kỳ ai biết một địa chỉ email đã đăng ký đều khóa được tài khoản đó trong 180
giây mà **không cần biết** một ký tự nào của mật khẩu — biến cơ chế chống brute-force (FR-02) thành
công cụ tấn công từ chối dịch vụ nhắm vào người dùng cụ thể.
