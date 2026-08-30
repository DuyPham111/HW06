# HW06 — Báo cáo API Testing trên EShop

- **Sinh viên:** Phạm Vũ Ngọc Duy — **MSSV:** 23127183
- **Môn:** Kiểm thử phần mềm — **Bài:** HW06-AI API Testing
- **SUT:** EShop — https://github.com/ttbhanh/eshop-sut · spec: `api_specification.md`
- **Repo:** https://github.com/DuyPham111/HW06
- **Ngày:** __/__/2026

> **Số liệu trong báo cáo này copy từ [`test-cases/test-summary/summary.md`](../test-cases/test-summary/summary.md)**,
> sinh tự động bằng `npm run summary` từ raw JSON của Newman. Không gõ tay số nào.

---

## Tóm tắt một trang

_(Viết cuối cùng, khoảng 200 từ: 3 API đã làm gì, bao nhiêu case, bao nhiêu bug, bug nặng nhất là gì,
điều học được lớn nhất.)_

---

## Mục lục

1. [Phạm vi và lý do chọn API](#1-phạm-vi-và-lý-do-chọn-api)
2. [Quy trình dùng AI từng bước](#2-quy-trình-dùng-ai-từng-bước)
3. [API-01 — Pool A · `POST /api/login`](#3-api-01--pool-a--post-apilogin)
4. [API-02 — Pool B · `POST /api/apply-coupon`](#4-api-02--pool-b--post-apiapply-coupon)
5. [API-03 — Pool C · `PUT /api/productsid`](#5-api-03--pool-c--put-apiproductsid)
6. [Thực thi Postman + Newman](#6-thực-thi-postman--newman)
7. [Bug](#7-bug)
8. [Postman feature đã dùng](#8-postman-feature-đã-dùng)
9. [CI/CD](#9-cicd)
10. [AI test generator](#10-ai-test-generator)
11. [Human review — AI sai và bỏ sót gì](#11-human-review--ai-sai-và-bỏ-sót-gì)

---

## 1. Phạm vi và lý do chọn API

§5 đòi 3 API, mỗi pool một API. Chi tiết + bằng chứng không trùng nhóm:
[`docs/api-selection.md`](../docs/api-selection.md).

| Mã | Pool | FR | API chính | Endpoint hỗ trợ | Prefix |
|---|---|---|---|---|---|
| API-01 | A | FR-02 | `POST /api/login` | `POST /api/register`, `GET /api/users/me` | `TC-LOGIN-###` |
| API-02 | B | FR-09 (+FR-08, FR-10) | `POST /api/apply-coupon` | `cart`, `checkout`, `coupon-usage`, `orders/:id`, `orders/:id/cancel`, `admin/orders/:id/status` | `TC-COUPON-###` |
| API-03 | C | FR-15 | `PUT /api/products/:id` | `POST`/`GET`/`DELETE /api/products/:id` | `TC-PRODUPD-###` |

_(Chép 4 lý do chọn từ `api-selection.md` §2.)_

---

## 2. Quy trình dùng AI từng bước (§2, §6.1)

§2 cấm đích danh prompt gộp. Với **mỗi** API, test case được sinh qua **5 bước = 5 lượt hỏi AI riêng**:

| Bước | Việc | Lượt log |
|---|---|---|
| 1 | Dạy AI về API — bắt trả lời 6 câu về tham số, chỗ spec im lặng, hành vi thật | LOG-___ |
| 2 | Chốt bảng phân vùng domain cho từng tham số | LOG-___ |
| 3 | Sinh case nhóm **Domain** | LOG-___ |
| 4a | Sinh case nhóm **State transition** | LOG-___ |
| 4b | Sinh case nhóm **Security** | LOG-___ |
| 5 | Sinh case nhóm **Schema validation** | LOG-___ |

Toàn bộ prompt nguyên văn và output ở [`ai-audit/ai-audit-report.md`](../ai-audit/ai-audit-report.md).

**Nguyên tắc xuyên suốt:** expected bám **đặc tả** (`api_specification.md` + FR/SEC trong README của
SUT), **không** bám hành vi hiện tại của code. SUT có bug cố ý, nên assertion đỏ là **phát hiện**,
không phải lỗi test.

---

## 3. API-01 — Pool A · `POST /api/login`

### 3.0 Đặc tả và tham số

| Tham số | Vị trí | Kiểu | Bắt buộc | Ràng buộc theo đặc tả |
|---|---|---|---|---|
| `email` | body | string | có | _(điền)_ |
| `password` | body | string | có | _(điền)_ |
| *(ẩn)* trạng thái tài khoản | DB | — | — | FR-02: bộ đếm +1, khóa từ lần 3, khóa 30s |

**Chỗ đặc tả im lặng:** _(điền)_

### 3.1–3.4 Phân bố test case

| Kỹ thuật | Số case |
|---|--:|
| Domain | |
| State | |
| Security | |
| Schema | |
| **Tổng** | |

### 3.5 Audit (§6.2)

_(Tóm tắt: bao nhiêu VALID / INVALID / INCOMPLETE, sửa case nào và vì sao. Chi tiết:
[`test-cases/api-01-login/audit.md`](../test-cases/api-01-login/audit.md).)_

### 3.6 Case tự thêm (§6.3) — __ case

_(Bảng rút gọn + nhóm lý do AI bỏ sót. Chi tiết:
[`extended.md`](../test-cases/api-01-login/extended.md).)_

### 3.7 Kết quả và bug

| Chỉ số | Giá trị |
|---|--:|
| Request đã chạy | |
| Assertion | |
| Pass | |
| **Fail** | |
| Bug xác nhận | |

_(Liệt kê bug, mỗi bug 2–3 dòng, link tới `bug-report.md` và Issue.)_

---

## 4. API-02 — Pool B · `POST /api/apply-coupon`

_(Cùng cấu trúc §3. Riêng mục 4.0 phải có bảng 5 điều kiện FR-09 C1–C5 và sơ đồ state machine FR-10
mà nhóm State phủ.)_

---

## 5. API-03 — Pool C · `PUT /api/products/:id`

_(Cùng cấu trúc §3.)_

---

## 6. Thực thi Postman + Newman (§6.4)

### 6.1 Môi trường

| | |
|---|---|
| SUT | `http://localhost:3000` (Node.js + Express + SQLite) |
| Postman | _(phiên bản)_ |
| Newman | _(phiên bản)_ + `newman-reporter-htmlextra` |
| Máy chạy | _(OS, CPU, RAM)_ |

### 6.2 Header `X-Student-Id` (§6.4, §11)

Đặt bằng **pre-request script cấp collection** ([`postman/prerequest-collection.js`](../postman/prerequest-collection.js))
để không sót request nào. Bằng chứng:

![Postman Console](../bug-report/screenshots/postman-console-gui.png)

### 6.3 Kết quả

_(Copy bảng từ `test-cases/test-summary/summary.md`.)_

### 6.4 Vì sao có nhiều assertion đỏ

Expected bám đặc tả, không bám hành vi SUT. SUT được thiết kế có bug cố ý → đỏ = phát hiện.
Mỗi assertion đỏ map về đúng 1 bug trong [`bug-report/bug-report.md`](../bug-report/bug-report.md);
đỏ không map được là **lỗi test của tôi**, đã sửa và ghi lại ở §11.

---

## 7. Bug (§6.5)

_(Bảng tóm tắt bug: ID, mức độ, API, mô tả 1 dòng, link Issue. Chi tiết ở `bug-report/bug-report.md`.)_

| Mức | Số bug |
|---|--:|
| Critical | |
| High | |
| Medium | |
| Low | |
| **Tổng** | |

---

## 8. Postman feature đã dùng (§6)

_(Copy bảng từ [`postman/README.md`](../postman/README.md).)_

---

## 9. CI/CD (§6)

_(Tóm tắt từ [`ci/ci-report.md`](../ci/ci-report.md): cấu hình pipeline, 2 lượt mẫu với link + ảnh.)_

| Lượt | Cổng | Kết quả | Link | Commit |
|---|---|---|---|---|
| XANH (regression) | 0 đỏ (`--strict`) | | | |
| ĐỎ (bug-hunting, `gate_mode=strict`) | 0 đỏ | | | |

---

## 10. AI test generator (§7)

_(Tóm tắt 6 giai đoạn + nhúng sơ đồ tự vẽ. Chi tiết ở [`generator/design.md`](../generator/design.md).)_

![Sơ đồ generator (tự vẽ)](../generator/diagram/generator-flow-selfdrawn.png)

> Sơ đồ do sinh viên tự dựng trên _(công cụ)_, ngày __/__/2026. File nguồn:
> `generator/diagram/generator-flow.drawio`.

---

## 11. Human review — AI sai và bỏ sót gì

> **Mục quan trọng nhất của báo cáo.** Nó là bằng chứng §6.2 (*"You are fully responsible"*) và là
> nguyên liệu của §10 AI Critique.

| # | AI sai/bỏ sót gì | Ở đâu | Nhóm lý do | Tôi đã sửa thế nào | Hậu quả nếu không phát hiện |
|---|---|---|---|---|---|
| 1 | | | | | |

**Ai làm phần nào** (§9 — AI Policy của bài là Open nên khai rõ):

| Phần | Ai làm | Bằng chứng |
|---|---|---|
| Sinh test case (5 bước) | AI, sinh viên ra prompt và duyệt từng bước | `ai-audit-report.md` |
| Audit + sửa case | **sinh viên** | `audit.md`, dòng ký nhận |
| Chọn phạm vi case §6.3 | **sinh viên** | `extended.md` |
| Dựng collection Postman | AI chấp bút, sinh viên kiểm assertion khớp bảng | `postman/collections/` |
| Chạy Newman, chụp Console | **sinh viên** | `reports/newman/`, ảnh §11 |
| Tái hiện bug bằng curl | **sinh viên** | `verify-bugs-output.txt` |
| Vẽ sơ đồ generator | **sinh viên** | file `.drawio` |
| Tạo GitHub Issues | **sinh viên** | link Issues |
