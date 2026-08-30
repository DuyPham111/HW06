# Sơ đồ generator — **BẮT BUỘC TỰ VẼ** (§7, §11)

> §11 (Anti-AI-Cheat): *"The AI test generator diagram, which must be **self-drawn** — designed by
> you, not generated directly by an AI."*
>
> Sơ đồ do AI sinh (Mermaid do AI viết, ảnh do AI vẽ) là **vi phạm**. Đây là phần dễ mất điểm nhất của §7.

---

## File phải có trong thư mục này

| File | Bắt buộc | Ghi chú |
|---|---|---|
| `generator-flow-selfdrawn.png` | ✅ | ảnh sơ đồ, rộng ≥1600px để chữ đọc được |
| `generator-flow.drawio` (hoặc link Lucidchart) | ✅ | **file nguồn — bằng chứng bạn tự vẽ** |

---

## Bản vẽ tay: cần vẽ gì (~40 phút)

Mở https://app.diagrams.net → Create New Diagram → Blank.

### Hàng 0 — ba nguồn đầu vào

Ba hộp cạnh nhau, **ba mũi tên cùng chụm vào GĐ1**:

```
[ api_specification.md ]   [ FR/SEC trong README.md ]   [ backend/server.js ]
```

> Đây là điểm nhấn của thiết kế — đừng vẽ chỉ 1 nguồn. Ghi chú cạnh mũi tên thứ ba:
> *"chỉ để BIẾT CHỖ ĐÁNG CHỌC — expected KHÔNG bám code"*.

### Sáu hộp giai đoạn, đánh số 1–6

| Hộp | Nhãn |
|---|---|
| 1 | Parse 3 nguồn → tham số · **chỗ spec im lặng** · hành vi thật |
| 2 | Suy ràng buộc → luật + câu hỏi mở |
| 3 | Sinh case **4 nhóm — 4 lượt AI riêng** |
| 4 | Khử trùng + xếp thứ tự (chuỗi state) |
| 5 | Xuất artefact |
| 6 | Cổng kiểm chất lượng |

### Ba hình thoi quyết định (bắt buộc có ≥3)

| Ở giai đoạn | Câu hỏi | Nhánh "Không/Chưa" dẫn tới |
|---|---|---|
| GĐ2 | *"Spec có nói về tham số này không?"* | → hộp *"hạ expected xuống status + schema, ghi Căn cứ = spec im lặng"* |
| GĐ4 | *"Case này có phụ thuộc case khác không?"* | → hộp *"gán thứ tự thực thi + truyền biến môi trường"* |
| GĐ6 | *"Đã qua cả 4 phép kiểm chưa?"* | → **mũi tên quay ngược về GĐ3** |

### Bốn nhánh song song ở GĐ3

```
Domain    State    Security SEC-01..07    Schema
```

Mỗi nhánh ghi *"1 lượt AI riêng"* — đây là phần thể hiện §2 (cấm prompt gộp).

### Ba đầu ra ở GĐ5

```
[ bảng .md 12 cột ]   [ collection Postman .json ]   [ CSV data-driven ]
```

Ghi chú: *"cùng sinh từ MỘT định nghĩa case → không thể lệch nhau"*.

### Góc dưới sơ đồ

```
HW06 §7 — AI-driven API Test Generator — 23127183 — dd/mm/2026
```

---

## Xuất và commit

1. **File → Export as → PNG**, Zoom 200%, bỏ chọn "Transparent Background".
   Lưu `generator-flow-selfdrawn.png`.
2. **File → Save as** → `generator-flow.drawio` trong chính thư mục này. **Commit cả file này.**
3. Mở `generator/design.md` §4, cập nhật dòng ghi công cụ và ngày vẽ.

Nếu dùng **Lucidchart**: dán link chia sẻ vào đây và ghi
*"mở File → Revision history để xem lịch sử chỉnh của sinh viên"* — đó là bằng chứng mạnh nhất.

**Link Lucidchart (nếu dùng):** _(điền)_

---

## Tự kiểm trước khi nộp

- [ ] PNG rộng ≥1600px, chữ đọc được khi mở 100%
- [ ] Có đủ **3 hộp nguồn** ở GĐ1
- [ ] Có đủ **6 hộp giai đoạn** đánh số
- [ ] Có **≥3 hình thoi quyết định**
- [ ] Có **mũi tên quay ngược** GĐ6 → GĐ3
- [ ] Có **4 nhánh song song** ở GĐ3, mỗi nhánh ghi "1 lượt AI riêng"
- [ ] Có **3 đầu ra** ở GĐ5
- [ ] Góc sơ đồ có MSSV + ngày
- [ ] File nguồn (`.drawio` / link Lucidchart) đã commit
- [ ] **Không còn sơ đồ nào do AI sinh trong bộ nộp**
