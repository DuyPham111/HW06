# API-01 — Pool A · `POST /api/login` · bước 2 (§6.2): audit

- 45 case AI sinh (`generated.md`), đã audit qua **5 phép soát** ở
  [`docs/04-AUDIT.md`](../../docs/04-AUDIT.md) §3, kết hợp **chạy thật bằng Newman** trên SUT
  (không chỉ đọc bằng mắt) — mọi case dưới đây đã được xác nhận hoặc sửa dựa trên **hành vi thật**,
  không suy đoán.
- Quy trình thật đã làm: sinh 45 case theo 5 bước → dựng collection Postman (`tools/gen-artifacts.mjs`)
  → chạy Newman trên SUT thật → **3 vòng sửa lỗi** dựa trên kết quả thật → lượt cuối cùng lưu ở
  `reports/newman/23127183_api-01-login_*.json`.

## Thống kê audit

| Nhãn | Số case |
|---|--:|
| VALID | 40 |
| INVALID (đã sửa) | 3 |
| INCOMPLETE (đã bổ sung) | 2 |

## Ghi chú audit — 3 case INVALID (expected sai) + 2 INCOMPLETE (thiếu bước)

**`TC-LOGIN-021`/`TC-LOGIN-022` — AI_MISTAKE có chủ đích, đã sửa qua thực nghiệm.** Lượt sinh case
đầu (mô phỏng AI đọc thẳng văn bản FR-02 "khóa từ 3 lần sai") ban đầu dự đoán: request thứ 3 (đăng
nhập **đúng** mật khẩu) phải **thành công (200)** vì mới có 2 lần sai thật sự. Chạy thật bằng `curl`
(xem `ai-audit/ai-audit-report.md` LOG-003) cho kết quả **403** — vì code kiểm `locked_until` ở
**đầu hàm**, trước khi so mật khẩu: lần sai thứ 2 đã **âm thầm đặt khóa** cho request kế tiếp, dù
response của chính lần sai thứ 2 đó vẫn là 401. Đây là lỗi tinh vi hơn "đếm sai +1 vs +2" đơn thuần —
AI hiểu đúng **số lần** cần để khóa (2 lần sai) nhưng không nhận ra **ranh giới quan sát được** nằm
ở request tiếp theo, bất kể request đó có phải là một lần sai nữa hay không. Đã **giữ nguyên**
`TC-LOGIN-022` với expected sai (200) làm case minh hoạ AI_MISTAKE — nó đỏ có chủ đích, xem
`extended.md` không cần vì đây không phải case SV, mà là bài học ghi trong chính `generated.md`.

**`TC-LOGIN-016` — expected ban đầu sai (401), sửa thành "không được 500".** Giả định ban đầu: gửi
`Content-Type: text/plain` thì `body-parser` bỏ qua, `req.body` thành `{}`, dẫn tới 401 (thiếu
email/password). Chạy `curl` thật cho thấy Express 5 để `req.body` là **`undefined`** (không phải
`{}`) khi không có parser khớp, và handler `const {email, password} = req.body` **crash 500** kèm
stack trace đầy đủ đường dẫn server. Expected đã sửa thành "không được 500 (không lộ stack trace)" —
đây chính là **BUG-05** trong bug-report.

**`TC-LOGIN-023a/023/023b/023c` — INCOMPLETE, thiếu bước `POST /api/register`.** Bản đầu chỉ có 1
request cho chuỗi "tài khoản khác — đủ 2 lần sai rồi kiểm 403", quên hẳn bước đăng ký tài khoản
trước — chạy Newman cho kết quả toàn 401 (vì tài khoản không hề tồn tại) chứ không phải chuỗi khóa
thật. Đã bổ sung bước `023a` (đăng ký) và tách rõ `023`/`023b`/`023c` thành 3 request tuần tự.
**`TC-LOGIN-024a/024/024b/024c`** (chuỗi reset bộ đếm) mắc đúng lỗi tương tự, đã sửa theo cùng cách.

**`TC-LOGIN-004`/`TC-LOGIN-014` — INCOMPLETE ẩn, phát hiện qua hiệu ứng dây chuyền.** Cả hai ban đầu
dùng tài khoản dùng chung `test@eshop.com` cho các phân vùng "thiếu password" / "password sai kiểu".
Vì hai request này **đều** chạm nhánh sai mật khẩu của server (`user.password === password` so với
`undefined`/mảng đều `false`), chúng vô tình cộng dồn bộ đếm khóa của **chính** tài khoản mà 10+ case
khác trong `generated.md` cần dùng để đăng nhập thành công — khiến cả loạt case sau đó đỏ **vì môi
trường**, không phải vì bug. Đã sửa: cả hai case giờ dùng tài khoản mồi riêng (`{{domain_email_04}}`,
`{{domain_email_14}}`), sinh động bằng `Date.now()`.

> Bài học chung của 5 case trên: **"chạy thật rồi sửa theo kết quả thật" (bước 6 của quy trình
> AI-driven test design) không phải bước tuỳ chọn.** Nếu chỉ audit bằng mắt (đọc bảng, không chạy),
> cả 3 lỗi INCOMPLETE ở trên sẽ lọt qua — chúng chỉ lộ ra khi chạy Newman thật và thấy case sau đỏ
> một cách vô lý.

## Không sửa expected để khớp SUT

Các case sau ĐỎ ở lượt nộp chính thức (`reports/newman/23127183_api-01-login_20260903-001136.json`)
— liệt kê đúng từng ID:

`TC-LOGIN-016 · TC-LOGIN-022 · TC-LOGIN-028 · TC-LOGIN-029 · TC-LOGIN-030 · TC-LOGIN-036 ·
TC-LOGIN-037 · TC-LOGIN-103 · TC-LOGIN-104`

9/53 assertion đỏ. Mỗi dòng map tới đúng 1 bug trong [`bug-report/bug-report.md`](../../bug-report/bug-report.md)
(trừ `TC-LOGIN-022`, là case minh hoạ AI_MISTAKE, không phải bug của SUT — xem ghi chú trên).
Sửa expected cho khớp hành vi sai của SUT là cách nhanh nhất để bộ test mất hết giá trị.

## Bảng audit đầy đủ

> Bảng dưới đây **kế thừa từ `generated.md`**, đã cập nhật 3 case INVALID và bổ sung các bước
> INCOMPLETE ngay trong `generator/specs/api-01-login.mjs` (nguồn duy nhất — xem file đó để có
> bảng 12 cột chính xác từng ký tự, tránh chép tay lệch). Cột `Kết quả` lấy từ lượt Newman chính thức
> ở trên.

Xem bảng đầy đủ tại [`generated.md`](generated.md) — **đã là bản đúng** sau audit (case INVALID đã
được sửa trực tiếp trong `generator/specs/api-01-login.mjs` rồi sinh lại, không lưu 2 bản riêng biệt
"trước/sau" vì đó chỉ tổ khiến 2 file lệch nhau theo thời gian).

---

Đã đọc và duyệt toàn bộ 45 test case do AI sinh (+ 6 case tự thêm ở `extended.md`), kèm 3 vòng sửa lỗi dựa trên kết quả Newman thật — Sinh Viên Phạm Vũ Ngọc Duy, 23127183, ngày 31/08/2026