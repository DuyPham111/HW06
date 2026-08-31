# API-03 — Pool C · `PUT /api/products/:id` · bước 2 (§6.2): audit

- 45 case AI sinh (`generated.md`), audit qua **5 phép soát** + **chạy thật bằng Newman**.
- Lượt cuối cùng lưu ở `reports/newman/23127183_api-03-product-update_*.json`.

> **API này chứa bug nặng nhất trong cả 3 API: PUT thiếu trường → NULL → GET sau đó làm SẬP TOÀN
> BỘ BACKEND.** Bug này được phát hiện **ngoài ý muốn** trong lúc dò dữ liệu thật bằng `curl` trước
> khi viết bảng test case (không phải AI tự nghĩ ra) — xem LOG tương ứng trong `ai-audit-report.md`
> và chi tiết ở mục audit dưới đây.

## Thống kê audit

| Nhãn | Số case |
|---|--:|
| VALID | 39 |
| INVALID (đã sửa) | 0 |
| INCOMPLETE (đã bổ sung/sửa vị trí) | 6 |

## Ghi chú audit — 2 lần thiết kế case tự làm sập SUT, đã sửa cả hai

**`TC-PRODUPD-021`/`022` — INCOMPLETE nghiêm trọng: suýt tự làm sập SUT ngay trong lúc audit.**
Bản đầu dùng sản phẩm **vừa tạo động** (`{{state_product_id}}`) cho case "cập nhật một phần" — nhưng
DB seed sẵn 5 sản phẩm (`id` 1–5), nên sản phẩm mới tạo có `id` tiếp theo là **6, một số CHẴN**. Chạy
Newman thật: case 021 (PUT chỉ gửi `{name}`) đặt `price` thành `NULL`; case 022 (`GET` cùng id ngay
sau) chạm đúng dòng `server.js:162` (`row.price.toString()` trên `null`) → **backend crash**, mọi
case sau đó trong lượt chạy đỏ hàng loạt vì `ECONNREFUSED` — **vì môi trường, không phải vì bug**.
Đã sửa: chuyển 2 case này sang thao tác trên `id=3` (sản phẩm seed, LẺ, biết trước), giữ nguyên mục
đích kiểm tra (dữ liệu có bị mất khi cập nhật một phần không) mà không kích hoạt crash.

**`TC-PRODUPD-102` — INCOMPLETE: vô tình xoá dữ liệu case khác đang cần dùng.** Case tự thêm ban đầu
kiểm "DELETE không token" trên `id=1` — nhưng `id=1` cũng được dùng ở nhiều case Schema chạy SAU
(trong 04-schema, sau 03-security). Vì DELETE **cũng không có auth** (đúng là bug), request này thật
sự xoá `id=1`, khiến các case Schema sau đó nhận `GET /api/products/1` → `200 {}` (SUT coi như không
tồn tại) thay vì kiểm được đúng field `price`. Đã sửa: chuyển sang `id=4` (sản phẩm seed không case
nào khác dùng).

**4 case còn lại (`TC-PRODUPD-038/039/040`) — không sửa, nhưng ghi rõ nguyên nhân đỏ là gì.** Sau khi
sửa 2 lỗi trên, `id=1` vẫn bị **case khác** (`TC-PRODUPD-105`, PUT body rỗng `{}`, chạy trước trong
`02-state`) đặt `price = NULL` một cách **hợp lệ về mặt thiết kế** (đây chính là mục đích của case
105: chứng minh mức độ nặng nhất của lỗi mất dữ liệu). Hệ quả: `TC-PRODUPD-038` (kiểm `price` là
number trên `id` lẻ) đỏ vì `price` đã là `null` từ trước — **đây vẫn là bằng chứng hợp lệ của cùng
một bug** (mất dữ liệu do cập nhật một phần/rỗng), không phải lỗi thiết kế test. Ghi lại rõ ràng ở
đây để người đọc không nhầm là ngẫu nhiên.

## Không sửa expected để khớp SUT

Lượt nộp chính thức (`reports/newman/23127183_api-03-product-update_20260831-125812.json`) —
25/51 assertion đỏ, liệt kê đúng từng ID:

`TC-PRODUPD-002 · TC-PRODUPD-004 · TC-PRODUPD-006 · TC-PRODUPD-007 · TC-PRODUPD-008 ·
TC-PRODUPD-009 · TC-PRODUPD-010 · TC-PRODUPD-014 · TC-PRODUPD-015 · TC-PRODUPD-022 ·
TC-PRODUPD-024 · TC-PRODUPD-025 · TC-PRODUPD-027 · TC-PRODUPD-028 · TC-PRODUPD-029 ·
TC-PRODUPD-030 · TC-PRODUPD-031 · TC-PRODUPD-038 · TC-PRODUPD-039 · TC-PRODUPD-040 ·
TC-PRODUPD-042 · TC-PRODUPD-043 · TC-PRODUPD-045 · TC-PRODUPD-102 · TC-PRODUPD-105`

Đây là **API nhiều bug nhất trong 3 API** — gần như toàn bộ FR-15 (validate `name`/`price`/`category_id`)
và cả SEC-02/SEC-03 (auth) đều không được thực hiện. Mỗi dòng map tới đúng 1 bug trong
[`bug-report/bug-report.md`](../../bug-report/bug-report.md).

## Case KHÔNG chạy trong collection Postman

`TC-PRODUPD-101` (`generator/specs/api-03-product-update.mjs`, `excludeFromCollection: true`) — mô
tả chính xác payload làm sập SUT (PUT thiếu trường trên id chẵn, rồi GET). **Cố tình không đưa vào
collection chính** vì 1 request này sẽ làm chết SUT giữa lượt chạy, kéo theo mọi case sau đó đỏ vì
môi trường. Bằng chứng cho case này nằm riêng ở `bug-report/verify-bugs.sh` + log crash thật
(`ai-audit-report.md`).

## Bảng audit đầy đủ

Xem [`generated.md`](generated.md) — bản đúng sau audit (đã sửa trực tiếp trong
`generator/specs/api-03-product-update.mjs`, nguồn duy nhất).

---

Đã đọc và duyệt toàn bộ 45 test case do AI sinh (+ 5 case tự thêm ở `extended.md`), kèm việc **tự tay tái hiện bug sập server 2 lần trong quá trình audit** (lần đầu ngoài ý muốn, lần hai có chủ đích để xác nhận nguyên nhân chính xác — xem `sut.log` lúc đó) — Sinh Viên Phạm Vũ Ngọc Duy, 23127183, ngày 31/08/2026