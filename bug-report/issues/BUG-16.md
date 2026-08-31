# [BUG-16][High][API-02] Hủy được đơn đang `shipping` (vi phạm FR-10)

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `high`, `api-02` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-02 |
| **Mức độ** | High |
| **Đặc tả bị vi phạm** | FR-10: *"chỉ được hủy khi `pending` hoặc `confirmed`"* |
| **Test case** | TC-COUPON-023 |
| **Vị trí mã nguồn** | `server.js` handler cancel — chỉ chặn `status === "delivered" \|\| status === "canceled"`, thiếu chặn `shipping` |
