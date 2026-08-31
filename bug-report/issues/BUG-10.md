# [BUG-10][Critical][API-02] Công thức phần trăm coupon sai dấu — giảm giá ÂM, tổng cuối LỚN HƠN đơn gốc

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `critical`, `api-02` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-02 · `POST /api/apply-coupon` |
| **Mức độ** | **Critical** |
| **Đặc tả bị vi phạm** | FR-09: *"Loại percent: `discount_amount = total × discount_value / 100`"* |
| **Test case** | TC-COUPON-001, 042, 043 |
| **Vị trí mã nguồn** | `server.js` — `Math.floor(total_amount * (1 - coupon.discount_value))` (dùng `1 - value` thay vì `value / 100`) |

**Kết quả thực tế:**
```bash
curl -X POST /api/apply-coupon -d '{"code":"SAVE10","total_amount":500000}'
# {"discount_amount":-4500000,"final_amount":5000000,"message":"Áp dụng thành công! Giảm 10%"}
```
Với `discount_value = 10` (nghĩa là 10%), công thức tính `1 - 10 = -9`, nhân với 500.000 ra
**-4.500.000** — một số âm khổng lồ. `final_amount = total - discount = 500.000 - (-4.500.000) =
5.000.000` — gấp **10 lần** giá gốc, được dán nhãn "Áp dụng thành công! Giảm 10%".

**Kết quả mong đợi** — `discount_amount = 500.000 × 10 / 100 = 50.000`, `final_amount = 450.000`.

**Ảnh hưởng** — bug nghiêm trọng nhất về mặt tài chính trong cả 3 API: nếu số này được dùng để tính
tiền thật ở bước checkout, khách hàng phải trả **nhiều hơn** giá gốc trong khi hệ thống báo "đã giảm
giá thành công".
