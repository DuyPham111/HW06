# 00 — Roadmap HW06: từ đề bài đến file nộp

> Sinh viên: **Phạm Vũ Ngọc Duy — 23127183** · SUT: EShop (https://github.com/ttbhanh/eshop-sut)
> Repo bài làm: https://github.com/DuyPham111/HW06
>
> **Đọc file này trước tiên.** Mỗi mục dưới trỏ tới một file hướng dẫn chi tiết trong `docs/`.
> Nguyên tắc chung giữ nguyên công thức đã được 100đ ở HW02/HW04/HW05:
> **AI làm từng bước — người review từng bước — ghi log ngay lúc làm — mỗi bước 1 commit.**

---

## 1. Bài này khác HW02/HW04/HW05 ở chỗ nào

| | HW02 / HW04 | HW05 | **HW06** |
|---|---|---|---|
| Đối tượng test | UI web/mobile | backend `:3000`, đo **hiệu năng** | backend `:3000`, đo **đúng/sai từng API** |
| Kỹ thuật | Domain / BVA / Automation | Load · Stress · Spike · Soak | **Domain partition · State transition · Security SEC-01..07 · Schema validation** |
| Công cụ | Playwright / thủ công | JMeter | **Postman + Newman** |
| Bằng chứng | ảnh bug + HTML report | raw `.jtl` + dashboard | **raw JSON Newman + HTML report + ảnh Postman Console** |
| Cái dễ mất điểm nhất | thiếu TC | bịa số | **1 prompt gộp** (§2 cấm đích danh) và **sơ đồ generator do AI vẽ** (§11 cấm) |

**Ba điều quyết định điểm của HW06:**

1. **§2 cấm prompt gộp.** Nguyên văn: *"this does not mean issuing a single, generic prompt such as
   'generate all the API test cases from the spec and run them'"*. Người chấm nhìn vào
   `ai-audit/ai-audit-report.md`: nếu chỉ có 1–2 lượt hỏi AI cho cả trăm test case thì mất điểm dù
   test chạy đẹp. Guide [03](03-GENERATE-AI.md) chia thành **5 bước = 5 lượt hỏi riêng cho mỗi API**.
2. **§11 chống gian.** Ba thứ TA sẽ soi: ảnh **Postman Console** in `X-Student-Id`, hostname trong
   output Newman phải là `localhost`/`127.0.0.1`, và **sơ đồ generator phải do bạn tự vẽ**.
3. **§17: thiếu bất kỳ tài liệu bắt buộc nào = 0 điểm.** Checklist ở [16](16-DONG-GOI-CHECKLIST.md).

---

## 2. Phạm vi đã chốt (§5) — kế thừa đúng lựa chọn của HW02/HW04/HW05

§5 đòi **3 API, mỗi API thuộc một pool A / B / C** (Pool D không dùng). HW02 bạn chọn FR-02, FR-09,
FR-15; HW04 automation và HW05 performance đều giữ nguyên 3 FR đó. HW06 **giữ tiếp** — bạn đã biết
rõ 3 vùng nghiệp vụ này nên không phải học lại SUT, và bảng "bug đã biết từ HW02" thành đầu vào miễn
phí cho phần Extend (§6.3).

| Mã | Pool | FR | API chính | Endpoint hỗ trợ (setup / verify / cleanup) | Prefix TC |
|---|---|---|---|---|---|
| **API-01** | A | FR-02 Đăng nhập & khóa tài khoản | `POST /api/login` | `POST /api/register`, `GET /api/users/me` | `TC-LOGIN-###` |
| **API-02** | B | FR-09 Coupon (+ FR-08 checkout, FR-10 state machine) | `POST /api/apply-coupon` | `POST /api/login`, `POST /api/cart`, `POST /api/checkout`, `POST /api/coupon-usage`, `GET /api/orders/:id`, `PUT /api/orders/:id/cancel`, `PUT /api/admin/orders/:id/status` | `TC-COUPON-###` |
| **API-03** | C | FR-15 Quản lý sản phẩm (admin) | `PUT /api/products/:id` | `POST /api/products`, `GET /api/products/:id`, `DELETE /api/products/:id` | `TC-PRODUPD-###` |

**Vì sao FR-10 (state machine) nằm ở API-02 chứ không phải API-03:** §6 đòi bộ test phủ
*state transitions (FR-10: pending → confirmed → shipping → delivered, plus cancelation rules)*.
Coupon là bước ngay trước checkout, nên chuỗi *apply-coupon → checkout → order `pending` → đổi
trạng thái → hủy* là **một luồng nghiệp vụ liền mạch**, không phải ghép cho đủ chỉ tiêu. Pool B
trong đề cũng liệt kê FR-08/FR-10 là ví dụ hợp lệ.

→ Chi tiết + bằng chứng không trùng thành viên nhóm: [`api-selection.md`](api-selection.md) và [02](02-CHON-API.md).

**Bài tham khảo `tham_khao/HW06-Api-Testing-main` chọn bộ khác** (`GET /api/products?search`,
`POST /api/cart`, `PUT /api/products/:id`). Bộ của bạn chỉ trùng **1/3** và người đó khác nhóm.
Đừng bắt chước sang bộ của họ.

---

## 3. Bản đồ: yêu cầu của đề → thứ phải nộp → guide

| Đề | Yêu cầu định lượng | Nộp bằng cái gì | Guide |
|---|---|---|---|
| §5 | 3 API, mỗi pool 1, không trùng trong nhóm | `docs/api-selection.md` | [02](02-CHON-API.md) |
| §6.1 | **≥35 test case/API**, phủ domain · state · security · schema, sinh **từng bước** | `test-cases/api-0X-*/generated.md` | [03](03-GENERATE-AI.md) |
| §6.2 | Dán nhãn **VALID / INVALID / INCOMPLETE** + lý do, sửa case sai | `test-cases/api-0X-*/audit.md` | [04](04-AUDIT.md) |
| §6.3 | **≥5 case tự thêm/API** + giải thích **vì sao AI bỏ sót** | `test-cases/api-0X-*/extended.md` | [05](05-EXTEND.md) |
| §6.4 | Chạy Postman + Newman, **mọi request có `X-Student-Id`** | `postman/collections/*.json` | [06](06-POSTMAN-COLLECTION.md) |
| §6.4 | Báo cáo Newman HTML + raw JSON | `reports/newman/` | [07](07-CHAY-NEWMAN-BANG-CHUNG.md) |
| §11 | Ảnh **Postman Console** in `X-Student-Id` | `bug-report/screenshots/` | [07](07-CHAY-NEWMAN-BANG-CHUNG.md) §4 |
| §6 | Liệt kê **Postman feature đã dùng** (workspace, env, data-driven, monitor, mock…) | `postman/README.md` | [08](08-POSTMAN-FEATURES.md) |
| §6 | **CI/CD** + **2 lượt mẫu** (1 xanh hết, 1 có fail) kèm ảnh + link | `.github/workflows/` + `ci/ci-report.md` | [09](09-CI-CD.md) |
| §6.5 | Bug report trong Markdown **và** trên GitHub Issues, mỗi issue có ảnh | `bug-report/` + Issues | [10](10-BUG-REPORT-GITHUB-ISSUES.md) |
| §7 | **AI test generator**: sơ đồ **TỰ VẼ** + pseudocode | `generator/` | [11](11-GENERATOR-DESIGN.md) |
| §7 | (khuyến khích) Agent Skill + video demo YouTube | `.claude/skills/` | [12](12-AGENT-SKILLS-VIDEO.md) |
| §9 | **AI Audit Report**: tool, ngày giờ, prompt nguyên văn, output | `ai-audit/ai-audit-report.md` + PDF | [13](13-AI-AUDIT-CRITIQUE.md) |
| §10 | **AI Critique 200–300 từ** | `ai-audit/ai-critique.md` + PDF | [13](13-AI-AUDIT-CRITIQUE.md) |
| §14 | **Excel** test case + test summary | `excel/23127183_HW06_TestCases.xlsx` | [14](14-EXCEL-TEST-CASES.md) |
| §12 | **1 bước = 1 commit**, nộp git log dạng text | `git-log/commit-log.txt` | [15](15-GIT-COMMIT-LOG.md) |
| §14 | README có **bảng tự chấm + test summary**, zip đúng tên | `README.md` | [16](16-DONG-GOI-CHECKLIST.md) |
| §14 | (tuỳ chọn) spec chuyển sang **OpenAPI** `.yaml`, có audit | `docs/openapi.yaml` | [14](14-EXCEL-TEST-CASES.md) §4 |

---

## 4. Thứ tự làm — 12 phiên, mỗi phiên 1–2 tiếng

Đừng làm nhảy cóc. Mỗi phiên kết thúc bằng **1 commit** và **1 mục trong `ai-audit/ai-audit-report.md`**.

| Phiên | Việc | Guide | Commit mẫu |
|---|---|---|---|
| 1 | Dựng môi trường, chạy SUT, `npm run preflight` xanh | [01](01-SETUP.md) | `chore: setup moi truong HW06 + preflight` |
| 2 | Chốt 3 API + viết `docs/api-selection.md` | [02](02-CHON-API.md) | `docs: chot 3 API va ly do chon (§5)` |
| 3 | **API-01** generate (5 bước AI) | [03](03-GENERATE-AI.md) | `test(api-01): sinh test case bang AI theo 5 buoc (§6.1)` |
| 4 | **API-01** audit + extend | [04](04-AUDIT.md) [05](05-EXTEND.md) | `test(api-01): audit VALID/INVALID/INCOMPLETE (§6.2)` |
| 5 | **API-02** generate + audit + extend | [03](03-GENERATE-AI.md)–[05](05-EXTEND.md) | `test(api-02): pipeline §6.1-6.3` |
| 6 | **API-03** generate + audit + extend | [03](03-GENERATE-AI.md)–[05](05-EXTEND.md) | `test(api-03): pipeline §6.1-6.3` |
| 7 | Dựng 3 collection Postman + pre-request `X-Student-Id` | [06](06-POSTMAN-COLLECTION.md) | `test: 3 collection Postman + prerequest X-Student-Id` |
| 8 | Chạy Newman, thu HTML/JSON, chụp Console | [07](07-CHAY-NEWMAN-BANG-CHUNG.md) | `test: chay Newman va thu bang chung (§6.4, §11)` |
| 9 | Bug report + tạo GitHub Issues kèm ảnh | [10](10-BUG-REPORT-GITHUB-ISSUES.md) | `docs: bug report + GitHub Issues (§6.5)` |
| 10 | CI/CD: workflow + 2 lượt mẫu xanh/đỏ | [09](09-CI-CD.md) | `ci: pipeline Newman + 2 luot mau (§6)` |
| 11 | Generator: **tự vẽ sơ đồ** + pseudocode + 4 Agent Skill | [11](11-GENERATOR-DESIGN.md) [12](12-AGENT-SKILLS-VIDEO.md) | `feat(generator): thiet ke + so do tu ve (§7)` |
| 12 | Main report · AI audit · critique · Excel · PDF · zip | [13](13-AI-AUDIT-CRITIQUE.md) [14](14-EXCEL-TEST-CASES.md) [16](16-DONG-GOI-CHECKLIST.md) | `docs: bao cao chinh + AI audit + dong goi` |

> **Phiên 1 và 2 đừng bỏ.** Chạy `preflight` xanh trước khi viết một test case nào — nếu tài khoản
> seed bị khóa từ lượt trước thì cả bộ test đỏ vì môi trường chứ không phải vì bug, và bạn sẽ mất
> nửa buổi để truy nguyên.

---

## 5. Ba đặc điểm của SUT phải nhớ — chúng quyết định cách viết assertion

Đã đối chiếu trực tiếp với mã nguồn (`eshop-sut/backend/`). Ghi ở đây để không phải đọc lại:

1. **DB bị xóa và seed lại MỖI LẦN khởi động backend** (`database.js:15-20`, `DROP TABLE IF EXISTS …`).
   → Vừa là ràng buộc vừa là công cụ: muốn trạng thái đầu vào xác định thì **restart SUT trước mỗi
   collection**. Cũng vì thế mọi assertion đếm dòng phải dùng **mốc tương đối** (lưu `total_products`
   ở bước setup rồi so), không hard-code `5`.

2. **Tài khoản và dữ liệu seed cố định** (`database.js:91-111`):

   | Loại | Giá trị |
   |---|---|
   | Admin | `admin@eshop.com` / `Admin123!` — `role = 'admin'` |
   | User | `test@eshop.com` / `Test1234!` — `role = 'user'` |
   | Sản phẩm | 5 sản phẩm, `id` 1–5 |
   | Coupon | `SAVE10` percent 10, min 300.000, hạn 2099 · `BIGBUY` fixed 50.000, min 500.000 · `VIP100` fixed 100.000, min 300.000, **max 2 lượt** · `EXPIRED` percent 20, min 100.000, **hạn 2020-01-01** |

3. **SUT có bug CỐ Ý.** Expected của bạn phải bám **đặc tả** (`api_specification.md` + FR/SEC trong
   `README.md` của SUT), **không** bám hành vi hiện tại. Vì thế **assertion đỏ là kết quả mong đợi** —
   đỏ = phát hiện được bug. Sửa expected cho khớp SUT là cách nhanh nhất để bộ test mất hết giá trị.

---

## 6. Luật vàng khi làm việc với AI ở bài này

| Luật | Vì sao |
|---|---|
| **Một bước = một lượt hỏi = một mục audit log** | §2 cấm prompt gộp; §9 đòi log đủ. Ghi log **ngay lúc làm**, đừng dựng lại sau |
| **Không bao giờ để AI bịa `expected`** | Spec im lặng chỗ nào thì chỉ khẳng định phần spec bảo đảm (status + schema). Một expected không căn cứ sinh ra **bug giả** — lỗi tệ nhất |
| **Mọi bug phải tái hiện được bằng request thật** | "Đọc code thấy có vẻ sai" mới là **giả thuyết**. Chưa chạy curl/Newman ra kết quả thì chưa được viết vào bug report |
| **Không sửa expected cho khớp SUT** | Xem §5.3 ở trên |
| **Số liệu chỉ đến từ `npm run summary`** | Đọc raw JSON của Newman. README và báo cáo cùng copy từ đó, không gõ tay |
| **Sơ đồ generator tự vẽ** | §11 cấm sơ đồ AI. Xem [11](11-GENERATOR-DESIGN.md) §4 |

---

## 7. Việc bạn **phải tự làm**, AI không thay được

Liệt kê sớm để bạn xếp lịch, chi tiết ở [`HUONG-DAN-VIEC-TU-LAM.md`](HUONG-DAN-VIEC-TU-LAM.md):

Đã xong: ảnh Postman Console (§11) · sơ đồ tự vẽ (§7, §11) · 2 lượt CI mẫu đã chạy thật (§6) ·
27 GitHub Issues (§6.5) · ký nhận 3 file `audit.md` (§6.2) · video demo §7
([link](https://www.youtube.com/watch?v=I8-LSwX6y5s)).

Còn lại — xem [`CAN-LAM-TIEP-THEO.md`](CAN-LAM-TIEP-THEO.md):

- Đính ảnh vào từng GitHub Issue (§6.5, §11).
- Ảnh 2 lượt CI + trang GitHub Issues: ✅ đã chèn vào `ci/ci-report.md` và `bug-report/bug-report.md`.
- PDF 6 tài liệu: ✅ `npm run pdf` (tự động bằng python-markdown + Edge headless).
