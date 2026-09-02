# API-02 — Pool B · `POST /api/apply-coupon` · bước 2 (§6.2): audit

- 48 case AI sinh (`generated.md`), audit qua **5 phép soát** + **chạy thật bằng Newman**.
- Lượt cuối cùng lưu ở `reports/newman/23127183_api-02-apply-coupon_*.json`.

## Thống kê audit

| Nhãn | Số case |
|---|--:|
| VALID | 42 |
| INVALID (đã sửa) | 1 |
| INCOMPLETE (đã bổ sung) | 5 |

## Ghi chú audit

**`TC-COUPON-004` — AI_MISTAKE có chủ đích, đã xác nhận qua thực nghiệm.** Lượt sinh case đầu mô
phỏng AI **chép hành vi code** (`if (total_amount > coupon.min_order_amount)`) rồi dán nhãn FR-09 lên
— dự đoán `total_amount` đúng bằng `min_order_amount` (300.000) sẽ bị từ chối (400). Chạy Newman thật
xác nhận đúng dự đoán này là 400 — nhưng **FR-09 C3 ghi rõ `>=`**, nghĩa là 300.000 phải được **chấp
nhận**. Expected của case này **giữ nguyên 400** làm case minh hoạ AI_MISTAKE (đỏ có chủ đích khi so
với FR-09 thật) — đây chính là **BUG-08** trong bug-report.

**`TC-COUPON-032`/`TC-COUPON-039` — INCOMPLETE, bị "che khuất" bởi trạng thái đơn từ bước trước.**
Bản đầu tái dùng `order_id` đã bị đẩy qua nhiều bước chuyển trạng thái trước đó — khi case kiểm SEC-03
(user thường gọi endpoint admin) chạy tới, đơn đã ở trạng thái không cho phép chuyển đổi tới target
đó nữa, nên response là `400 Invalid state transition` thay vì phản ánh đúng phép kiểm role. Đã sửa:
thêm bước `TC-COUPON-031b` tạo **đơn riêng** (`order_id_3`) ở `pending`, dùng đúng 1 chuyển đổi HỢP
LỆ (`pending → confirmed`, rồi `confirmed → canceled`) để tách bạch phép kiểm role khỏi tính đúng đắn
của máy trạng thái. Sau khi sửa, cả hai đúng nghĩa lộ ra **BUG-11** (SEC-03).

**`TC-COUPON-102` — INCOMPLETE nghiêm trọng, thiếu 4/5 bước thật.** Bản đầu mô tả bằng lời một chuỗi
5 bước ("apply lần 1 → ghi usage → apply lần 2 → ghi usage → apply lần 3 bị chặn") nhưng **chỉ viết
một request duy nhất** kiểm bước cuối — đúng lỗi mà [`docs/05-EXTEND.md`](../../docs/05-EXTEND.md)
cảnh báo ("mô tả suông"). Chạy thật cho 400 sai (thực ra do biến shell `$UID` là biến hệ thống chỉ
đọc, không phải do SUT) — sau khi phát hiện, đã viết lại đủ **5 case tuần tự thật**
(`102, 102b, 102c, 102d, 102e`), mỗi case một request. Case sau khi sửa **XANH** (VIP100 hoạt động
đúng khi dùng đúng `user_id` thật) — đây là case đối chứng quan trọng: không phải mọi cơ chế hạn mức
đều hỏng, chỉ hỏng khi `user_id` do client tự khai (xem BUG-10).

**`TC-COUPON-105` — INVALID, expected sai hoàn toàn.** Bản đầu kỳ vọng admin dùng endpoint
`PUT /orders/:id/cancel` (dành cho user) để huỷ đơn của người khác sẽ bị `403`. Chạy thật cho **404**
— sau khi đối chiếu với `server.js`, xác nhận đây là **hành vi ĐÚNG**: câu lệnh
`SELECT * FROM orders WHERE id=? AND user_id=?` đã tự lọc theo `req.user.id`, nên admin gọi vào đơn
của người khác thì **không tìm thấy** (404), không lộ ra là đơn có tồn tại hay không. Đã sửa expected
thành 404 và đổi mô tả thành **case đối chứng** (hành vi đúng), không còn là case bug. Giữ lại có chủ
đích để chứng minh không phải mọi thứ trong SUT đều sai.

## Không sửa expected để khớp SUT

Lượt nộp chính thức (`reports/newman/23127183_api-02-apply-coupon_20260902-222617.json`) —
**13/59 assertion đỏ**, liệt kê đúng từng ID:

`TC-COUPON-001 · TC-COUPON-023 · TC-COUPON-028 · TC-COUPON-031 · TC-COUPON-032 · TC-COUPON-033 ·
TC-COUPON-034 · TC-COUPON-036 · TC-COUPON-037 · TC-COUPON-039 · TC-COUPON-042 · TC-COUPON-043 ·
TC-COUPON-101`

Mỗi dòng map tới đúng 1 bug trong [`bug-report/bug-report.md`](../../bug-report/bug-report.md), trừ
`TC-COUPON-001` (trùng nguyên nhân với TC-COUPON-042/043 — cùng 1 bug BUG-07 công thức coupon).

**Ghi chú lượt trước (đã sửa) — `TC-COUPON-102`/`102c` từng đỏ oan vì môi trường, không phải vì
SUT.** Lượt chạy đầu tiên (31/08/2026) cho **15** assertion đỏ, gồm cả `TC-COUPON-102` (áp `VIP100`
lần 1) và `TC-COUPON-102c` (lần 2) — cả hai nhận `400` thay vì `200` mong đợi. Khi soát lại, nguyên
nhân là **hạn mức 2 lượt của mã `VIP100` đã bị tiêu hết từ trước** — cùng buổi làm việc đó, trước khi
viết bảng test case, đã có một lượt dò dữ liệu thật bằng `curl` (LOG-004) từng gọi `apply-coupon` với
`VIP100` và `user_id` thật mà **không restart SUT** trước khi chạy lượt Newman "chính thức" ngay sau
đó. Sau khi khởi động lại SUT thật sạch (DB seed lại từ đầu, xem `docs/01-SETUP.md` §2) rồi chạy lại,
`TC-COUPON-102`/`102c` **xanh đúng như thiết kế** — 13 đỏ mới là con số chính xác, đã cập nhật lại
`ci/expected-failures.json` và toàn bộ báo cáo. Đây chính là bài học mà `docs/07-CHAY-NEWMAN-BANG-CHUNG.md`
§1 đã cảnh báo trước: **restart SUT trước mỗi lượt Newman "chính thức" không phải bước tuỳ chọn.**

## Bảng audit đầy đủ

Xem [`generated.md`](generated.md) — bản đúng sau audit (case INVALID/INCOMPLETE đã sửa trực tiếp
trong `generator/specs/api-02-apply-coupon.mjs`, nguồn duy nhất).

---

Đã đọc và duyệt toàn bộ 48 test case do AI sinh (+ 9 case tự thêm ở `extended.md`), kèm nhiều vòng sửa lỗi dựa trên kết quả Newman thật (bao gồm phát hiện 1 lỗi do chính script kiểm chứng của người viết bài — biến `$UID` — chứ không phải do SUT) — Sinh Viên Phạm Vũ Ngọc Duy, 23127183, ngày 31/08/2026