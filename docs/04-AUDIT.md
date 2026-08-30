# 04 — §6.2 Audit: dán nhãn VALID / INVALID / INCOMPLETE

> Output mỗi API: `test-cases/api-0X-*/audit.md`.
> **Commit:** `test(api-01): audit VALID/INVALID/INCOMPLETE (§6.2)`

---

## 1. §6.2 đòi gì

Nguyên văn: *"Label each AI-generated test case VALID / INVALID / INCOMPLETE with reasoning, and
correct the invalid or incomplete ones. **You are fully responsible for the final test cases.**"*

Ba chữ quan trọng: **with reasoning**. Nhãn không kèm lý do **không tính là audit**. Và
*"fully responsible"* nghĩa là nếu bảng cuối cùng còn case sai thì đó là lỗi của bạn, không phải của AI.

---

## 2. Định nghĩa 3 nhãn — dùng đúng nghĩa này, đừng nới

| Nhãn | Khi nào | Bạn phải làm gì |
|---|---|---|
| **VALID** | Expected bám `spec §` / `FR-` / `SEC-`; assertion đủ mạnh để phát hiện sai lệch; case chạy độc lập được (hoặc ghi rõ phụ thuộc) | không sửa |
| **INVALID** | Expected **sai**: bịa status code, hiểu sai đặc tả, hoặc case không kiểm đúng thứ nó tự nói là kiểm | **sửa** + ghi rõ sai ở đâu |
| **INCOMPLETE** | Đúng nhưng **thiếu**: chỉ kiểm status mà không kiểm body · thiếu bước verify · thiếu cleanup · thiếu phân vùng liền kề (có biên trên mà không có biên trên + 1) | **bổ sung** + ghi thiếu gì |

> **Đừng dán VALID cho tất cả.** Một bảng 40 case VALID hết là dấu hiệu bạn chưa đọc. Bài tham khảo
> đã 100đ có tỉ lệ khoảng **1–3 case INVALID/INCOMPLETE trên mỗi 36 case** — đó là mức thực tế.
> Kể cả khi bạn thật sự thấy mọi case đều ổn, vẫn phải ghi **ghi chú audit** giải thích bạn đã soát
> theo tiêu chí nào.

---

## 3. Quy trình audit: 5 phép soát, chạy lần lượt trên cả bảng

Làm thủ công, từng cột. Nhanh hơn bạn nghĩ — 40 case mất khoảng 40 phút.

### Soát 1 — Cột `Căn cứ` (bắt expected bịa)

Đọc **chỉ cột này**. Mọi dòng không trỏ được về `spec §x.y` / `FR-xx` / `SEC-0x` / `"đặc tả im lặng"`
→ **INVALID**. Sửa bằng cách hạ expected xuống phần đặc tả bảo đảm.

Ví dụ thật hay gặp ở API-03:

> AI sinh: `PUT /api/products/999999` → expected `404`, căn cứ *"chuẩn REST"*.
> **Đặc tả không nói gì** về trường hợp id không tồn tại. "Chuẩn REST" không phải căn cứ trong bài này.
> → Nhãn **INCOMPLETE**, sửa cột `Căn cứ` thành: *"đặc tả im lặng; suy từ §3.2 — `:id` định danh
> **một** tài nguyên nên không có tài nguyên thì không có gì để cập nhật"*, giữ expected `404`
> nhưng **ghi rõ đây là suy luận**. Khi nó đỏ, bug report phải nói rõ mức độ là *Medium* chứ không
> phải *Critical*, vì căn cứ là suy luận chứ không phải câu chữ đặc tả.

### Soát 2 — Cột `Expected body / schema` (bắt assertion yếu)

Đọc **chỉ cột này**. Câu nào không viết được thành `pm.test` trong 1 phút → **INCOMPLETE**.

| Viết yếu (INCOMPLETE) | Viết lại thành |
|---|---|
| "trả về thành công" | `body.success === true` và có field `discount_amount` kiểu number |
| "báo lỗi" | status `400` **và** `body.error` là string **và** body **không** chứa `SQLITE_` |
| "không đăng nhập được" | status `401` **và** body **không** có field `token` |
| "sản phẩm được cập nhật" | `PUT` trả 200, **rồi** `GET /api/products/:id` trả về `name` **bằng đúng** giá trị vừa gửi |

> Soát 2 là phép soát đáng giá nhất. Một case có expected đúng nhưng assertion yếu sẽ **XANH trên một
> SUT có bug** — tức là bạn mất một phát hiện mà không hề biết.

### Soát 3 — Expected có bị chép theo code không

Với mỗi case, hỏi: *nếu SUT sửa hết bug thì case này còn đúng không?*

Ví dụ: AI sinh `TC-LOGIN-0xx` — *"sai mật khẩu 2 lần → tài khoản bị khóa"*, căn cứ ghi `FR-02`.
Nhưng **FR-02 nói khóa từ lần thứ 3**. AI đã chép hành vi của code (`+2` mỗi lần) rồi dán nhãn FR-02
lên. → **INVALID**. Sửa expected thành *"sai 2 lần: vẫn 401, **chưa** khóa"* và thêm case
*"sai lần thứ 3 mới khóa"*. Case đã sửa sẽ **đỏ** — và đỏ đó chính là bug bạn báo.

