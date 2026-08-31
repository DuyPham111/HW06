# [BUG-14][Critical][API-02] Checkout không xác thực `total_amount` phía server (price tampering)

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `critical`, `api-02` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-02 |
| **Mức độ** | **Critical** |
| **Test case** | TC-COUPON-034, TC-COUPON-101 |
| **Vị trí mã nguồn** | `server.js` handler `POST /api/checkout` — `INSERT INTO orders (..., total_amount, ...)` dùng thẳng `req.body.total_amount`, không đọc lại giỏ hàng |

**Kết quả thực tế:** giỏ hàng chứa iPhone 30.000.000đ, nhưng `POST /api/checkout` với
`{"total_amount": 1}` vẫn tạo đơn thành công với `total_amount = 1` được lưu nguyên vào DB.

**Ảnh hưởng** — kết hợp với BUG-21 (PUT sản phẩm không cần token), một kẻ tấn công có thể tự đặt giá
đơn hàng bất kỳ khi thanh toán, hoàn toàn không phụ thuộc giá thật của sản phẩm.
