# [BUG-17][High][API-02] `canceled` không phải trạng thái kết thúc thật (chuyển được sang `delivered`)

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `high`, `api-02` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-02 |
| **Mức độ** | High |
| **Đặc tả bị vi phạm** | FR-10: *"`delivered` và `canceled` là trạng thái kết thúc — không được chuyển sang bất kỳ trạng thái nào khác"* |
| **Test case** | TC-COUPON-028 |
| **Vị trí mã nguồn** | logic `isValidTransition` có riêng một nhánh `if (currentStatus === "canceled" && status === "delivered") isValidTransition = true` — **cố tình** cho phép, không phải thiếu sót ngẫu nhiên |
