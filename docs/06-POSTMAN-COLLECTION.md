# 06 — §6.4 Dựng 3 collection Postman

> Output: `postman/collections/23127183_api-0X-*.postman_collection.json` ×3.
> **Commit:** `test: 3 collection Postman + prerequest X-Student-Id`

---

## 1. Bất biến — sai một trong ba là mất điểm §11

1. **Mọi** request phải mang header `X-Student-Id: 23127183`. Đặt ở **pre-request script cấp
   collection**, không gắn tay từng request — hơn 100 request, sót một cái là mất bằng chứng cho request đó.
2. Hostname trong output Newman phải là `localhost` / `127.0.0.1` — đúng nơi bạn triển khai SUT.
3. Ảnh **Postman Console** chứng minh header có thật ([07](07-CHAY-NEWMAN-BANG-CHUNG.md) §4).

---

## 2. Cấu trúc mỗi collection — 5 folder

```
23127183_api-01-login.postman_collection.json
├── 00-setup          login admin + user -> lưu token vào environment; đọc mốc (total_products…)
├── 01-domain         case nhóm Domain
├── 02-state          case nhóm State transition — CHẠY THEO ĐÚNG THỨ TỰ
├── 03-security       case nhóm Security SEC-01..07
├── 04-schema         case nhóm Schema validation
└── 99-teardown       dọn fixture đã tạo (xóa sản phẩm/tài khoản mồi)
```

**Vì sao chia folder theo kỹ thuật:** báo cáo Newman HTML nhóm kết quả theo folder, nên bảng
*"Domain: 18 pass / 2 fail"* có sẵn không phải đếm tay. Và khi cần chạy lại riêng nhóm state
(nhóm dễ vỡ nhất) thì dùng `--folder 02-state`.

**`00-setup` bắt buộc có, kể cả API-01.** Nó lưu `total_products`, `user_id` và token vào environment
để các case sau dùng biến thay vì hard-code.

---

## 3. Tạo collection — từng bước trong Postman GUI

### 3.1 Tạo và gắn pre-request script

1. Sidebar → **Collections → +** → đặt tên `23127183_api-01-login`.
2. Click vào **tên collection** (không phải request) → tab **Scripts** → **Pre-request**.
3. Dán **toàn bộ** `postman/prerequest-collection.js`. **Save** (`Ctrl+S`).
4. Lặp lại cho 2 collection còn lại.

> Postman bản mới gọi tab này là **Scripts**; bản cũ gọi là **Pre-request Script**. Cùng một chỗ.

### 3.2 Folder `00-setup` — 3 request

**`00-01 login admin`**

- `POST {{base_url}}/api/login`
- Body → raw → JSON:
  ```json
  { "email": "{{admin_email}}", "password": "{{admin_password}}" }
  ```
- Tab **Scripts → Post-response**:
  ```js
  pm.test("setup: login admin tra 200 + token", () => {
    pm.response.to.have.status(200);
    pm.expect(pm.response.json()).to.have.property("token");
  });
  const b = pm.response.json();
  pm.environment.set("admin_token", b.token);
  pm.environment.set("admin_id", b.user.id);
  ```

**`00-02 login user`** — như trên với `{{user_email}}` / `{{user_password}}`, lưu `user_token`, `user_id`.

**`00-03 doc moc du lieu`**

- `GET {{base_url}}/api/products`
- Post-response:
  ```js
  const arr = pm.response.json();
  pm.environment.set("total_products", arr.length);
  pm.environment.set("fixture_product_id", arr[0].id);
  ```

> **Đừng hard-code `5`.** DB được seed lại mỗi lần restart nhưng test của bạn có thể đã thêm/xóa
> sản phẩm. Mốc tương đối làm bộ test chạy lại được nhiều lần.

### 3.3 Thêm request cho từng test case

Với mỗi dòng trong `audit.md` + `extended.md`:

| Cột trong bảng | Điền vào đâu trong Postman |
|---|---|
| `TC ID` + mô tả ngắn | **tên request**, ví dụ `TC-LOGIN-007 password rong` |
| `Request` | method + URL |
| `Auth` | tab **Headers** → `Authorization: Bearer {{admin_token}}` (hoặc bỏ trống) |
| `Query / Body` | tab **Body → raw → JSON** |
| `Expected status` + `Expected body` | tab **Scripts → Post-response** → `pm.test(...)` |

