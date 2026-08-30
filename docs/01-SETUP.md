# 01 — Setup môi trường: SUT, Postman, Newman, repo

> Xong file này bạn phải có: SUT chạy ở `http://localhost:3000`, `npm run preflight` xanh hết,
> Postman đã tạo workspace + environment, Newman gõ `newman --version` ra số.
> **Commit:** `chore: setup moi truong HW06 + preflight`

---

## 1. Cài đặt — danh sách tối thiểu

| Phần mềm | Phiên bản | Kiểm bằng lệnh | Ghi chú |
|---|---|---|---|
| Node.js | ≥ 18 (khuyên 20 LTS) | `node -v` | cần `fetch` sẵn có cho `tools/preflight.mjs` |
| Postman Desktop | bản mới nhất | mở app | **phải là bản desktop**, không dùng web — bản web không có Postman Console để chụp ảnh §11 |
| Newman | ≥ 6 | `newman --version` | `npm i -g newman newman-reporter-htmlextra` |
| Git | bất kỳ | `git --version` | |
| Python + openpyxl | 3.x | `python --version` | chỉ để xuất Excel ở [14](14-EXCEL-TEST-CASES.md) |

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
Server running on http://localhost:3000
```

> **Nhớ kỹ:** mỗi lần `node server.js` là DB bị `DROP TABLE` rồi seed lại (`database.js:15-20`).
> Đây là **cách reset trạng thái** rẻ nhất của bài này — dùng nó mỗi khi test làm bẩn dữ liệu, và
> **bắt buộc dùng trước mỗi lượt Newman chính thức** để số liệu tái lập được.

Kiểm nhanh bằng trình duyệt: mở `http://localhost:3000/api/products` phải thấy 5 sản phẩm JSON.

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

- [ ] `node -v` ≥ 18, `newman --version` ra số
- [ ] SUT chạy, `http://localhost:3000/api/products` trả 5 sản phẩm
- [ ] `npm run preflight` toàn `OK`
- [ ] Workspace `HW06-API-Testing-23127183` đã tạo, có ảnh chụp
- [ ] Environment `HW06-local-23127183` đã import và **đang được chọn**
- [ ] Pre-request script cấp collection đã dán, Console in ra dòng `[HW06] X-Student-Id = 23127183`
- [ ] Commit: `chore: setup moi truong HW06 + preflight`

Ghi lượt AI (nếu có hỏi AI ở phiên này) vào `ai-audit/ai-audit-report.md` theo mẫu ở [13](13-AI-AUDIT-CRITIQUE.md).
