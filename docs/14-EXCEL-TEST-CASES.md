# 14 — §14 Excel test case + test summary (+ OpenAPI tuỳ chọn)

> Output: `excel/23127183_HW06_TestCases.xlsx`.
> **Commit:** `docs: xuat Excel test case va test summary (§14)`

---

## 1. §14 đòi gì

Trong danh sách file nộp: *"**The Excel test cases and test summary.**"* — một file `.xlsx`, không
phải `.md`, không phải `.csv`.

§17: thiếu = 0 điểm. Đây là file dễ quên nhất vì nó không xuất hiện trong §6 (phần mô tả pipeline).

---

## 2. Cấu trúc file Excel — 5 sheet

| Sheet | Nội dung | Nguồn |
|---|---|---|
| `Summary` | bảng test summary: số API, case sinh/thêm/chạy/pass/fail, số bug | `test-cases/test-summary/summary.md` |
| `API-01-login` | bảng 12 cột đầy đủ (generated + extended, đã audit) | `test-cases/api-01-login/audit.md` + `extended.md` |
| `API-02-coupon` | như trên | `test-cases/api-02-apply-coupon/*` |
| `API-03-product-update` | như trên | `test-cases/api-03-product-update/*` |
| `Bugs` | bảng bug: ID, mức độ, API, test case liên quan, số assertion đỏ, link Issue | `bug-report/bug-report.md` |

Sheet `Summary` phải khớp **chính xác** bảng trong `README.md`. Hai nơi lệch nhau là mất tin cậy toàn bài.

---

## 3. Cách xuất — script Python

Đừng copy-paste tay 120 dòng × 12 cột: chắc chắn lệch với bảng Markdown, và mỗi lần sửa test case là
phải làm lại.

Tạo `tools/tc2xlsx.py` đọc thẳng các bảng Markdown và ghi ra `.xlsx`:

```bash
pip install openpyxl
python tools/tc2xlsx.py
```

Script cần làm 4 việc:

1. **Đọc bảng Markdown** — quét file `test-cases/*/audit.md` và `extended.md`, lấy khối bắt đầu bằng
   dòng `| TC ID |`, tách theo `|`, bỏ dòng phân cách `|---|`.
2. **Bỏ định dạng Markdown trong ô** — `**đậm**` → `đậm`, `` `code` `` → `code`. Excel không hiểu.
3. **Định dạng cho đọc được** — freeze dòng header, `auto_filter` trên hàng 1, đặt độ rộng cột
   (cột `Query / Body` và `Căn cứ` cần rộng ~60), `wrap_text` cho các cột dài.
4. **Tô màu cột `Kết quả`** — `Pass` xanh, `FAIL` đỏ. Người chấm nhìn một cái là thấy phân bố.

**Prompt để nhờ AI viết script này** (ghi log LOG-0xx):

> Viết script Python `tools/tc2xlsx.py` dùng `openpyxl`. Nó đọc các file Markdown sau:
> `test-cases/api-01-login/audit.md`, `test-cases/api-01-login/extended.md`, và tương tự cho
> `api-02-apply-coupon`, `api-03-product-update`; cùng với `test-cases/test-summary/summary.md` và
> `bug-report/bug-report.md`.
>
> Trong mỗi file, tìm **mọi** bảng Markdown có dòng header bắt đầu bằng `| TC ID |`, parse thành
> danh sách dòng. Bỏ dòng phân cách `|---|`. Trong từng ô: gỡ `**`, gỡ backtick, thay `<br>` bằng
> xuống dòng.
>
> Ghi ra `excel/23127183_HW06_TestCases.xlsx` với 5 sheet: `Summary`, `API-01-login`,
> `API-02-coupon`, `API-03-product-update`, `Bugs`.
>
> Với mỗi sheet dữ liệu: dòng 1 là header in đậm nền xám, freeze panes ở `A2`, bật auto_filter,
> `wrap_text=True` và `vertical="top"` cho mọi ô, độ rộng cột: TC ID 14, Kỹ thuật 16,
> Tham số & phân vùng 40, Request 28, Auth 16, Query/Body 55, Expected status 14,
> Expected body/schema 45, Căn cứ 40, Nguồn 8, Audit 12, Kết quả 16.
>
> Ở cột `Kết quả`: ô chứa `Pass` tô nền xanh nhạt, ô chứa `FAIL` tô nền đỏ nhạt.
>
> Script phải **báo lỗi rõ ràng** nếu một file nguồn không tồn tại hoặc không tìm thấy bảng nào,
> chứ không im lặng ghi sheet rỗng. In ra số dòng đã ghi cho từng sheet.

**Sau khi AI viết xong, bạn phải:** chạy thật, mở file `.xlsx` bằng Excel, kiểm 3 điều —
số dòng mỗi sheet khớp số case, tiếng Việt có dấu không lỗi font, không có ô nào còn `**` hay backtick.

---

## 4. (Tuỳ chọn) Chuyển spec sang OpenAPI

§14: *"Optionally, the API specification converted to OpenAPI (.yaml / .json); if AI-generated,
**audit it as well**."*

**Có nên làm không:** nếu 3 API đã xong pipeline và còn thời gian thì có — nó cho phép dùng
`pm.response.to.have.jsonSchema` với schema lấy thẳng từ OpenAPI, và Postman import được OpenAPI
thành collection khung.

**Nếu làm, phải audit** — đây là bẫy: file OpenAPI do AI sinh mà không audit thì **vi phạm chính
§6.2**, và §14 nhắc lại rõ ràng.

Quy trình rút gọn:

1. Prompt AI: chuyển `api_specification.md` sang OpenAPI 3.0 YAML, **chỉ mô tả những gì đặc tả nói**,
   chỗ đặc tả im lặng thì ghi `description: "spec không định nghĩa"` chứ không bịa schema.
2. Lưu `docs/openapi.yaml`.
3. **Audit**: mở song song với `api_specification.md`, đối chiếu từng endpoint. Ghi
   `docs/openapi-audit.md` với 3 cột: endpoint · AI viết gì · đúng/sai/thiếu + sửa gì.
   Chỗ AI hay sai: bịa `required` cho field mà spec không nói, bịa status code `404`/`422`,
   bịa `format: email`.
4. Kiểm bằng máy: dán vào https://editor.swagger.io/ xem có lỗi cú pháp không.

**Nếu không làm**, ghi một dòng trong README: *"§14 mục OpenAPI là tuỳ chọn — không thực hiện."*
Đừng để người chấm phải đoán.

---

## 5. Checklist

- [ ] `tools/tc2xlsx.py` chạy được, không lỗi
- [ ] `excel/23127183_HW06_TestCases.xlsx` có đủ 5 sheet
- [ ] Số dòng mỗi sheet **khớp** số case trong file Markdown tương ứng
- [ ] Sheet `Summary` khớp bảng trong `README.md`
- [ ] Mở bằng Excel kiểm: tiếng Việt đúng font, không còn `**` / backtick, cột không bị hẹp quá
- [ ] (nếu làm OpenAPI) có cả `openapi.yaml` **và** `openapi-audit.md`
- [ ] Commit: `docs: xuat Excel test case va test summary (§14)`
