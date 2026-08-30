# `postman/data/` — file dữ liệu cho Collection Runner (data-driven, §6)

§6 gọi tên đích danh: *"data-driven runs (the Collection Runner with a data file)"*.
Làm ít nhất **1 file CSV cho mỗi API**.

## Cách dùng

**Trong Postman GUI:** Collection Runner → chọn folder → **Select File** → chọn `.csv` → **Run**.

**Bằng Newman:**

```bash
newman run postman/collections/23127183_api-02-apply-coupon.postman_collection.json \
  -e postman/environments/HW06-local.postman_environment.json \
  -d postman/data/coupon-cases.csv \
  --folder 01-domain
```

## Trong request

Cột CSV thành biến: `{{code}}`, `{{total_amount}}`. Trong assertion dùng `pm.iterationData`:

```js
pm.test(`data-driven: ${pm.iterationData.get("note")}`, () => {
  pm.response.to.have.status(Number(pm.iterationData.get("expected_status")));
});
```

## Ví dụ `coupon-cases.csv`

```csv
code,total_amount,expected_status,expected_discount,note
SAVE10,500000,200,50000,percent hop le - FR-09 cong thuc total x value / 100
SAVE10,300000,200,30000,dung bang min_order_amount - FR-09 C3 noi >=
SAVE10,299999,400,0,duoi nguong
BIGBUY,500001,200,50000,fixed hop le
VIP100,300001,200,100000,fixed - max 2 luot
EXPIRED,200000,400,0,coupon het han - FR-09 C2
KHONGTONTAI,500000,404,0,ma khong ton tai - FR-09 C1
```

## Cần có

- [ ] `coupon-cases.csv` — API-02
- [ ] `login-cases.csv` — API-01 (email/password × phân vùng)
- [ ] `product-update-fields.csv` — API-03 (name/price/category_id × phân vùng)

Chụp màn hình Runner có file dữ liệu → `bug-report/screenshots/postman-data-driven.png`
(cần cho [`docs/08-POSTMAN-FEATURES.md`](../../docs/08-POSTMAN-FEATURES.md)).
