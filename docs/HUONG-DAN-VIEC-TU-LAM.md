# Việc bạn phải tự làm — AI không thay được

> Danh sách này gom mọi thao tác cần **tay người**: chụp ảnh, bấm nút trên web, vẽ, quay video, đọc và ký nhận.
> Ước tính tổng: **3–4 giờ**. Xếp lịch sớm — đây là phần hay bị dồn vào đêm trước deadline.

---

## 1. Ảnh bằng chứng §11 — 3 ảnh, ~20 phút

### 1.1 Postman Console in `X-Student-Id` — **quan trọng nhất**

1. Mở Postman **desktop** (bản web không có Console).
2. Chọn environment `HW06-local-23127183` ở dropdown góc trên phải.
3. **View → Show Postman Console** (`Ctrl+Alt+C`). Kéo cửa sổ Console cho rộng.
4. Bấm **Run** trên collection `23127183_api-01-login` (Runner, không phải Send từng cái).
5. Trong Console, chờ đủ ~10 dòng `[HW06] X-Student-Id = 23127183 | POST /api/login | 2026-…`
6. **Click vào một dòng request** để bung ra → cuộn tới mục **Request Headers** → thấy
   `X-Student-Id: 23127183` và URL `http://localhost:3000/...` trả `200`.
7. Chụp toàn màn hình (`Win+Shift+S` → Window). Lưu:
   `bug-report/screenshots/postman-console-gui.png`

**Ảnh đạt yêu cầu phải thấy đồng thời:** nhiều dòng log có MSSV · một request bung ra có header ·
hostname `localhost:3000` · status `200`.

### 1.2 Header trong báo cáo Newman HTML

Mở `reports/newman/23127183_api-01-login_*.html` bằng trình duyệt → click một request →
tab **Request Headers** → chụp. Lưu `newman-request-header.png`.

### 1.3 Terminal Newman có hostname localhost

Chụp cửa sổ terminal lúc `npm run test:all` đang chạy, thấy rõ các dòng
`POST http://localhost:3000/api/login [200 OK, ...]`. Lưu `newman-cli-localhost.png`.

---

## 2. Vẽ sơ đồ generator — ~40 phút, **bắt buộc tự làm**

Chi tiết ở [11-GENERATOR-DESIGN.md](11-GENERATOR-DESIGN.md) §4. Tóm tắt:

1. Mở https://app.diagrams.net (draw.io) → **Create New Diagram** → Blank.
2. Vẽ **6 hộp giai đoạn** theo bảng §2 của guide 11, đánh số 1–6.
3. Thêm **3 hộp nguồn** ở trên GĐ1: `api_specification.md`, `FR/SEC (README)`, `server.js` —
   3 mũi tên chụm vào GĐ1.
4. Thêm **3 hình thoi quyết định** (spec có im lặng không? · case có phụ thuộc không? · đã qua 4 phép kiểm chưa?).
5. Vẽ **mũi tên quay ngược** từ GĐ6 về GĐ3.
6. Ở GĐ3 vẽ 4 nhánh song song: Domain · State · Security · Schema, mỗi nhánh ghi *"1 lượt AI riêng"*.
7. Ở GĐ5 vẽ 3 đầu ra: bảng `.md` · collection `.json` · CSV.
8. Góc dưới ghi: `HW06 §7 — AI-driven API Test Generator — 23127183 — dd/mm/2026`.
9. **File → Export as → PNG**, Zoom 200%, lưu `generator/diagram/generator-flow-selfdrawn.png`.
10. **File → Save as** → `generator/diagram/generator-flow.drawio` — **commit cả file này**, nó là
    bằng chứng bạn tự vẽ.

> Đừng nhờ AI vẽ, đừng dùng Mermaid do AI viết. §11 cấm đích danh.

---

## 3. Hai lượt CI mẫu — ~25 phút

Chi tiết ở [09-CI-CD.md](09-CI-CD.md) §5–§6.

**Lượt XANH:**
1. Push regression suite → workflow tự chạy.
2. GitHub → **Actions** → `api-tests` → mở lượt vừa chạy.
3. Chụp trang có dấu ✓ + bảng Summary. Lưu `ci-xanh.png`.
4. Copy link + hash commit (`git log -1 --format="%H %s"`).

