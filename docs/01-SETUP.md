# 01 — Setup môi trường: SUT, Postman, Newman, repo

> Xong file này bạn phải có: SUT chạy ở `http://localhost:3000`, `npm run preflight` xanh hết,
> Postman đã tạo workspace + environment, Newman gõ `newman --version` ra số.
> **Commit:** `chore: setup moi truong HW06 + preflight`

> **Trạng thái:** phần dòng lệnh (§1–§4) **đã chạy xong** trong phiên dựng khung — SUT đang chạy nền
> ở `http://localhost:3000`, `npm run preflight` đã xanh hết. Phần còn lại (§5, §6) là thao tác
> **Postman GUI, bạn phải tự làm** — xem checklist gộp ở
> [`TRANG-THAI-HOAN-THANH.md`](TRANG-THAI-HOAN-THANH.md).

---

## 1. Cài đặt — danh sách tối thiểu

| Phần mềm | Phiên bản | Kiểm bằng lệnh | Ghi chú |
|---|---|---|---|
| Node.js | ≥ 18 (khuyên 20 LTS) | `node -v` | cần `fetch` sẵn có cho `tools/preflight.mjs` |
| Postman Desktop | bản mới nhất | mở app | **phải là bản desktop**, không dùng web — bản web không có Postman Console để chụp ảnh §11 |
| Newman | ≥ 6 | `npx newman --version` | cài **local** qua `npm install` trong repo (đã làm — xem `package.json`), không cần cài global |
| Git | bất kỳ | `git --version` | |
| Python + openpyxl | 3.x | `python --version` | chỉ để xuất Excel ở [14](14-EXCEL-TEST-CASES.md) |

**Đã làm:** `node -v` → `v22.16.0` · `npm install` trong `HW06-API-Testing/` đã cài `newman@6.2.2` +
`newman-reporter-htmlextra` local · `tools/run-newman.sh` tự dùng `npx newman` khi không có bản global.
Nếu muốn gõ tắt `newman ...` thay vì `npx newman ...`, cài thêm global:

```bash
npm i -g newman newman-reporter-htmlextra
```

---

## 2. Lấy SUT về và chạy backend

SUT **không** commit vào repo bài làm (`.gitignore` đã chặn `eshop-sut/`). Đặt nó **cạnh** repo bài làm:

```bash
cd "D:/Nam3/HK3/Kiểm thử phần mềm/HW06"
git clone https://github.com/ttbhanh/eshop-sut.git eshop-sut
cd eshop-sut/backend
npm install
node server.js
```

Thấy dòng này là được:

```
Connected to database
Database initialized and seeded (Phase 2).
Server is running on http://localhost:3000
```

> **Nhớ kỹ:** mỗi lần `node server.js` là DB bị `DROP TABLE` rồi seed lại (`database.js:15-20`).
> Đây là **cách reset trạng thái** rẻ nhất của bài này — dùng nó mỗi khi test làm bẩn dữ liệu, và
> **bắt buộc dùng trước mỗi lượt Newman chính thức** để số liệu tái lập được.

Kiểm nhanh bằng trình duyệt: mở `http://localhost:3000/api/products` phải thấy 5 sản phẩm JSON.

> **Đã làm:** SUT đang chạy tại `D:/Nam3/HK3/Kiểm thử phần mềm/HW06/eshop-sut/backend` (copy từ
> `eshop-sut-main` đã có sẵn `node_modules`, tương đương `git clone` + `npm install`), chạy nền bằng
> `node server.js`, log ở `HW06/eshop-sut/sut.log`. `curl http://localhost:3000/api/products` trả
> `200`. **Muốn khởi động lại (reset DB):** đóng terminal đang chạy nó rồi mở terminal mới, `cd` vào
> thư mục đó, chạy lại `node server.js` — nhớ đúng thứ tự này trước mỗi lượt Newman chính thức
> (§5 của [07](07-CHAY-NEWMAN-BANG-CHUNG.md)).

---

## 3. Dữ liệu seed — học thuộc bảng này

