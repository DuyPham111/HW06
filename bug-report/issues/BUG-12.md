# [BUG-12][High][API-02] Biên `min_order_amount` dùng `>` thay vì `>=`

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `high`, `api-02` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-02 |
| **Mức độ** | High |
| **Đặc tả bị vi phạm** | FR-09 C3: *"Tổng đơn hàng **>=** `min_order_amount`"* |
| **Test case** | TC-COUPON-004 |

`total_amount` đúng bằng `min_order_amount` (300.000) bị từ chối — theo đặc tả phải được chấp nhận.
Đây cũng là case AI ban đầu **chép sai** theo hành vi code — xem `audit.md`.