**Lượt ĐỎ:**
1. GitHub → **Actions** → `api-tests` → **Run workflow** → `gate_mode` = **`strict`** → **Run**.
2. Đợi đỏ, mở step **Cổng đỏ/xanh**, chụp dòng `::error::`. Lưu `ci-do.png`.
3. Copy link.

---

## 4. Tạo GitHub Issues kèm ảnh — ~40 phút cho 27 bug

Chi tiết ở [10-BUG-REPORT-GITHUB-ISSUES.md](10-BUG-REPORT-GITHUB-ISSUES.md) §7.

1. Tạo trước 6 label: `bug`, `critical`, `high`, `medium`, `low`, `api-01`/`api-02`/`api-03`.
2. Với mỗi bug: **New issue** → title theo khuôn `[BUG-05][Critical][API-03] …` → dán body từ
   `bug-report/issues/BUG-05.md`.
3. **Kéo-thả file ảnh thẳng vào ô soạn** — GitHub tự upload. Đừng dùng đường dẫn tương đối.
4. Submit → copy số issue → điền cột **Issue** trong `bug-report/bug-report.md`.

> Nhanh hơn: dùng `gh issue create --body-file …` để tạo hết, rồi mở từng issue **Edit** và kéo ảnh vào.

---

## 5. Đọc và ký nhận audit — ~1 giờ

§6.2: *"You are fully responsible for the final test cases."*

Với mỗi file `test-cases/*/audit.md`:

1. Đọc **cột `Căn cứ`** của mọi dòng. Dòng nào không trỏ về `spec §` / `FR-` / `SEC-` / "đặc tả im lặng"
   → sửa ngay.
2. Đọc **cột `Expected body / schema`**. Câu nào không viết được thành `pm.test` → sửa.
3. Ký nhận cuối file:
   ```
   Đã đọc và duyệt toàn bộ N test case. Sửa M case (danh sách ở mục "Ghi chú audit").
   — SV Phạm Vũ Ngọc Duy, 23127183, ngày dd/mm/2026.
   ```

**Đừng ký nhận việc chưa làm** — §13 có vấn đáp ngẫu nhiên 30%.

---

## 6. Tự tái hiện 3 bug nặng nhất — ~20 phút

```bash
bash bug-report/verify-bugs.sh 05    # PUT /api/products/:id khong can token
bash bug-report/verify-bugs.sh 03    # cong thuc coupon sai
bash bug-report/verify-bugs.sh 08    # price tampering o checkout
```

Đọc output, tự thấy dữ liệu đổi thật. Lưu:
`bash bug-report/verify-bugs.sh > bug-report/verify-bugs-output.txt 2>&1` rồi commit.

Đây cũng là thứ bạn mở ra chạy trước mặt TA lúc vấn đáp.

---

## 7. Viết AI Critique — ~30 phút

§10 đòi **200–300 từ**, tự viết. Dàn ý và 3 chất liệu tốt nhất ở
[13-AI-AUDIT-CRITIQUE.md](13-AI-AUDIT-CRITIQUE.md) §4.

Đếm từ bằng Word hoặc https://wordcounter.net. Dưới 200 hoặc trên 300 là không đạt.

---

## 8. (Tuỳ chọn) Video demo — ~1,5 giờ

Kịch bản 12 phút ở [12-AGENT-SKILLS-VIDEO.md](12-AGENT-SKILLS-VIDEO.md) §3. Nhớ:
YouTube **Unlisted** (không phải Private), giọng tiếng Việt, và phải có Postman Console + terminal
Newman + sơ đồ tự vẽ lọt khung hình.

---

## 9. Bảng theo dõi

| # | Việc | Thời gian | Xong? |
|---|---|--:|---|
| 1 | 3 ảnh bằng chứng §11 | 20' | ☐ |
| 2 | Vẽ sơ đồ generator + export PNG + commit `.drawio` | 40' | ☐ |
| 3 | 2 lượt CI mẫu + 2 ảnh + 2 link | 25' | ☐ |
| 4 | Tạo GitHub Issues kèm ảnh | 40' | ☐ |
| 5 | Đọc + ký nhận 3 file `audit.md` | 60' | ☐ |
| 6 | Tự tái hiện 3 bug nặng nhất | 20' | ☐ |
| 7 | Viết AI Critique 200–300 từ | 30' | ☐ |
| 8 | (tuỳ chọn) Video demo | 90' | ☐ |
