# [BUG-02][High][API-01] Tài khoản bị khóa từ lần sai thứ 2, không phải "từ lần thứ 3" như FR-02

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `high`, `api-01` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-01 |
| **Mức độ** | High |
| **Đặc tả bị vi phạm** | FR-02: *"Nếu đăng nhập sai từ 3 lần trở lên liên tiếp, tài khoản bị tạm khóa"* |
| **Test case** | TC-LOGIN-022 |
| **Vị trí mã nguồn** | `server.js:54` — `newAttempts = user.login_attempts + 2` (bước nhảy +2, không phải +1) |

**Kết quả thực tế:** đăng nhập sai lần 1 → 401 (bộ đếm 0→2). Đăng nhập sai lần 2 → **401** (bộ đếm
2→4, đã ≥3, khóa được **đặt ngầm** ngay lúc này — nhưng response của chính request này chưa phản
ánh). Request thứ 3 — dù là **mật khẩu đúng** — nhận **403**, vì lúc kiểm đầu hàm, khóa đã tồn tại
từ trước. Tổng cộng: khóa xảy ra sau **2 lần sai thật sự**, không phải 3.

**Kết quả mong đợi** — request thứ 3 với mật khẩu đúng phải thành công (200), vì FR-02 chỉ khóa khi
đã có **3 lần sai liên tiếp**, và ở đây mới có 2.

**Ảnh hưởng** — người dùng gõ nhầm mật khẩu 2 lần rồi nhớ ra và gõ đúng vẫn bị khóa oan 180 giây,
trải nghiệm tệ hơn đặc tả cam kết.