### Soát 4 — Case có chạy được độc lập không

Case nào phụ thuộc case khác (chuỗi state) mà **không ghi rõ phụ thuộc** → **INCOMPLETE**.
Bổ sung vào cột `Tham số & phân vùng`: *"bước 3/6, phụ thuộc TC-…-041 (đã tạo `order_id`)"*.

Case nào làm bẩn dữ liệu mà không có bước dọn → **INCOMPLETE**, thêm cleanup hoặc ghi rõ
*"chấp nhận làm bẩn; SUT seed lại DB khi restart"*.

### Soát 5 — Còn phân vùng nào chưa phủ

Mở lại bảng phân vùng (bước 2 của [03](03-GENERATE-AI.md)), đối chiếu từng dòng với bảng test case.
Phân vùng nào không có case nào → ghi vào phần **"còn thiếu"** của `audit.md`, rồi bổ sung ở
[05](05-EXTEND.md).

Chỗ hay thiếu nhất, theo thứ tự:

1. **Biên trên + 1** (name 256 ký tự, số cực lớn) — AI hay chỉ làm biên dưới.
2. **Sai kiểu dữ liệu** — gửi mảng/object/`null` thay vì string.
3. **Auth biến thể** — AI thường chỉ làm "không token" và "token admin", bỏ 4 biến thể còn lại.
4. **Nhánh lỗi có đúng shape không** — AI chỉ kiểm nhánh thành công.
5. **Hệ quả lên dữ liệu** — kiểm status code mà không kiểm dữ liệu thật sự đã đổi/không đổi.

---

## 4. Cách viết `audit.md`

Khung file đã có sẵn. Ba phần:

**1) Bảng thống kê**

| Nhãn | Số case |
|---|--:|
| VALID | … |
| INVALID (đã sửa) | … |
| INCOMPLETE (đã bổ sung) | … |

**2) Ghi chú audit** — mỗi case INVALID/INCOMPLETE một đoạn ngắn: sai/thiếu gì, sửa thành gì, **vì sao**.
Đây là phần được chấm, không phải bảng.

**3) Bảng audit đầy đủ** — chép lại bảng 12 cột từ `generated.md`, điền cột `Audit`, và **sửa luôn**
nội dung các case INVALID/INCOMPLETE ngay trong bảng này. Từ đây trở đi `audit.md` là **bản đúng**;
`generated.md` giữ nguyên làm bằng chứng lượt AI đầu tiên (đừng sửa `generated.md` nữa).

---

## 5. Một đoạn bắt buộc phải có trong `audit.md`

Chép ý này vào cuối mỗi file (đổi số cho khớp):

> **Không sửa expected để khớp SUT.** Các case sau ĐỎ ở lượt nộp — liệt kê đúng danh sách, không gộp
> khoảng: `TC-…-0xx · 0yy · …`. Sửa expected cho khớp hành vi sai của SUT là cách nhanh nhất để bộ
> test mất hết giá trị. Đỏ ở đây là **phát hiện**, không phải lỗi test.

Danh sách này phải **khớp với `reports/newman/*.json`**. Điền nó **sau khi** chạy Newman ở
[07](07-CHAY-NEWMAN-BANG-CHUNG.md), đừng đoán trước.

---

## 6. Human review — §6.2 đòi **bạn** chịu trách nhiệm

Đề nói *"Every result produced by the AI must be carefully reviewed by you, the student."*
Cách chứng minh bạn đã review thật, ghi vào `ai-audit/ai-audit-report.md`:

| Việc | Bằng chứng để lại |
|---|---|
| Đọc hết bảng audit | dòng ký nhận cuối `audit.md`: *"Đã đọc và duyệt toàn bộ N case — SV 23127183, ngày dd/mm/2026"* |
| Tự tái hiện ≥3 bug nặng nhất bằng `curl` | dán lệnh + output vào `bug-report/bug-report.md` |
| Tự chạy ít nhất 1 lượt Newman đầy đủ | lượt đó chính là file nộp trong `reports/newman/` |
| Tự chạy collection trong Postman GUI | ảnh `bug-report/screenshots/postman-console-gui.png` |

**Đừng ký nhận việc bạn chưa làm.** §13 có vấn đáp ngẫu nhiên 30%; TA hỏi *"case này bạn sửa gì và
vì sao"* mà bạn không trả lời được thì mất nhiều hơn phần điểm của case đó.

---

## 7. Checklist mỗi API

- [ ] Chạy đủ 5 phép soát §3
- [ ] `audit.md` có bảng thống kê + ghi chú từng case INVALID/INCOMPLETE + bảng đầy đủ 12 cột
- [ ] Có **ít nhất 1** case bị dán nhãn khác VALID, kèm lý do cụ thể
- [ ] Danh sách phân vùng còn thiếu đã ghi lại để dùng ở [05](05-EXTEND.md)
- [ ] Dòng ký nhận human review có ngày tháng
- [ ] Commit: `test(api-0X): audit VALID/INVALID/INCOMPLETE (§6.2)`
