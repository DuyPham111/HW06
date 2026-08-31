# [BUG-18][Critical][API-02] Đổi trạng thái đơn không kiểm role admin (SEC-03)

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `critical`, `api-02` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-02 |
| **Mức độ** | **Critical** |
| **Đặc tả bị vi phạm** | SEC-03: *"API Admin phải kiểm tra `role = 'admin'` trong Token, không chỉ kiểm tra sự tồn tại của Token"* |
| **Test case** | TC-COUPON-032, TC-COUPON-039 |

`PUT /api/admin/orders/:id/status` chỉ có `authenticateToken` (kiểm token hợp lệ), **không** kiểm
`req.user.role === "admin"` — user thường đổi được trạng thái đơn của bất kỳ ai.
