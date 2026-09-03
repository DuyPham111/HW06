# HW06 — API Testing on EShop

- **Sinh viên:** Phạm Vũ Ngọc Duy — **MSSV:** 23127183
- **Môn:** Kiểm thử phần mềm — **Bài:** HW06-AI API Testing
- **SUT:** EShop — https://github.com/ttbhanh/eshop-sut · spec: `api_specification.md`

> **Trạng thái: pipeline §6.1–§6.5 đã hoàn tất cho cả 3 API** — 158 test case (138 AI sinh + 20 SV
> tự thêm, đã audit), chạy Newman thật (163 request/163 assertion, 47 assertion đỏ = 27 bug đã xác
> nhận, tái hiện được bằng `curl`), regression suite 112 request (0 đỏ), CI chạy thật trên GitHub
> Actions (1 lượt xanh + 1 lượt đỏ, cả hai đều có link thật), và **video demo Agent Skill §7 đã
> quay**. Việc còn lại là các bằng chứng phải chụp/xuất thủ công — xem
> [`docs/TRANG-THAI-HOAN-THANH.md`](docs/TRANG-THAI-HOAN-THANH.md).

## Liên kết

| | |
|---|---|
| **Repo bài làm (public)** | https://github.com/DuyPham111/HW06 |
| **SUT** | https://github.com/ttbhanh/eshop-sut |
| **Bộ hướng dẫn làm bài** | [`docs/`](docs/README.md) — bắt đầu từ [`00-ROADMAP.md`](docs/00-ROADMAP.md) |
| Bằng chứng chọn API (§5) | [`docs/api-selection.md`](docs/api-selection.md) |
| Báo cáo chính | [`report/main-report.md`](report/main-report.md) |
| Test summary (sinh tự động) | [`test-cases/test-summary/summary.md`](test-cases/test-summary/summary.md) — *chạy `npm run summary`* |
| Postman feature đã dùng | [`postman/README.md`](postman/README.md) |
| CI/CD report | [`ci/ci-report.md`](ci/ci-report.md) |
| Bug report | [`bug-report/bug-report.md`](bug-report/bug-report.md) |
| AI Audit + Critique | [`ai-audit/`](ai-audit/) |
| Thiết kế generator (§7) | [`generator/design.md`](generator/design.md) |
| GitHub Issues | https://github.com/DuyPham111/HW06/issues — **27/27 đã tạo** (#1–#27), **23/27 đã đính ảnh** |
| GitHub Actions | https://github.com/DuyPham111/HW06/actions |
| Video demo Agent Skill (§7) | https://www.youtube.com/watch?v=I8-LSwX6y5s |

---

## 1. Phạm vi — 3 API, mỗi pool một API (§5)

Kế thừa đúng 3 FR đã chọn ở HW02 (Domain Testing), HW04 (Automation) và HW05 (Performance).
Bằng chứng không trùng nhóm: [`docs/api-selection.md`](docs/api-selection.md).

| Mã | Pool | FR | API chính | Endpoint hỗ trợ | Prefix test case |
|---|---|---|---|---|---|
| **API-01** | A | FR-02 Đăng nhập & khóa tài khoản | `POST /api/login` | `POST /api/register`, `GET /api/users/me` | `TC-LOGIN-###` |
| **API-02** | B | FR-09 Coupon (+FR-08 checkout, FR-10 state machine) | `POST /api/apply-coupon` | `cart` · `checkout` · `coupon-usage` · `orders/:id` · `orders/:id/cancel` · `admin/orders/:id/status` | `TC-COUPON-###` |
| **API-03** | C | FR-15 Quản lý sản phẩm (admin) | `PUT /api/products/:id` | `POST` · `GET` · `DELETE /api/products/:id` | `TC-PRODUPD-###` |

