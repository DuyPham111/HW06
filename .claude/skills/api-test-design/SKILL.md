---
name: api-test-design
description: Design API test cases from an API specification, one technique step at a time — domain partitions on every parameter, state transitions, security SEC-01..SEC-07, and schema validation. Use for HW06 when generating test cases for a chosen EShop API (POST /api/login, POST /api/apply-coupon, PUT /api/products/:id) before writing the Postman collection. Produces the 12-column Markdown table the Excel exporter reads.
---

# API Test Design Skill (HW06 §6.1)

Đề §2 **cấm đích danh** một prompt gộp kiểu *"generate all the API test cases from the spec and run
them"*. Skill này chia việc thành **5 bước**, mỗi bước một lượt AI riêng, mỗi bước một mục trong
`ai-audit/ai-audit-report.md`. Đi đủ 5 bước chính là bằng chứng cho §2.

## Trước khi bắt đầu — đọc 3 nguồn, không chỉ 1

| Nguồn | Lấy gì |
|---|---|
| `eshop-sut/api_specification.md` | endpoint · tham số · body mẫu · response thành công |
| `eshop-sut/README.md` (FR-xx + SEC-01…SEC-07) | **ràng buộc nghiệp vụ và bảo mật** — đặc tả API không có |
| `eshop-sut/backend/server.js` | hành vi **thật**: status code thật, middleware có/không, câu SQL, số dòng |

Đọc cả ba vì expected phải bám **spec + FR/SEC**; nhưng khi spec và code lệch nhau thì **chỗ lệch
chính là bug**. Nguồn thứ ba chỉ để **biết chỗ nào đáng chọc** — không bao giờ để expected bám code.

## 5 bước

| Bước | Việc | Ra |
|---|---|---|
| 1 | Bắt AI **đọc và trả lời 6 câu** về tham số, chỗ spec im lặng, hành vi thật, trạng thái. **Chưa sinh case** | bảng dữ kiện |
| 2 | Chốt **bảng phân vùng** cho từng tham số + tham số ẩn (auth, trạng thái) | bảng partition có cột `Căn cứ` |
| 3 | Sinh case nhóm **Domain** — chỉ nhóm này | ~15–20 case |
| 4a | Sinh case nhóm **State transition** — lượt riêng | ~5–16 case |
| 4b | Sinh case nhóm **Security SEC-01..07** — lượt riêng | ~8–12 case |
| 5 | Sinh case nhóm **Schema validation** | ~7–10 case |

**Vì sao 4a và 4b tách riêng:** state và security là hai cách nghĩ khác nhau. Gộp một prompt thì AI
luôn dồn về security và sinh 2–3 case state cho có.

Prompt đầy đủ cho từng bước và cho từng API: [`docs/03-GENERATE-AI.md`](../../../docs/03-GENERATE-AI.md).

## Khuôn xuất — đúng 12 cột, không thêm bớt

```
| TC ID | Kỹ thuật | Tham số & phân vùng | Request | Auth | Query / Body | Expected status | Expected body / schema | Căn cứ | Nguồn | Audit | Kết quả |
```

- `Kỹ thuật` ∈ {`Domain`, `State`, `Security SEC-0X`, `Schema`}
- `Nguồn` ∈ {`AI`, `AI-2`, `SV`} — **đừng gắn `SV` cho case AI sinh** (§11 phạt misattribution)
- `Audit` và `Kết quả` để **trống** ở bước này

## Ba luật không được vi phạm

1. **Không bịa `expected`.** Spec im lặng thì chỉ khẳng định phần spec bảo đảm (status + schema +
   `Content-Type`), và ghi cột `Căn cứ` là *"đặc tả im lặng"*. Một expected không căn cứ sinh ra
   **bug giả** — lỗi tệ nhất của bộ test.
2. **Expected bám FR/SEC, không bám code.** SUT có bug cố ý. Nếu expected chép hành vi hiện tại thì
   bộ test luôn xanh trên một hệ thống đang sai.
3. **`Expected body / schema` phải viết được thành `pm.test` trong 1 phút.** *"Trả về thành công"*
   không phải expected.

## Sau khi chạy skill

- Dán 4 bảng vào `test-cases/<api>/generated.md`, điền bảng phân bố theo kỹ thuật.
- Chưa đủ 35 case thì **đừng độn case rác** — quay lại bước 2 tìm phân vùng còn thiếu (hay thiếu
  nhất: biên trên + 1, sai kiểu dữ liệu, biến thể auth, nhánh lỗi).
- Ghi 6 mục log vào `ai-audit/ai-audit-report.md` (dùng skill `ai-audit-logger`).
- Commit: `test(api-0X): sinh test case bang AI theo 5 buoc (§6.1)`
- Bước tiếp theo: skill `api-test-audit`.
