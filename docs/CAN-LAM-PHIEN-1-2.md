# Việc bạn cần tự làm — Phiên 1 (Setup) & Phiên 2 (Chọn API)

> Phần dòng lệnh của 2 phiên này **đã chạy xong** (xem bằng chứng ở dưới). Còn lại là thao tác
> **Postman GUI** và **hỏi nhóm** — hai việc không công cụ dòng lệnh nào làm thay được.
> Ước tính: **~20 phút**.

---

## Đã làm sẵn cho bạn (không cần làm lại)

| Việc | Kết quả |
|---|---|
| SUT đã dựng và đang chạy | `D:/Nam3/HK3/Kiểm thử phần mềm/HW06/eshop-sut/backend`, log ở `HW06/eshop-sut/sut.log`. `curl http://localhost:3000/api/products` → `200`, 5 sản phẩm |
| Newman đã cài | `npm install` trong `HW06-API-Testing/` → `newman@6.2.2` + `newman-reporter-htmlextra` (local, dùng qua `npx`) |
| `npm run preflight` | toàn bộ `OK` — SUT sống, 2 tài khoản seed đăng nhập được, 4 coupon seed tồn tại, 3 API chính phản hồi |
| `tools/run-newman.sh` | đã sửa để tự dùng `npx newman` khi không có bản `newman` global |
| `docs/api-selection.md` §2, §3 | đã điền: bảng 3 API đã chọn, lý do chọn, **28 giả thuyết bug** rút từ `server.js` kèm số dòng |

**Lưu ý về SUT:** nó đang chạy trong một tiến trình nền của phiên làm việc này. Nếu bạn tắt máy /
đóng terminal, chạy lại bằng:

```bash
cd "D:/Nam3/HK3/Kiểm thử phần mềm/HW06/eshop-sut/backend"
node server.js
```

(Mỗi lần chạy lại, DB tự `DROP` và seed sạch — đúng hành vi mong đợi, xem `docs/01-SETUP.md` §2.)

---

## 1. Postman GUI — 4 việc, ~15 phút (Phiên 1, §5–§6 của `01-SETUP.md`)

### 1.1 Cài Postman Desktop (nếu chưa có)

Tải tại https://www.postman.com/downloads/. **Phải là bản desktop** — bản web không có Postman
Console để chụp ảnh bằng chứng §11.

### 1.2 Tạo Workspace

Postman → góc trên trái **Workspaces → Create Workspace** → **Blank workspace**
→ Name: `HW06-API-Testing-23127183` → Visibility: **Personal** → **Create**.

Chụp màn hình, lưu vào:
`bug-report/screenshots/postman-workspace.png`

### 1.3 Import environment

Sidebar → **Environments** → **Import** → chọn file đã có sẵn:
`postman/environments/HW06-local.postman_environment.json`

Sau khi import, chọn environment `HW06-local-23127183` ở dropdown góc trên phải (mặc định là
"No Environment" — quên bước này thì mọi request lỗi `Thieu bien moi truong base_url`).

Kiểm nhanh 4 biến đã đúng: `base_url = http://localhost:3000` · `student_id = 23127183` ·
`admin_password = Admin123!` (secret) · `user_password = Test1234!` (secret).

### 1.4 Bật Postman Console + kiểm `X-Student-Id`

1. **View → Show Postman Console** (`Ctrl+Alt+C`) — để mở suốt trong lúc làm bài.
2. Tạo 1 request tạm: **New → HTTP Request** → tên `smoke-check` → `GET {{base_url}}/api/products`.
3. Bấm vào **tên collection cha** (không phải request) → tab **Scripts → Pre-request** → dán
   **toàn bộ** nội dung file đã có sẵn: `postman/prerequest-collection.js`.
4. **Send**.

Kiểm 2 chỗ:

- Postman Console có dòng: `[HW06] X-Student-Id = 23127183 | GET /api/products | 2026-...`
- Tab **Headers** của response request thấy `X-Student-Id: 23127183`.

Thiếu một trong hai thì dừng lại sửa ngay — đây là bằng chứng §11 sẽ bị TA kiểm trực tiếp.

**Xong 1.1–1.4** → tick nốt 3 dòng còn lại trong checklist [`01-SETUP.md`](01-SETUP.md) §7, rồi:

```bash
cd "D:/Nam3/HK3/Kiểm thử phần mềm/HW06/HW06-API-Testing"
git add -A
git commit -m "chore: setup moi truong HW06 + preflight"
git push
```

---

## 2. Hỏi nhóm — 5 phút (Phiên 2, §1 của `docs/api-selection.md`)

§5 của đề: bộ 3 API của bạn **không được trùng** với bất kỳ thành viên nào trong nhóm.

**Việc cần làm:** nhắn nhóm hỏi mỗi người đã chọn API nào cho Pool A / B / C, rồi mở
[`docs/api-selection.md`](api-selection.md), điền vào **bảng ở §1**:

```markdown
| Thành viên | Pool A | Pool B | Pool C |
|---|---|---|---|
| SV #1 | ... | ... | ... |
```

Bộ của bạn đã chốt sẵn ở §2 của file đó:

| Mã | Pool | API chính |
|---|---|---|
| API-01 | A | `POST /api/login` |
| API-02 | B | `POST /api/apply-coupon` |
| API-03 | C | `PUT /api/products/:id` |

Sau khi có bảng §1, kiểm bằng mắt: 3 endpoint chính của bạn có trùng **cả bộ 3** với ai không (chỉ
trùng 1–2 API thì vẫn hợp lệ, đề chỉ cấm trùng **nguyên bộ 3**). Điền câu "Không trùng: ..." ngay
dưới bảng §2, điền `Nhóm` và `Ngày chốt` ở đầu file.

Rồi commit:

```bash
git add docs/api-selection.md
git commit -m "docs: chot 3 API va ly do chon (§5)"
git push
```

---

## Checklist tổng

- [ ] Postman Desktop đã cài
- [ ] Workspace đã tạo, có ảnh
- [ ] Environment đã import và đang được chọn
- [ ] Pre-request script đã dán, Console in đúng dòng `X-Student-Id`
- [ ] Commit phiên 1 đã push
- [ ] Đã hỏi nhóm, bảng §1 trong `api-selection.md` đã điền
- [ ] Câu "Không trùng" + `Nhóm` + `Ngày chốt` đã điền
- [ ] Commit phiên 2 đã push

Xong hai việc trên là bạn sẵn sàng cho phiên 3 — sinh test case bằng AI theo 5 bước:
[`03-GENERATE-AI.md`](03-GENERATE-AI.md).
