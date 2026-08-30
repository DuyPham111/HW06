# API-01 — Pool A · `POST /api/login` · bước 3 (§6.3): case do **sinh viên** thêm

- **__ case** (đề đòi ≥5/API), cột `Nguồn` = **SV**, ID từ `TC-LOGIN-101`.
- Cách tìm case AI bỏ sót + gợi ý cụ thể: [`docs/05-EXTEND.md`](../../docs/05-EXTEND.md).

> **Đọc kỹ — ảnh hưởng cách chấm §6.3.** Đề đòi *"at least five test cases of **your own** that the
> AI missed"*. Nếu case dưới đây do **bạn chọn phạm vi** (kiểm gì, ở đâu, vì sao đáng kiểm) còn AI
> chỉ chấp bút thành dòng bảng thì ghi đúng như vậy vào đây. Nếu là case do AI sinh ở **lượt hai**
> thì phải đánh dấu `AI-2` và **không** tính vào §6.3 — dán nhãn `SV` cho chúng là misattribution,
> và §11 phạt đúng loại đó.

## Bảng test case

| TC ID | Kỹ thuật | Tham số & phân vùng | Request | Auth | Query / Body | Expected status | Expected body / schema | Căn cứ | Nguồn | Audit | Kết quả |
|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-LOGIN-101 | | | `POST /api/login` | | | | | | SV | | |

## Vì sao lượt AI đầu bỏ sót (§6.3)

> Dùng **đúng 3 nhóm lý do** đề đặt tên. Giải thích **cơ chế**, không viết chung chung.

| TC ID | AI bỏ sót gì | Nhóm lý do | Giải thích |
|---|---|---|---|
| TC-LOGIN-101 | | prompt quality / model limitations / characteristics of the API | |
