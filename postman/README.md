# Postman — feature đã dùng (§6, §14)

- **Sinh viên:** Phạm Vũ Ngọc Duy — 23127183
- **Workspace:** `HW06-API-Testing-23127183`
- **Environment:** [`environments/HW06-local.postman_environment.json`](environments/HW06-local.postman_environment.json)
- **Pre-request script cấp collection:** [`prerequest-collection.js`](prerequest-collection.js)

> §6: *"Exercise as many Postman features as you reasonably can… **List the Postman features you
> used in your report.**"* · §14 nhắc lại trong danh sách file nộp.
> Hướng dẫn: [`docs/08-POSTMAN-FEATURES.md`](../docs/08-POSTMAN-FEATURES.md).

---

## 1. Collection

| Collection | API | Vai trò |
|---|---|---|
| `23127183_api-01-login` | `POST /api/login` | bug-hunting |
| `23127183_api-02-apply-coupon` | `POST /api/apply-coupon` | bug-hunting |
| `23127183_api-03-product-update` | `PUT /api/products/:id` | bug-hunting |
| `23127183_regression` | tập con case đang xanh | cổng CI 0 đỏ |

Mỗi collection có 6 folder: `00-setup` · `01-domain` · `02-state` · `03-security` · `04-schema` · `99-teardown`.

---

## 2. Bảng feature đã dùng

| # | Feature | Dùng để làm gì | Bằng chứng |
|---|---|---|---|
| 1 | Workspace | `HW06-API-Testing-23127183` chứa cả 4 collection | ![](../bug-report/screenshots/postman-workspace.png) |
| 2 | Collections | 3 bug-hunting + 1 regression | `collections/*.json` |
| 3 | Folders | 6 folder/collection theo kỹ thuật → báo cáo Newman tự nhóm kết quả | |
| 4 | Environment | `HW06-local-23127183` — 16 biến | `environments/*.json` |
| 5 | Variables (env · collection · dynamic) | `{{base_url}}`, `{{admin_token}}`, `{{order_id}}`; `{{$randomEmail}}` cho tài khoản mồi | §3 dưới |
| 6 | Secret variable type | mật khẩu và token đặt type `secret` | |
| 7 | **Pre-request script cấp collection** | gắn `X-Student-Id` cho **mọi** request + log Console (§6.4, §11) | `prerequest-collection.js` |
| 8 | Post-response script / `pm.test` | toàn bộ assertion | mọi request |
| 9 | JSON Schema validation | folder `04-schema` — §6.1 đòi *"response shape exactly matches the spec"* | §3 dưới |
| 10 | Collection Runner + data file CSV | data-driven, §6 gọi tên đích danh | `data/*.csv` · ![](../bug-report/screenshots/postman-data-driven.png) |
| 11 | Postman Console | bằng chứng §11 | ![](../bug-report/screenshots/postman-console-gui.png) |
| 12 | Newman CLI + `htmlextra` | chạy ngoài GUI, xuất HTML + raw JSON | `../reports/newman/` |
| 13 | Newman trong CI (GitHub Actions) | §6 CI/CD | `../.github/workflows/api-tests.yml` |
| 14 | Mock Server | _(xem §4)_ | |
| 15 | Monitor | _(xem §4)_ | |

---

## 3. Trích script tiêu biểu

### 3.1 Pre-request cấp collection — `X-Student-Id` (§6.4, §11)

```js
const studentId = pm.environment.get("student_id") || "23127183";
pm.request.headers.upsert({ key: "X-Student-Id", value: studentId });
console.log("[HW06] X-Student-Id =", studentId, "|", pm.request.method,
            pm.request.url.getPath(), "|", new Date().toISOString());
```

Đặt ở **cấp collection**, không gắn tay từng request: hơn trăm request, sót một cái là mất bằng
chứng §11 cho request đó.

### 3.2 JSON Schema validation

```js
// (dán assertion thật của bạn)
```

`additionalProperties: false` là chỗ bắt lỗi **trả thừa dữ liệu** (SEC-01 — response chứa `password`).

### 3.3 Data-driven

```js
// (dán assertion thật của bạn)
```

---

## 4. Mock Server và Monitor

### Mock Server

**Mục đích:** chứng minh assertion viết **đúng chiều**. SUT trả `discount_amount` sai công thức nên
assertion FR-09 đỏ. Chạy **cùng assertion đó** lên một mock trả đúng đặc tả → nó xanh ⇒ đỏ là do SUT
sai, không phải do assertion sai.

| | |
|---|---|
| URL mock | _(điền)_ |
| Environment | `HW06-mock-23127183` |
| Kết quả | _(điền)_ |
| Ảnh | ![](../bug-report/screenshots/postman-mock-server.png) |

### Monitor

_(Chọn một trong hai — xem [`docs/08-POSTMAN-FEATURES.md`](../docs/08-POSTMAN-FEATURES.md) §3.2)_

**Nếu làm:** monitor cho collection mock (chạy được vì mock ở trên cloud).

| | |
|---|---|
| Tên | `HW06-monitor-FR09-23127183` |
| Tần suất | hàng tuần |
| Ảnh | ![](../bug-report/screenshots/postman-monitor.png) |

**Nếu không làm, ghi lý do này:**

> Monitor chạy trên hạ tầng cloud của Postman, không truy cập được `http://localhost:3000` nơi SUT
> triển khai (§11 cũng đòi hostname phải là localhost/127.0.0.1). Vì vậy monitor không áp dụng được
> cho bộ test chính. Đã dùng **GitHub Actions** làm cơ chế chạy tự động tương đương, vì runner tự
> dựng SUT ngay trong job.

---

## 5. Feature đã cân nhắc nhưng **không** dùng

| Feature | Vì sao không dùng |
|---|---|
| Postman Flows | bộ test này tuyến tính; Flows không thêm khả năng kiểm nào mà lại làm collection khó xuất `.json` cho CI |
| Public workspace | collection chứa mật khẩu tài khoản seed → để Personal |
| Postman API (quản lý collection bằng API) | chỉ 4 collection, export tay là đủ |
