---
name: postman-newman
description: Turn an audited HW06 test-case table into a runnable Postman collection and execute it with Newman — folder layout, collection-level X-Student-Id pre-request script, pm.test assertions, JSON schema checks, data-driven CSV runs, HTML report, and the CI gate against the expected-failures baseline. Use after api-test-audit, or whenever a Newman run needs to be executed or debugged.
---

# Postman + Newman Skill (HW06 §6.4)

## Bất biến — sai một trong ba là mất điểm §11

1. **Mọi** request mang header `X-Student-Id: 23127183`, đặt ở **pre-request script cấp collection**
   (`postman/prerequest-collection.js`) — hơn trăm request, gắn tay là sót.
2. Hostname trong output Newman phải là `localhost` / `127.0.0.1`.
3. Ảnh **Postman Console** chứng minh header có thật: `View → Show Postman Console`, chụp lúc chạy.

## Cấu trúc collection

```
23127183_<api-slug>.postman_collection.json
├── 00-setup      login admin/user → pm.environment.set(token) · đọc mốc total_products
├── 01-domain
├── 02-state      CHẠY THEO ĐÚNG THỨ TỰ, truyền dữ liệu qua environment variable
├── 03-security
├── 04-schema
└── 99-teardown   dọn fixture đã tạo
```

**Tên request = TC ID.** `npm run summary` và báo cáo Newman đều map assertion đỏ về test case bằng
tên request.

## 6 khuôn assertion

| # | Khuôn | Dùng cho |
|---|---|---|
| 1 | status + shape | mọi case |
| 2 | `pm.response.to.have.jsonSchema(...)` với `additionalProperties: false` | folder `04-schema` — bắt lỗi trả thừa dữ liệu |
| 3 | `to.not.have.property(...)` | SEC-01 — field **không được có** (`password`, `login_attempts`) |
| 4 | so giá trị tính được (`to.eql(50000)`) | bắt lỗi **công thức** |
| 5 | body không chứa `SQLITE_`, `<h1>`, `at Object.` | SEC-05 — không lộ chi tiết engine |
| 6 | decode JWT, kiểm claim `exp` | SEC-02 — token phải có hạn |

Code đầy đủ: [`docs/06-POSTMAN-COLLECTION.md`](../../../docs/06-POSTMAN-COLLECTION.md) §4.

**Luật:** assertion **không nghiêm hơn** và **không lỏng hơn** cột `Expected` trong bảng test case.
Lệch là bảng thành đồ trang trí. Soát bằng cách mở song song `audit.md` và collection.

## Chuỗi state

1. Cả chuỗi trong một folder `02-state`, đánh số theo thứ tự thực thi.
2. Truyền dữ liệu bằng `pm.environment.set("order_id", ...)` — **không hard-code id**.
3. Bước setup bắt buộc xanh phải `console.error` khi hỏng, để phân biệt "đỏ vì bug" với "đỏ vì môi trường".
4. **Không dùng `postman.setNextRequest()`** trừ khi thật cần — nó làm thứ tự chạy khác thứ tự đọc.

## Thủ tục chạy chính thức

```bash
# terminal 1: restart SUT -> DB bị DROP và seed lại -> trạng thái đầu vào xác định
node server.js
# terminal 2:
npm run preflight     # SUT sống? tài khoản seed còn? 3 API phản hồi?
npm run test:api1     # hoặc test:api2 / test:api3 / test:all
npm run summary       # NGUỒN SỐ LIỆU DUY NHẤT - đừng gõ tay số nào
```

**Restart SUT giữa các collection.** API-02 tạo đơn hàng và ghi `coupon_usage`, API-03 tạo/xóa sản
phẩm — chạy liền trên cùng DB thì collection sau nhận trạng thái bẩn.

## Đọc kết quả: 3 loại đỏ

| Loại | Dấu hiệu | Xử lý |
|---|---|---|
| **Bug thật của SUT** | tái hiện được bằng `curl` độc lập | → bug report + GitHub Issue |
| **Lỗi test của mình** | biến rỗng · sai URL · assertion nghiêm hơn expected · chuỗi state sai thứ tự | sửa, chạy lại, **ghi vào bảng "AI/tôi đã sai gì"** ở main-report §11 |
| **Lỗi môi trường** | tài khoản bị khóa từ lượt trước · SUT chết · DB bẩn | restart SUT, chạy lại, **không** tính vào số liệu nộp |

Đỏ là **kết quả mong đợi** ở bài này — expected bám đặc tả, SUT có bug cố ý. **Không sửa expected
cho khớp SUT.**

## Cổng CI

| Bộ | Cổng | Vai trò |
|---|---|---|
| `23127183_regression` — tập con case đang xanh, **giữ nguyên expected** | `ci-gate.mjs --strict` (0 đỏ) | lượt XANH §6 |
| 3 collection bug-hunting | so `ci/expected-failures.json` | đỏ tăng = hồi quy · đỏ giảm = SUT sửa **hoặc test yếu đi** |

Tạo lượt ĐỎ: Actions → `api-tests` → Run workflow → `gate_mode = strict`.
