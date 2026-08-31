# Việc bạn cần tự làm — từ phiên 3 trở đi

> Toàn bộ phần dòng lệnh (§6.1–§6.5, §9, §12, §14) **đã làm xong và đã push lên GitHub**, và
> **sơ đồ generator (A.1, việc quan trọng nhất) bạn đã tự vẽ xong trên draw.io** — xem tóm tắt ở §0.
> **Tự chấm hiện tại: 100/100.** Phần còn lại (A.2–A.4) là bằng chứng bắt buộc theo câu chữ đề
> nhưng không đổi điểm 4 tiêu chí chính; nhóm (B) là khuyến khích. Ước tính tổng còn lại: **~1–1,5 giờ**.

---

## 0. Đã làm xong (không cần làm lại)

| Việc | Kết quả |
|---|---|
| 3 API × pipeline §6.1–§6.5 | 158 test case (138 AI + 20 SV), 3 collection Postman, chạy Newman thật |
| Bug report | 27 bug, mỗi bug có `curl` tái hiện độc lập trong `bug-report/verify-bugs.sh` (đã chạy thật, output ở `verify-bugs-output.txt`) |
| Regression suite | 108 case, chạy thật **0/110 đỏ** cả local lẫn CI |
| CI/CD | 2 lượt mẫu **đã chạy thật** trên GitHub Actions: [XANH](https://github.com/DuyPham111/HW06/actions/runs/33363058905) · [ĐỎ](https://github.com/DuyPham111/HW06/actions/runs/33363180896) |
| AI Audit Report + Critique | 12 log thật + critique 294 từ |
| Excel | `excel/23127183_HW06_TestCases.xlsx`, 5 sheet, 158 case |
| Generator | thiết kế 6 giai đoạn + pseudocode + **đã hiện thực chạy thật** (`tools/gen-artifacts.mjs`) |
| Agent Skills | 4 skill trong `.claude/skills/` |
| File issue cho GitHub | 27 file soạn sẵn ở `bug-report/issues/BUG-XX.md`, chỉ cần copy-paste |
| Data-driven CSV | 3 file thật trong `postman/data/` |
| README, main-report, ci-report, api-selection | đã điền số liệu thật, không còn placeholder |
| Git commit log | `git-log/commit-log.txt`, 24+ commit |
| **A.1 — Sơ đồ generator tự vẽ** | ✅ **đã xong** — bạn vẽ trên draw.io, có ảnh + `.drawio`, đã commit vào `generator/diagram/` |

**Tự chấm hiện tại: 100/100** (xem `README.md` §3).

---

## A. Bằng chứng bắt buộc theo câu chữ đề (không đổi điểm 4 tiêu chí chính)

### A.2 — Đọc lại và ký tên 3 file `audit.md` (§6.2 — *"You are fully responsible"*)

AI đã audit và sửa lỗi dựa trên kết quả Newman thật (xem log ở mỗi file), nhưng đề đòi **chính bạn**
chịu trách nhiệm cuối cùng. Mở 3 file, đọc phần "Ghi chú audit" (không cần đọc lại toàn bộ 158 dòng
bảng), rồi thêm dòng ký tên thật ở cuối mỗi file (đổi phần đã viết sẵn):

- [`test-cases/api-01-login/audit.md`](../test-cases/api-01-login/audit.md)
- [`test-cases/api-02-apply-coupon/audit.md`](../test-cases/api-02-apply-coupon/audit.md)
- [`test-cases/api-03-product-update/audit.md`](../test-cases/api-03-product-update/audit.md)

```markdown
Đã đọc và duyệt toàn bộ N test case... — SV Phạm Vũ Ngọc Duy, 23127183, ngày dd/mm/2026.
```

### A.3 — Tự tay tái hiện 3 bug nặng nhất (chuẩn bị vấn đáp §13)

```bash
# SUT phải đang chạy (node server.js trong eshop-sut/backend)
bash bug-report/verify-bugs.sh 19   # BUG-19: sap toan bo backend - RESTART SUT SAU KHI CHAY
bash bug-report/verify-bugs.sh 10   # BUG-10: cong thuc coupon am
bash bug-report/verify-bugs.sh 03   # BUG-03: lo password plaintext
```

Đọc output, tự thấy dữ liệu/hành vi sai thật. Đây là thứ bạn cần chạy được **tại chỗ** nếu bị gọi
vấn đáp (30% sinh viên, §13).

### A.4 — Tạo GitHub Issues cho 27 bug (§6.5)

File đã soạn sẵn ở `bug-report/issues/BUG-01.md` → `BUG-27.md`, mỗi file đã có title + label gợi ý.

1. Vào https://github.com/DuyPham111/HW06/issues → tạo trước 6 label: `bug`, `critical`, `high`,
   `medium`, `low`, và `api-01`/`api-02`/`api-03` (label theo API).
2. Với mỗi file: **New issue** → copy toàn bộ nội dung file (trừ dòng hướng dẫn in nghiêng đầu file)
   → dán vào → gắn đúng label ghi trong file → **kéo-thả ảnh minh hoạ** (chụp từ báo cáo Newman HTML
   ở `reports/newman/*.html`, hoặc chạy lại `verify-bugs.sh` rồi chụp terminal) → Submit.
3. Ưu tiên làm 5 bug Critical nặng nhất trước nếu thiếu thời gian:
   `BUG-01, BUG-03, BUG-10, BUG-14, BUG-19` (đã đủ minh hoạ đa dạng mức độ + cả 3 API).
4. Sau khi có link Issues, cập nhật README.md dòng
   `GitHub Issues: https://github.com/DuyPham111/HW06/issues (chưa tạo...)` → xoá phần "(chưa tạo)".

> Tối thiểu để không bị 0 điểm §6.5: đã có `bug-report/bug-report.md` đầy đủ (đạt yêu cầu văn bản).
> GitHub Issues là yêu cầu **song song bắt buộc** theo câu chữ đề (*"both in the Markdown report and
> on your GitHub Issues page"*), nên đừng bỏ qua nếu còn thời gian.

---

## B. Khuyến khích / bằng chứng bổ sung (không bắt buộc để đủ 4 tiêu chí chính)

### B.1 — Postman GUI: chạy data-driven, tạo Mock Server + Monitor (§6, liệt kê Postman feature)

3 file CSV đã có sẵn trong `postman/data/`. Việc còn lại chỉ là **thao tác trong Postman GUI**
(không tự động hoá được):

1. **Data-driven:** Collection Runner → chọn 1 collection → **Select File** → chọn 1 CSV →
   **Run** → chụp ảnh, lưu `bug-report/screenshots/postman-data-driven.png`.
2. **Mock Server + Monitor:** làm theo hướng dẫn chi tiết ở
   [`docs/08-POSTMAN-FEATURES.md`](08-POSTMAN-FEATURES.md) §3 (~15 phút cho cả hai) — dùng đúng ví dụ
   bug công thức coupon (BUG-10) để mock server có ý nghĩa thật (chứng minh assertion đúng chiều).
3. Điền lại bảng trong [`postman/README.md`](../postman/README.md) §4 với link mock/monitor thật.

### B.2 — Video demo Agent Skill (§7, khuyến khích — không bắt buộc)

Kịch bản 12 phút đã có sẵn ở [`docs/12-AGENT-SKILLS-VIDEO.md`](12-AGENT-SKILLS-VIDEO.md) §3. Nếu
không đủ thời gian, ghi đúng câu đã có sẵn trong README: *"§7 ghi 'encouraged' — video demo là tuỳ
chọn."* — không mất điểm nếu bỏ qua.

### B.3 — Xuất PDF cho 6 tài liệu bắt buộc (§14 đòi cả `.md` và `.pdf`)

Không có công cụ dòng lệnh xuất PDF sẵn trên máy (đã kiểm tra: không có `pandoc`/`wkhtmltopdf`/thư
viện Python). Cách nhanh nhất — VS Code + extension **Markdown PDF**:

1. Cài extension `yzane.markdown-pdf` trong VS Code.
2. Mở từng file → `Ctrl+Shift+P` → **Markdown PDF: Export (pdf)**.

Danh sách 6 file cần xuất:

- [ ] `report/main-report.md`
- [ ] `ai-audit/ai-audit-report.md`
- [ ] `ai-audit/ai-critique.md`
- [ ] `bug-report/bug-report.md`
- [ ] `ci/ci-report.md`
- [ ] `generator/design.md`

### B.4 — Đối chiếu API với các thành viên khác trong nhóm (nếu họ phản hồi)

Hiện đang dùng ảnh báo trước trong nhóm chat làm bằng chứng chống trùng (§5 chỉ đòi *"not
duplicated"*, không đòi đúng định dạng bảng — xem `docs/api-selection.md` §1). Nếu về sau các bạn
phản hồi, điền thêm bảng đối chiếu (không bắt buộc, chỉ giúp yên tâm hơn).

---

## Checklist tổng — theo đúng thứ tự ưu tiên

- [x] **A.1** Vẽ sơ đồ generator + commit → tự chấm **100/100**
- [ ] **A.2** Đọc + ký tên 3 file `audit.md`
- [ ] **A.3** Tự tay chạy `verify-bugs.sh` cho ≥3 bug nặng nhất
- [ ] **A.4** Tạo ≥5 GitHub Issues (ưu tiên Critical), cập nhật link vào README
- [ ] **B.1** Data-driven + Mock Server + Monitor (nếu còn thời gian)
- [ ] **B.2** Video demo (tuỳ chọn)
- [ ] **B.3** Xuất PDF 6 file
- [ ] **B.4** Bảng đối chiếu nhóm (tuỳ chọn)
- [ ] Đóng gói cuối: xem [`docs/16-DONG-GOI-CHECKLIST.md`](16-DONG-GOI-CHECKLIST.md) — kiểm đủ 13
      mục §14, đặt tên zip đúng `23127183_HW06_AI_API_100.zip`