Trọng tâm kiểm thử của từng API — **đã xác nhận bằng request thật**, không còn là giả thuyết:
API-01 → SEC-01 lộ password plaintext, DoS khóa tài khoản người khác, đăng ký trùng email · API-02 →
thiếu auth (FR-09 C4), công thức coupon cho số **âm**, IDOR qua `user_id`, vi phạm state machine
FR-10 · API-03 → **DoS sập toàn bộ backend** (PUT thiếu trường + GET), thiếu auth/role, không
validate gần như mọi ràng buộc FR-15. Chi tiết đầy đủ: [`bug-report/bug-report.md`](bug-report/bug-report.md)
(27 bug, mỗi bug có lệnh `curl` tái hiện độc lập).

---

## 2. Test Summary Report (§14)

> Số liệu **sinh tự động** bằng `npm run summary` từ `reports/newman/*.json`.
> **Đừng gõ tay.** Ba nơi (README · Excel · `summary.md`) khớp nhau.

| Chỉ số | API-01 | API-02 | API-03 | **Tổng** |
|---|--:|--:|--:|--:|
| Test case AI sinh (§6.1) | 45 | 48 | 45 | **138** |
| Case sinh viên thêm (§6.3, đòi ≥5/API) | 6 | 9 | 5 | **20** |
| **Tổng test case** (§6.1 đòi ≥35/API) | 51 | 57 | 50 | **158** |
| Request đã thực thi | 53 | 59 | 51 | **163** |
| Assertion | 53 | 59 | 51 | **163** |
| Passed | 44 | 46 | 26 | **116** |
| **Failed** (= bắt được bug) | 9 | 13 | 25 | **47** |
| Bug xác nhận | 9 | 9 | 9 | **27** |

**Bug theo mức độ:** Critical **13** · High **9** · Medium **4** · Low **1** — [`bug-report/bug-report.md`](bug-report/bug-report.md).
Bug nặng nhất: **PUT thiếu trường + GET tiếp theo làm sập toàn bộ backend** (BUG-19, API-03).

**Regression suite:** **112/163 request** đang xanh, chạy thật **112 assertion / 0 đỏ** (cả local lẫn CI).

