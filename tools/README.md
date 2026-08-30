# `tools/` — script hỗ trợ

| Script | Việc | Gọi bằng |
|---|---|---|
| `preflight.mjs` | Kiểm SUT sống · tài khoản seed còn dùng được · 4 coupon seed còn · 3 API phản hồi. Chạy **trước mỗi lượt Newman** | `npm run preflight` |
| `run-newman.sh` | Chạy 1 hoặc cả 3 collection, tự gọi preflight, xuất HTML + JSON có timestamp | `npm run test:api1` / `test:all` |
| `summarize-newman.mjs` | Đọc `reports/newman/*.json` → sinh `test-cases/test-summary/summary.md`. **Nguồn số liệu duy nhất** | `npm run summary` |
| `ci-gate.mjs` | Cổng CI: `--strict` (0 đỏ, cho regression suite) hoặc so `ci/expected-failures.json` | dùng trong workflow |

## Script bạn cần tự viết (có hướng dẫn + prompt sẵn)

| Script | Việc | Hướng dẫn |
|---|---|---|
| `tc2xlsx.py` | Bảng test case Markdown → Excel 5 sheet (§14) | [`docs/14-EXCEL-TEST-CASES.md`](../docs/14-EXCEL-TEST-CASES.md) §3 |
| `bug-report/verify-bugs.sh` | Tái hiện từng bug bằng `curl`, độc lập với Postman (§6.5, §13) | [`docs/10-BUG-REPORT-GITHUB-ISSUES.md`](../docs/10-BUG-REPORT-GITHUB-ISSUES.md) §3 |

## Nguyên tắc

**Mọi con số công bố phải tính lại được từ raw JSON.** Đó là lý do `summarize-newman.mjs` tồn tại:
README, `main-report.md` và Excel đều copy từ `summary.md`, không nơi nào gõ tay. Nếu hai chỗ lệch
nhau thì người chấm sẽ không tin chỗ nào cả.