**Đặt tên request bằng đúng TC ID.** Báo cáo Newman và `npm run summary` đều lấy tên request để map
assertion đỏ về test case — đặt tên tuỳ tiện là mất khả năng truy vết.

---

## 4. Viết assertion — 6 khuôn dùng đi dùng lại

### Khuôn 1 — status + shape

```js
pm.test("TC-LOGIN-001: 200 + co token", () => {
  pm.response.to.have.status(200);
  pm.response.to.be.json;
  const b = pm.response.json();
  pm.expect(b.token, "field token").to.be.a("string").and.have.length.above(0);
});
```

### Khuôn 2 — JSON Schema (dùng cho nhóm 04-schema)

```js
const schema = {
  type: "object",
  required: ["success", "coupon_id", "discount_amount", "final_amount", "message"],
  properties: {
    success:         { type: "boolean" },
    coupon_id:       { type: "integer" },
    discount_amount: { type: "number", minimum: 0 },
    final_amount:    { type: "number", minimum: 0 },
    message:         { type: "string" }
  },
  additionalProperties: false   // bắt field thừa - SEC/rò rỉ dữ liệu
};
pm.test("TC-COUPON-0xx: response dung schema §5.1", () => {
  pm.response.to.have.jsonSchema(schema);
});
```

`additionalProperties: false` là chỗ bắt được lỗi trả thừa dữ liệu. Đừng bỏ.

### Khuôn 3 — field **không được có** (SEC-01)

```js
pm.test("SEC-01: response khong lo mat khau va cot noi bo", () => {
  const u = pm.response.json().user || {};
  pm.expect(u, "user.password").to.not.have.property("password");
  pm.expect(u, "user.login_attempts").to.not.have.property("login_attempts");
  pm.expect(u, "user.locked_until").to.not.have.property("locked_until");
});
```

### Khuôn 4 — giá trị tính được (bắt lỗi công thức)

```js
pm.test("FR-09: SAVE10 giam dung 10% cua 500000", () => {
  const b = pm.response.json();
  pm.expect(b.discount_amount, "discount_amount").to.eql(50000);
  pm.expect(b.final_amount, "final_amount").to.eql(450000);
  pm.expect(b.final_amount, "final_amount khong duoc lon hon total").to.be.at.most(500000);
});
```

### Khuôn 5 — không lộ lỗi engine (SEC-05)

```js
pm.test("SEC-05: khong lo chi tiet engine CSDL", () => {
  pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
  const t = pm.response.text();
  ["SQLITE_", "SQLITE_ERROR", "<h1>", "at Object.", "node_modules"].forEach((s) =>
    pm.expect(t, `body khong duoc chua "${s}"`).to.not.include(s)
  );
});
```

### Khuôn 6 — decode JWT (SEC-02)

```js
pm.test("SEC-02: JWT phai co han su dung", () => {
  const tok = pm.response.json().token;
  const payload = JSON.parse(
    Buffer.from(tok.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")
  );
  pm.expect(payload, "claim exp").to.have.property("exp");
  pm.expect(payload.exp * 1000, "exp phai o tuong lai").to.be.above(Date.now());
});
```

> **Luật assertion:** assertion **không được nghiêm hơn** cột `Expected` trong bảng test case, và
> cũng **không được lỏng hơn**. Bảng và collection phải nói cùng một điều — lệch nhau là bảng của
> bạn thành trang trí. Soát lại sau khi viết xong: mở song song `audit.md` và collection.

---

## 5. Chuỗi state — cách viết cho chạy đúng thứ tự

Newman chạy request **theo thứ tự trong collection**. Ba luật:

1. **Đặt cả chuỗi trong đúng một folder** `02-state`, đánh số tên request theo thứ tự thực thi
   (`TC-COUPON-041 …`, `TC-COUPON-042 …`).
2. **Truyền dữ liệu bằng environment variable**, không hard-code:
   ```js
   // ở request tạo đơn
   pm.environment.set("order_id", pm.response.json().orderId);
   ```
   ```
   // ở request kế tiếp
   PUT {{base_url}}/api/admin/orders/{{order_id}}/status
   ```
