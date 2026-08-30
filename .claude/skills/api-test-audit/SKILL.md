---
name: api-test-audit
description: Audit AI-generated API test cases for HW06 — label each case VALID / INVALID / INCOMPLETE with a reason, correct the bad ones, then add at least five cases the AI missed and classify why it missed them (prompt quality, model limitation, or API characteristics). Use after api-test-design has produced test-cases/<api>/generated.md.
---

# API Test Audit Skill (HW06 §6.2 + §6.3)

§6.2: *"Label each AI-generated test case VALID / INVALID / INCOMPLETE with reasoning, and correct
the invalid or incomplete ones. **You are fully responsible for the final test cases.**"*
Nhãn không kèm lý do **không tính** là audit.

## Định nghĩa 3 nhãn — dùng đúng nghĩa này, đừng nới

| Nhãn | Khi nào | Phải làm gì |
|---|---|---|
| **VALID** | Expected bám `spec §`/`FR-`/`SEC-`; assertion đủ mạnh; case chạy độc lập được (hoặc ghi rõ phụ thuộc) | không sửa |
| **INVALID** | Expected **sai**: bịa status code, hiểu sai đặc tả, hoặc case không kiểm đúng thứ nó tự nói là kiểm | **sửa** + ghi lý do sai |
| **INCOMPLETE** | Đúng nhưng **thiếu**: chỉ kiểm status không kiểm body · thiếu bước verify · thiếu cleanup · thiếu phân vùng liền kề | **bổ sung** + ghi thiếu gì |

Một bảng 40 case VALID hết là dấu hiệu chưa đọc.

## 5 phép soát — chạy lần lượt trên cả bảng, từng cột một

| # | Soát cột | Bắt lỗi gì |
|---|---|---|
| 1 | `Căn cứ` | **expected bịa** — không trỏ được về `spec §`/`FR-`/`SEC-`/"đặc tả im lặng" → INVALID, hạ expected xuống phần spec bảo đảm |
| 2 | `Expected body / schema` | **assertion yếu** — câu nào không viết được thành `pm.test` trong 1 phút → INCOMPLETE |
| 3 | toàn bảng | **expected chép theo code** — hỏi *"nếu SUT sửa hết bug thì case này còn đúng không?"* → INVALID |
| 4 | `Tham số & phân vùng` | **phụ thuộc không khai báo** — case trong chuỗi state không ghi rõ bước mấy, phụ thuộc case nào → INCOMPLETE |
| 5 | đối chiếu bảng phân vùng | **phân vùng chưa phủ** → ghi vào mục "còn thiếu", bổ sung ở `extended.md` |

Chi tiết + ví dụ thật: [`docs/04-AUDIT.md`](../../../docs/04-AUDIT.md) §3.

## §6.3 — thêm ≥5 case **của bạn**

Đề: *"Add at least five test cases **of your own** that the AI missed — especially around **security
and state transitions** — and explain **why** the AI missed them."*

**Cái bẫy:** hỏi lại AI *"còn thiếu case nào không"* rồi dán kết quả và ghi `Nguồn = SV`. Đó là
misattribution, §11 phạt đúng loại đó. Case AI sinh ở lượt hai phải đánh dấu `AI-2` và **không**
tính vào §6.3.

**Cách đúng:** *bạn* quyết định kiểm cái gì, ở đâu, vì sao đáng kiểm; AI chấp bút thành dòng bảng.
Ghi đúng như vậy trong `extended.md`.

### 4 cách tìm case AI bỏ sót

1. **Đối chiếu bug đã biết từ HW02/HW04/HW05** — cùng 3 FR, bug ở tầng UI thường có anh em mạnh hơn
   ở tầng API (UI có validate client che bớt, API thì không).
2. **Đi từ hệ quả, không từ status code** — thêm bước `GET` kiểm dữ liệu **có thật sự đổi không**.
3. **Phân vùng "dữ liệu hợp lệ chứa ký tự đặc biệt"** — `O'Brien`, `Bàn phím 100% cơ`, `a+b@x.com`.
   AI gắn ký tự lạ với ngữ cảnh tấn công nên bỏ mất phân vùng người dùng thật.
4. **So sánh route anh em** — hai route cùng nhóm nghiệp vụ mà bảo vệ khác nhau (`PUT /api/products/:id`
   không có `authenticateToken`, `PUT /api/categories/:id` thì có).

### Ba nhóm lý do — dùng đúng tên của đề

| Nhóm | Nghĩa |
|---|---|
| `prompt quality` | prompt của bạn hướng AI đi sai chỗ |
| `model limitations` | AI không cộng dồn trạng thái qua nhiều request; không thay số vào công thức; đánh giá test security bằng status thay vì bằng hệ quả |
| `characteristics of the API` | hành vi nằm ở tầng dưới, không có trong đặc tả |

Giải thích phải nói **cơ chế**, không viết *"AI chưa đủ thông minh"*.

## Đầu ra

- `test-cases/<api>/audit.md` — thống kê nhãn · ghi chú từng case INVALID/INCOMPLETE · bảng đầy đủ
  đã sửa · **dòng ký nhận có ngày**.
- `test-cases/<api>/extended.md` — bảng case `Nguồn = SV` từ ID 101 · bảng lý do bỏ sót.
- Commit: `test(api-0X): audit VALID/INVALID/INCOMPLETE (§6.2)` và
  `test(api-0X): 5+ case bo sung va ly do AI bo sot (§6.3)`
