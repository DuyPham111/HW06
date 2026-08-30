# HW06 — API Testing on EShop

- **Sinh viên:** Phạm Vũ Ngọc Duy — **MSSV:** 23127183
- **Môn:** Kiểm thử phần mềm — **Bài:** HW06-AI API Testing
- **SUT:** EShop — https://github.com/ttbhanh/eshop-sut · spec: `api_specification.md`

> **Trạng thái: KHUNG — chưa có nội dung bài làm.**
> Bắt đầu từ [`docs/00-ROADMAP.md`](docs/00-ROADMAP.md), làm theo 12 phiên. Mỗi phiên = 1 commit.

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
| GitHub Issues | https://github.com/DuyPham111/HW06/issues |
| GitHub Actions | https://github.com/DuyPham111/HW06/actions |
| Video demo Agent Skill | _(§7 khuyến khích — điền nếu làm)_ |

---

## 1. Phạm vi — 3 API, mỗi pool một API (§5)

Kế thừa đúng 3 FR đã chọn ở HW02 (Domain Testing), HW04 (Automation) và HW05 (Performance).
Bằng chứng không trùng nhóm: [`docs/api-selection.md`](docs/api-selection.md).

| Mã | Pool | FR | API chính | Endpoint hỗ trợ | Prefix test case |
|---|---|---|---|---|---|
| **API-01** | A | FR-02 Đăng nhập & khóa tài khoản | `POST /api/login` | `POST /api/register`, `GET /api/users/me` | `TC-LOGIN-###` |
| **API-02** | B | FR-09 Coupon (+FR-08 checkout, FR-10 state machine) | `POST /api/apply-coupon` | `cart` · `checkout` · `coupon-usage` · `orders/:id` · `orders/:id/cancel` · `admin/orders/:id/status` | `TC-COUPON-###` |
| **API-03** | C | FR-15 Quản lý sản phẩm (admin) | `PUT /api/products/:id` | `POST` · `GET` · `DELETE /api/products/:id` | `TC-PRODUPD-###` |

Trọng tâm kiểm thử của từng API (**giả thuyết** rút từ mã nguồn SUT, chưa xác nhận):
API-01 → SEC-01 mật khẩu plaintext + ngưỡng khóa sai FR-02 · API-02 → thiếu auth (FR-09 C4) +
IDOR qua `user_id` trong body + công thức percent + state machine FR-10 ·
API-03 → thiếu auth/role (SEC-02/SEC-03) + không validate `price > 0` + ghi đè toàn bộ khi cập nhật một phần.

---

## 2. Test Summary Report (§14)

> Số liệu **sinh tự động** bằng `npm run summary` từ `reports/newman/*.json`.
> **Đừng gõ tay.** Ba nơi (README · Excel · `summary.md`) phải khớp nhau.

| Chỉ số | API-01 | API-02 | API-03 | **Tổng** |
|---|--:|--:|--:|--:|
| Test case AI sinh (§6.1) | | | | |
| Case sinh viên thêm (§6.3, đòi ≥5/API) | | | | |
| **Tổng test case** (§6.1 đòi ≥35/API) | | | | |
| Request đã thực thi | | | | |
| Assertion | | | | |
| Passed | | | | |
| **Failed** (= bắt được bug) | | | | |
| Bug xác nhận | | | | |

**Bug theo mức độ:** Critical __ · High __ · Medium __ · Low __ — [`bug-report/bug-report.md`](bug-report/bug-report.md).

**Hai lượt CI mẫu (§6):** XANH _(link)_ · ĐỎ _(link)_ — [`ci/ci-report.md`](ci/ci-report.md).

---

## 3. Bảng tự đánh giá (§15)

> Đuôi tên ZIP là **đúng ba chữ số** theo §14: `23127183_HW06_AI_API_<###>.zip`.
> Đọc lại checklist [`docs/16-DONG-GOI-CHECKLIST.md`](docs/16-DONG-GOI-CHECKLIST.md) rồi trừ đúng
> chỗ còn thiếu — **ghi rõ trừ vì sao**, đừng ghi 100 mặc định.

| No. | Tiêu chí | Điểm tối đa | **Điểm tự chấm** | Căn cứ |
|---|---|--:|--:|---|
| 1 | API-01 — full pipeline (generate + audit + extend + execute + bugs) | 30 | | |
| 2 | API-02 — full pipeline | 30 | | |
| 3 | API-03 — full pipeline | 30 | | |
| 4 | Agent Skills (AI-driven test generator) | 10 | | |
| | **Tổng** | **100** | | |

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
ci/                   ci-report.md (2 lượt mẫu) · expected-failures.json (baseline cổng CI)
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
