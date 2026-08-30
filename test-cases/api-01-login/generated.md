# API-01 — Pool A · `POST /api/login` · bước 1 (§6.1): test case do AI sinh

- **Pool A · FR-02 Đăng nhập & khóa tài khoản** · prefix `TC-LOGIN-###` · **__ test case** *(đề đòi ≥35/API)*
- Sinh theo quy trình **5 bước riêng** của [`docs/03-GENERATE-AI.md`](../../docs/03-GENERATE-AI.md);
  mỗi bước một lượt AI riêng, mỗi bước một mục trong [`ai-audit/ai-audit-report.md`](../../ai-audit/ai-audit-report.md).
- **File này là bằng chứng lượt AI đầu tiên — sau khi audit thì ĐỪNG sửa nữa.** Bản đúng nằm ở `audit.md`.

## Phân bố theo kỹ thuật

| Kỹ thuật | Số case |
|---|--:|
| Domain | |
| State | |
| Security | |
| Schema | |
| **Tổng** | |

## Bảng test case

> Cột `Audit` và `Kết quả` để **trống** ở bước này.

| TC ID | Kỹ thuật | Tham số & phân vùng | Request | Auth | Query / Body | Expected status | Expected body / schema | Căn cứ | Nguồn | Audit | Kết quả |
|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-LOGIN-001 | | | `POST /api/login` | | | | | | AI | | |
