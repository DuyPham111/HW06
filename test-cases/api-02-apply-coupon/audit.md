# API-02 — Pool B · `POST /api/apply-coupon` · bước 2 (§6.2): audit của sinh viên

- __ case AI sinh, đã dán nhãn **VALID / INVALID / INCOMPLETE** kèm lý do.
- Quy trình 5 phép soát: [`docs/04-AUDIT.md`](../../docs/04-AUDIT.md) §3.
- **Từ đây trở đi file này là bản ĐÚNG.** Case INVALID/INCOMPLETE đã được sửa ngay trong bảng dưới.

## Thống kê audit

| Nhãn | Số case |
|---|--:|
| VALID | |
| INVALID (đã sửa) | |
| INCOMPLETE (đã bổ sung) | |

## Ghi chú audit

> Mỗi case INVALID/INCOMPLETE một đoạn: sai/thiếu gì · sửa thành gì · **vì sao**.
> Đây là phần được chấm, không phải bảng.

**Sửa __ case (`TC-COUPON-0xx`).** _(điền)_

**Không sửa expected để khớp SUT.** Các case sau ĐỎ ở lượt nộp — liệt kê đúng từng ID, không gộp khoảng:
`_(điền sau khi chạy Newman, lấy từ test-cases/test-summary/summary.md)_`.
Sửa expected cho khớp hành vi sai của SUT là cách nhanh nhất để bộ test mất hết giá trị. Đỏ ở đây là
**phát hiện**, không phải lỗi test.

## Phân vùng còn thiếu — bổ sung ở `extended.md`

| Phân vùng chưa có case | Ghi chú |
|---|---|
| | |

## Bảng audit

| TC ID | Kỹ thuật | Tham số & phân vùng | Request | Auth | Query / Body | Expected status | Expected body / schema | Căn cứ | Nguồn | Audit | Kết quả |
|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-COUPON-001 | | | `POST /api/apply-coupon` | | | | | | AI | VALID | |

---

Đã đọc và duyệt toàn bộ __ test case. Sửa __ case (danh sách ở mục "Ghi chú audit").
— SV Phạm Vũ Ngọc Duy, 23127183, ngày __/__/2026.