Lấy trực tiếp từ `eshop-sut/backend/database.js:88-111`.

| Loại | Giá trị |
|---|---|
| Admin | `admin@eshop.com` / `Admin123!` · `role = 'admin'` |
| User thường | `test@eshop.com` / `Test1234!` · `role = 'user'` |
| Danh mục | 3 danh mục, `id` 1–3 |
| Sản phẩm | `id` 1–5: iPhone 15 Pro Max (30tr) · Samsung S24 Ultra (28tr) · MacBook Pro M3 (45tr) · AirPods Pro 2 (6tr) · Keychron Q1 (4tr) |

**Coupon** (`coupons`):

| Mã | Loại | `discount_value` | `min_order_amount` | `expired_at` | `max_uses_per_user` |
|---|---|--:|--:|---|--:|
| `SAVE10` | percent | 10 | 300.000 | 2099-12-31 | 1 |
| `BIGBUY` | fixed | 50.000 | 500.000 | 2099-12-31 | 1 |
| `VIP100` | fixed | 100.000 | 300.000 | 2099-12-31 | **2** |
| `EXPIRED` | percent | 20 | 100.000 | **2020-01-01** | 1 |

Bốn mã này là **toàn bộ chất liệu domain partition của API-02**. `VIP100` có 2 lượt nên đây là mã
duy nhất kiểm được ranh giới *lượt 1 (được) → lượt 2 (được) → lượt 3 (phải bị chặn)*.

---

## 4. Repo bài làm

Repo đã dựng sẵn khung tại `HW06/HW06-API-Testing`, remote `https://github.com/DuyPham111/HW06.git`.

```bash
cd "D:/Nam3/HK3/Kiểm thử phần mềm/HW06/HW06-API-Testing"
npm install          # cài newman + htmlextra vào devDependencies (tuỳ chọn nếu đã cài global)
npm run preflight    # SUT sống chưa? tài khoản seed còn không? 3 API có phản hồi không?
```

> **Đã làm — kết quả thật:**
> ```
> [preflight] SUT = http://localhost:3000
>   OK   SUT song - 5 san pham trong DB
>   OK   login admin (admin@eshop.com) -> token, role=admin
>   OK   login user (test@eshop.com) -> token, role=user
>   OK   coupon SAVE10 ton tai (HTTP 200)
>   OK   coupon BIGBUY ton tai (HTTP 200)
>   OK   coupon VIP100 ton tai (HTTP 200)
>   OK   coupon EXPIRED ton tai (HTTP 400)
>   OK   POST /api/login phan hoi HTTP 401
>   OK   POST /api/apply-coupon phan hoi HTTP 400
>   OK   PUT  /api/products/:id phan hoi HTTP 200
> [preflight] San sang.
> ```
> Dòng cuối cùng (`PUT /api/products/:id` với id không tồn tại trả **200** thay vì 404) trùng đúng
> giả thuyết **A3-7** đã ghi ở [`docs/api-selection.md`](api-selection.md) — dấu hiệu sớm của một bug,
> chưa phải kết luận (phải test case thật + assertion thật mới tính).

`preflight` phải in ra toàn `OK`. Ba lỗi hay gặp:

| Thông báo | Nguyên nhân | Cách xử lý |
|---|---|---|
| `SUT khong phan hoi tai http://localhost:3000` | chưa chạy `node server.js` | mở terminal khác chạy backend |
| `tai khoan admin DANG BI KHOA` | lượt test trước đã đăng nhập sai nhiều lần | **restart backend** — DB seed lại, `locked_until` về NULL |
| `coupon seed thieu: SAVE10` | DB cũ từ phiên bản SUT khác | xóa `backend/database.sqlite` rồi chạy lại `node server.js` |

---

## 5. Postman: workspace + environment + import pre-request

§6 đòi *"Exercise as many Postman features as you reasonably can"* và §14 đòi liệt kê chúng. Bắt đầu
từ 3 feature nền, các feature còn lại thêm dần ở [08](08-POSTMAN-FEATURES.md).

