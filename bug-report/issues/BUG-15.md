# [BUG-15][High][API-02] `GET /api/orders/:id` không yêu cầu xác thực (IDOR đọc đơn hàng)

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `high`, `api-02` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-02 |
| **Mức độ** | High |
| **Test case** | TC-COUPON-033 |

Đọc được chi tiết đơn hàng (địa chỉ giao hàng, tổng tiền, trạng thái) của **bất kỳ ai** chỉ bằng cách
đoán/duyệt `id` tuần tự, không cần token.
