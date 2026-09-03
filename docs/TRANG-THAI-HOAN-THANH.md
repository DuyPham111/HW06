# Trạng thái hoàn thành — HW06

> Thay cho 3 file theo dõi công việc dùng trong lúc làm (`CAN-LAM-PHIEN-1-2`, `CAN-LAM-TIEP-THEO`,
> `HUONG-DAN-VIEC-TU-LAM`). **Mọi việc đã xong**, file này giữ lại để đối chiếu nhanh khi chấm và
> khi vấn đáp (§13).

- **Sinh viên:** Phạm Vũ Ngọc Duy — 23127183
- **Tự chấm:** **100/100** (bảng đầy đủ ở [`README.md`](../README.md) §3)
- **Chốt bản cuối:** 03/09/2026

---

## 1. Đủ 13 mục §14 yêu cầu

| # | Mục §14 | Nằm ở đâu |
|---|---|---|
| 1 | Main report (Markdown **+ PDF**) | `report/main-report.md` · `.pdf` |
| 2 | Link GitHub repo public | https://github.com/DuyPham111/HW06 |
| 3 | Postman collection `.json` | `postman/collections/` — 5 file |
| 4 | Newman report **HTML** | `reports/newman/` |
| 5 | Danh sách Postman feature đã dùng | `postman/README.md` — 15 feature |
| 6 | CI/CD report + **2 lượt mẫu kèm ảnh và link** | `ci/ci-report.md` · `ci/screenshots/` |
| 7 | Excel test case + test summary | `excel/23127183_HW06_TestCases.xlsx` — 5 sheet |
| 8 | Sơ đồ generator **tự vẽ** + pseudocode | `generator/diagram/` · `generator/pseudocode.py` |
| 9 | *(tuỳ chọn)* OpenAPI | không làm — §14 ghi *"Optionally"* |
| 10 | Bug report + **ảnh bug trên GitHub Issues** | `bug-report/` · `bug-report/screenshots/` |
| 11 | AI Critique + AI Audit Report (Markdown **+ PDF**) | `ai-audit/` |
| 12 | Git commit log (text) | `git-log/commit-log.txt` |
| 13 | README có bảng tự chấm + test summary | `README.md` |

§17: *"Missing any required document results in 0 points"* — đã soát đủ 12/12 mục bắt buộc.

---

## 2. Ba bằng chứng §11 chống gian lận

| Đòi hỏi | Bằng chứng |
|---|---|
| Header `X-Student-Id` kèm **ảnh Postman Console** | `bug-report/screenshots/postman-console-gui.png` · pre-request script cấp collection · dòng log cũng nằm trong mục **Console Logs** của mọi báo cáo Newman HTML |
| Newman chạy trên **hostname thật** | mọi báo cáo trong `reports/newman/` đều ghi `http://localhost:3000` |
| Sơ đồ generator **tự vẽ** | `generator/diagram/generator-flow-selfdrawn.png` + file nguồn `.drawio` — vẽ trên draw.io ngày 31/08/2026 |

---

## 3. Số liệu chốt — mọi nơi trong bài đều khớp con số này

| Chỉ số | API-01 | API-02 | API-03 | **Tổng** |
|---|--:|--:|--:|--:|
| AI sinh | 45 | 48 | 45 | **138** |
| Sinh viên tự thêm | 6 | 9 | 5 | **20** |
| **Tổng test case** | 51 | 57 | 50 | **158** |
| Request / assertion | 53 | 59 | 51 | **163** |
| Assertion đỏ | 9 | 13 | 25 | **47** |
| Bug xác nhận | 9 | 9 | 9 | **27** |

- **Regression suite:** 112/163 request đang xanh — chạy thật **112 assertion / 0 đỏ**, khớp cả local lẫn CI.
- **Lượt Newman chính thức:** `*_20260903-001136` (cả 3 API chạy trong 11 giây từ **một lần khởi động
  SUT sạch**) và `regression_20260903-001056`. Các lượt chạy thử trước đó đã xoá để bài nộp chỉ còn
  một bộ bằng chứng duy nhất.
- Số liệu sinh tự động bằng `npm run summary`, **không gõ tay**.

---

## 4. Những việc phải làm bằng tay — đã xong

| Việc | Bằng chứng |
|---|---|
| Tự vẽ sơ đồ generator | `generator/diagram/` (`.png` + `.drawio`) |
| Đọc và **ký tên** 3 file `audit.md` | dòng ký ở cuối mỗi `test-cases/*/audit.md` |
| Tự tay chạy `verify-bugs.sh` tái hiện bug | `bug-report/verify-bugs-output.txt` |
| Tạo **27 GitHub Issue** + đính ảnh | https://github.com/DuyPham111/HW06/issues — **27/27 có ảnh** |
| Postman GUI: data-driven · Mock Server · Monitor | `postman/README.md` §2, §4 + 3 ảnh |
| Chụp ảnh 2 lượt CI và trang Issues | `ci/screenshots/` · `bug-report/screenshots/` |
| **Video demo Agent Skill (§7)** | https://www.youtube.com/watch?v=I8-LSwX6y5s |
| Xuất PDF 6 tài liệu | `npm run pdf` — 6/6 |

> Số issue **lệch** số BUG ở khoảng giữa: `BUG-19` tạo trước tiên nên nhận `#1`, đẩy `BUG-01`…`BUG-18`
> sang `#2`…`#19`; từ `BUG-20` trở đi trùng số. Cột **Issue** trong `bug-report.md` §2 ghi số thật.

---

## 5. Lệnh dựng lại toàn bộ

```bash
# 1. SUT (cửa sổ riêng) — DB bị DROP và seed lại mỗi lần khởi động
cd ../eshop-sut/backend && node server.js

# 2. Chạy test + tính lại số liệu
npm run preflight
npm run test:all
npm run summary          # -> test-cases/test-summary/summary.md

# 3. Tài liệu
npm run excel            # -> excel/*.xlsx
npm run pdf              # -> 6 file PDF
```

**Khởi động lại SUT trước mỗi lượt chạy chính thức.** DB được seed lại mỗi lần khởi động; chạy nối
tiếp trên DB bẩn sẽ làm số liệu lệch — lỗi này đã xảy ra thật 2 lần và được ghi ở
[`ai-audit/ai-audit-report.md`](../ai-audit/ai-audit-report.md) LOG-013.