3. **Bước bắt buộc phải xanh thì phải khẳng định rõ.** Nếu bước tạo đơn đỏ thì mọi bước sau đỏ theo
   vì môi trường, không phải vì bug. Thêm vào bước tạo:
   ```js
   if (pm.response.code !== 200) {
     console.error("[SETUP FAIL] khong tao duoc don hang - cac case sau khong con y nghia");
   }
   ```

**Không dùng `postman.setNextRequest()`** trừ khi thật cần: nó làm thứ tự chạy khác với thứ tự đọc,
và người chấm sẽ khó đối chiếu collection với bảng test case.

---

## 6. Case "chờ hết hạn khóa" — xử lý thế nào

FR-02 nói khóa **30 giây**; code khóa **180 giây**. Case *"sau khi hết hạn khóa"* nếu chờ thật sẽ
làm lượt Newman dài thêm 3 phút. Ba lựa chọn, **chọn cách 1**:

| Cách | Làm sao | Đánh giá |
|---|---|---|
| **1. Tách ra một request có delay riêng** ✅ | Đặt case này cuối folder `02-state`, dùng `--delay-request` khi chạy, hoặc chèn 1 request `GET /api/products` lặp lại kèm `setTimeout` trong pre-request | Chạy thật, bằng chứng thật, chỉ tốn thời gian |
| 2. Sửa DB trực tiếp | `UPDATE users SET locked_until = NULL` | **Không dùng** — bạn đã bỏ qua chính thứ đang test |
| 3. Bỏ case | | **Không** — đây là case FR-02 nói rõ, bỏ là thiếu phủ |

Ghi rõ trong `audit.md`: *"case này chờ thật 180s; lượt nộp có `--timeout-request 200000`"*.

---

## 7. Data-driven — §6 đòi có

§6: *"data-driven runs (the Collection Runner with a data file)"*. Làm 1 file CSV cho mỗi API, đặt ở
`postman/data/`.

Ví dụ `postman/data/coupon-cases.csv`:

```csv
code,total_amount,expected_status,expected_discount,note
SAVE10,500000,200,50000,percent hop le
SAVE10,300000,200,30000,dung bang min_order_amount - FR-09 C3 noi >=
SAVE10,299999,400,0,duoi nguong
BIGBUY,500001,200,50000,fixed hop le
EXPIRED,200000,400,0,coupon het han
KHONGTONTAI,500000,404,0,ma khong ton tai
```

Trong request dùng `{{code}}`, `{{total_amount}}`; trong assertion dùng:

```js
pm.test(`data-driven: ${pm.iterationData.get("note")}`, () => {
  pm.response.to.have.status(Number(pm.iterationData.get("expected_status")));
});
```

Chạy: **Collection Runner** → chọn folder → **Select File** → chọn CSV → **Run**.
Bằng Newman: `newman run <col> -e <env> -d postman/data/coupon-cases.csv`.

> Chụp màn hình Runner có file dữ liệu, lưu `bug-report/screenshots/postman-data-driven.png` —
> [08](08-POSTMAN-FEATURES.md) cần ảnh này.

---

## 8. Xuất collection ra file để commit

Click `…` cạnh tên collection → **Export** → **Collection v2.1** → lưu vào
`postman/collections/23127183_api-01-login.postman_collection.json`.

**Xuất lại mỗi khi sửa.** File `.json` trong repo là thứ được chấm và là thứ CI chạy, không phải
bản trong app.

---

## 9. Checklist trước khi sang [07](07-CHAY-NEWMAN-BANG-CHUNG.md)

- [ ] 3 collection, mỗi cái có pre-request script cấp collection
- [ ] Mỗi collection có đủ 6 folder, `00-setup` lưu token + mốc dữ liệu
- [ ] Tên request = TC ID
- [ ] Mọi assertion khớp đúng cột `Expected` trong `audit.md` — không nghiêm hơn, không lỏng hơn
- [ ] Chuỗi state dùng environment variable, không hard-code id
- [ ] ≥1 file CSV data-driven
- [ ] Đã Export cả 3 collection ra `postman/collections/`
- [ ] Commit: `test: 3 collection Postman + prerequest X-Student-Id`
