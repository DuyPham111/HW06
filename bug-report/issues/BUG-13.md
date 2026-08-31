# [BUG-13][Critical][API-02] IDOR qua `user_id` trong body: bỏ qua hoặc mượn hạn mức người khác

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `critical`, `api-02` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-02 |
| **Mức độ** | **Critical** |
| **Đặc tả bị vi phạm** | FR-09 C5 + SEC-02 (hệ quả của việc thiếu C4) |
| **Test case** | TC-COUPON-036, TC-COUPON-037 |

**Kết quả thực tế:**
```bash
# Da dung het 2/2 luot That (user_id that), nhung KHONG gui user_id:
curl -X POST /api/apply-coupon -d '{"code":"VIP100","total_amount":400000}'
# -> 200 thanh cong, BO QUA HOAN TOAN kiem tra han muc
```
Vì nhánh kiểm `max_uses_per_user` chỉ chạy `if (user_id)`, client chỉ cần **không gửi** `user_id` để
áp dụng coupon giới hạn lượt **vô hạn lần**. Ngược lại, gửi `user_id` của người khác thì "mượn" được
hạn mức của họ (chưa dùng lần nào) trong khi vẫn đang dùng đúng token/trình duyệt của mình.
