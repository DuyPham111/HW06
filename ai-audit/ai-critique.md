# AI Critique — HW06 (§10, bắt buộc 200–300 từ)

- **Sinh viên:** Phạm Vũ Ngọc Duy — 23127183

---

Sai lầm rõ nhất của AI xuất hiện khi thiết kế chuỗi kiểm khóa tài khoản cho `POST /api/login`. AI
giả định request sai mật khẩu thứ hai sẽ tự trả 403, nhưng `curl` thật cho thấy phản hồi vẫn 401 —
khóa chỉ lộ ở request thứ ba, vì hàm kiểm `locked_until` ở đầu, trước khi cập nhật bộ đếm. AI đọc
đúng điều kiện `newAttempts >= 3` nhưng không mô phỏng đúng **thứ tự thực thi** của các câu lệnh, nên
suy sai điểm quan sát được của hành vi.

Nguyên nhân sâu hơn: AI suy luận trên logic tĩnh, không mô phỏng trạng thái tích lũy qua nhiều
request độc lập. Lỗi lặp lại ở quy mô lớn hơn khi AI (đóng vai người thiết kế test) tái dùng một sản
phẩm tạo tự động cho case "cập nhật một phần" — không kiểm `id` chẵn hay lẻ, vô tình kích hoạt bug
crash server thật (`GET` gọi `null.toString()`). AI không bắt được vì hậu quả nằm ở một request
*khác*, xảy ra *sau*, không lộ ngay trong response của request gây lỗi.

Case bỏ sót đáng kể nhất: công thức giảm giá coupon cho ra số âm (`discount_amount = -4.500.000`).
AI kiểm đúng *kiểu dữ liệu* nhưng không tự thay số vào công thức để phát hiện dấu sai — đọc code như
văn bản, không đánh giá biểu thức.

Nguyên tắc rút ra: AI đọc và tổng hợp logic tĩnh rất nhanh, nhưng **không tự mô phỏng trình tự thời
gian, trạng thái tích lũy giữa nhiều request, hay giá trị số cụ thể** — ba việc người thiết kế test
phải tự chạy thật để bù đắp, không tin tưởng tuyệt đối vào suy luận đọc code.

---

**Số từ:** 294 / 200–300