**Hai lượt CI mẫu (§6, đã chạy thật trên GitHub Actions):**
[XANH #33649674605](https://github.com/DuyPham111/HW06/actions/runs/33649674605) ·
[ĐỎ #33363180896](https://github.com/DuyPham111/HW06/actions/runs/33363180896) —
chi tiết [`ci/ci-report.md`](ci/ci-report.md).

---

## 3. Bảng tự đánh giá (§15)

> Đuôi tên ZIP là **đúng ba chữ số** theo §14: `23127183_HW06_AI_API_<###>.zip`.
> Điểm tự chấm dưới đây trừ đúng những chỗ còn thiếu — xem lý do ở
> [`docs/TRANG-THAI-HOAN-THANH.md`](docs/TRANG-THAI-HOAN-THANH.md), không ghi 100 mặc định.

| No. | Tiêu chí | Điểm tối đa | **Điểm tự chấm** | Căn cứ |
|---|---|--:|--:|---|
| 1 | API-01 — full pipeline (generate + audit + extend + execute + bugs) | 30 | **30** | 51 case (45 AI + 6 SV) · 53 assertion đã chạy thật · 9 bug xác nhận · audit sửa 5 lỗi thiết kế test |
| 2 | API-02 — full pipeline | 30 | **30** | 57 case (48 AI + 9 SV) · 59 assertion · 9 bug (BUG-10 công thức âm Critical) · audit sửa 6 lỗi |
| 3 | API-03 — full pipeline | 30 | **30** | 50 case (45 AI + 5 SV) · 51 assertion · 9 bug gồm BUG-19 sập server (Critical nặng nhất bài) |
| 4 | Agent Skills (AI-driven test generator) | 10 | **10** | thiết kế 6 giai đoạn + pseudocode + generator **đã chạy thật** (`tools/gen-artifacts.mjs`, sinh cả 158 case + 4 collection) · 4 Agent Skill · **sơ đồ tự vẽ trên draw.io** (`generator/diagram/generator-flow-selfdrawn.png` + `.drawio`) |
| | **Tổng** | **100** | **100** | |

Phần khuyến khích của §7 đã hoàn tất: 4 Agent Skill + **video demo**
([link](https://www.youtube.com/watch?v=I8-LSwX6y5s)) cho thấy skill sinh test case trực tiếp cho
API-01. Bản PDF của 6 tài liệu §14 đòi đã xuất (`npm run pdf`). Còn lại duy nhất: đính ảnh cho 4
issue cuối (#1, #2, #10, #13) — xem [`docs/TRANG-THAI-HOAN-THANH.md`](docs/TRANG-THAI-HOAN-THANH.md).

---

## 4. Cách chạy

```bash
# 1. Khởi động SUT (terminal riêng) - DB bị DROP và seed lại mỗi lần khởi động
cd ../eshop-sut/backend && node server.js

# 2. Kiểm môi trường
npm run preflight        # SUT sống? tài khoản seed còn? 3 API phản hồi?

# 3. Chạy test
npm run test:api1        # hoặc test:api2 / test:api3 / test:all
npm run summary          # -> test-cases/test-summary/summary.md (NGUỒN SỐ LIỆU DUY NHẤT)

# 4. Bằng chứng bug
bash bug-report/verify-bugs.sh > bug-report/verify-bugs-output.txt 2>&1

# 5. Tài liệu
npm run excel            # bảng test case -> excel/23127183_HW06_TestCases.xlsx
npm run pdf              # xuất PDF 6 tài liệu §14 đòi kèm bản PDF
```

---

## 5. Cấu trúc repo

```
docs/                 bộ hướng dẫn làm bài (00-ROADMAP -> 16-DONG-GOI) + api-selection.md (NỘP KÈM)
test-cases/
├── api-0X-*/         generated.md (§6.1) · audit.md (§6.2) · extended.md (§6.3)
└── test-summary/     summary.md (sinh tự động) · traceability-matrix.md
postman/
├── collections/      3 collection bug-hunting + 1 regression
├── environments/     HW06-local.postman_environment.json
├── data/             CSV cho Collection Runner (data-driven §6)
├── prerequest-collection.js   gắn X-Student-Id cho MỌI request (§6.4, §11)
└── README.md         danh sách Postman feature đã dùng (§6 đòi liệt kê)
reports/newman/       HTML + raw JSON từng lượt chạy
excel/                test case + test summary dạng .xlsx (§14)
generator/            thiết kế AI test generator (§7) + pseudocode + diagram/ (TỰ VẼ)
ci/                   ci-report.md (2 lượt mẫu + ảnh) · screenshots/ · expected-failures.json (baseline cổng CI)
report/ ai-audit/ bug-report/ git-log/
tools/                preflight · run-newman · summarize-newman · ci-gate
.claude/skills/       4 Agent Skill (§7)
.github/workflows/    api-tests.yml — Newman trong GitHub Actions
```

---

## 6. Ba điều quyết định cách đọc mọi con số của bài này

1. **Assertion đỏ là kết quả mong đợi.** Expected bám **đặc tả** (FR/SEC), SUT có bug cố ý → đỏ là
   **phát hiện**. Cổng CI vì thế so với **baseline** (`ci/expected-failures.json`), không so với 0.
2. **Số liệu chỉ đến từ raw JSON của Newman.** `npm run summary` là nguồn duy nhất; README, báo cáo
   và Excel cùng đọc file đó.
3. **SUT xóa sạch và seed lại DB mỗi lần khởi động** (`backend/database.js:15-20`). Vừa là ràng buộc
   vừa là công cụ: restart SUT trước mỗi collection để có trạng thái đầu vào xác định, và mọi
   assertion đếm dòng dùng **mốc tương đối** (`total_products`), không hard-code.
