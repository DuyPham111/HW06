# [BUG-11][Critical][API-02] `apply-coupon` không yêu cầu xác thực dù FR-09 C4 đòi phải đăng nhập

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `critical`, `api-02` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-02 |
| **Mức độ** | **Critical** |
| **Đặc tả bị vi phạm** | FR-09 C4: *"Đã đăng nhập — Người dùng phải có JWT Token hợp lệ"* + SEC-02 |
| **Test case** | TC-COUPON-031 |

Mọi request `curl` tới `/api/apply-coupon` trong suốt quá trình kiểm thử **đều thành công mà không
gửi header `Authorization`** — xác nhận route hoàn toàn public, trái với điều kiện C4 đề bài định
nghĩa.