### 5.1 Tạo Workspace

Postman → góc trên trái **Workspaces → Create Workspace** → chọn **Blank workspace**
→ Name: `HW06-API-Testing-23127183` → Visibility: **Personal** → **Create**.

> Chụp màn hình workspace ngay bây giờ, lưu `bug-report/screenshots/postman-workspace.png`.
> [08](08-POSTMAN-FEATURES.md) sẽ cần ảnh này để chứng minh feature "workspaces".

### 5.2 Import environment

Sidebar → **Environments** → nút **Import** → chọn file
`postman/environments/HW06-local.postman_environment.json` → **Import**.

Sau khi import, bấm vào environment `HW06-local-23127183`, kiểm 4 biến sau:

| Biến | Giá trị | Type |
|---|---|---|
| `base_url` | `http://localhost:3000` | default |
| `student_id` | `23127183` | default |
| `admin_password` | `Admin123!` | **secret** |
| `user_password` | `Test1234!` | **secret** |

Rồi **chọn environment này** ở dropdown góc trên phải (mặc định là "No Environment" — quên bước này
thì mọi request lỗi `Thieu bien moi truong base_url`, đúng như pre-request script chặn).

### 5.3 Bật Postman Console

**View → Show Postman Console** (hoặc `Ctrl+Alt+C`). Cửa sổ này là **bằng chứng §11**. Để nó mở
suốt trong lúc làm bài — bạn sẽ chụp nó ở [07](07-CHAY-NEWMAN-BANG-CHUNG.md) §4.

---

## 6. Kiểm tra `X-Student-Id` hoạt động — làm ngay, đừng để cuối

Tạo tạm 1 request để chắc chắn cơ chế header chạy đúng trước khi dựng 100+ request.

1. Trong workspace → **New → HTTP Request**, đặt tên `smoke-check`.
2. Method `GET`, URL `{{base_url}}/api/products`.
3. Bấm vào **collection cha** (không phải request) → tab **Scripts → Pre-request** → dán **toàn bộ**
   nội dung `postman/prerequest-collection.js`.
4. **Send**.

Kiểm hai chỗ:

- **Postman Console** phải có dòng: `[HW06] X-Student-Id = 23127183 | GET /api/products | 2026-...`
- Trong panel response → tab **Headers** của request (nút *"N headers"* cạnh URL, hoặc mở Console rồi
  bung request) → phải thấy `X-Student-Id: 23127183`.

Thiếu một trong hai thì dừng lại sửa ngay — §11 sẽ kiểm đúng hai thứ này.

---

## 7. Checklist kết thúc phiên 1

- [x] `node -v` ≥ 18 (`v22.16.0`), `npx newman --version` ra số (`6.2.2`)
- [x] SUT chạy, `http://localhost:3000/api/products` trả 5 sản phẩm
- [x] `npm run preflight` toàn `OK`
- [ ] **Workspace** `HW06-API-Testing-23127183` đã tạo, có ảnh chụp — *(bạn tự làm, xem §5.1)*
- [ ] **Environment** đã import và **đang được chọn** trong Postman GUI — *(bạn tự làm, xem §5.2 — file `.json` đã có sẵn ở `postman/environments/`)*
- [ ] **Pre-request script** đã dán vào collection thật + Console in dòng `X-Student-Id` — *(bạn tự làm, xem §6 — nội dung script đã viết sẵn ở `postman/prerequest-collection.js`, chỉ cần copy-dán)*
- [ ] Commit: `chore: setup moi truong HW06 + preflight`

Ba việc còn lại (☐) là thao tác **Postman GUI**, không có công cụ dòng lệnh nào làm thay được.
Checklist chi tiết từng bước: [`TRANG-THAI-HOAN-THANH.md`](TRANG-THAI-HOAN-THANH.md).

Ghi lượt AI (nếu có hỏi AI ở phiên này) vào `ai-audit/ai-audit-report.md` theo mẫu ở [13](13-AI-AUDIT-CRITIQUE.md).
