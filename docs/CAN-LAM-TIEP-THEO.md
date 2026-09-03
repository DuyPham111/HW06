# Việc bạn cần tự làm — từ phiên 3 trở đi

> Toàn bộ phần dòng lệnh (§6.1–§6.5, §9, §12, §14) **đã làm xong và đã push lên GitHub**; sơ đồ
> generator bạn đã tự vẽ, và **video demo §7 đã quay xong** — xem tóm tắt ở §0.
> **Tự chấm hiện tại: 100/100.**
>
> **A.5 và A.6 đã xong** — ảnh 2 lượt CI đã chèn vào `ci/ci-report.md`, ảnh trang Issues đã chèn vào
> `bug-report/bug-report.md`. Còn **2 việc**:
>
> | | Việc | Bắt buộc? |
> |---|---|---|
> | A.4b | Đính ảnh cho **4 issue còn lại**: #1, #2, #10, #13 (23/27 đã có ảnh) | theo câu chữ §11 |
> | B.3 | Xuất PDF 6 file | **§14 — bắt buộc** |
>
> Ước tính: **~30 phút**. §17 ghi *"Missing any required document results in 0 points"* nên đừng bỏ PDF.

---

## 0. Đã làm xong (không cần làm lại)

| Việc | Kết quả |
|---|---|
| 3 API × pipeline §6.1–§6.5 | 158 test case (138 AI + 20 SV), 3 collection Postman, chạy Newman thật |
| Bug report | 27 bug, mỗi bug có `curl` tái hiện độc lập trong `bug-report/verify-bugs.sh` (đã chạy thật, output ở `verify-bugs-output.txt`) |
| Regression suite | chạy thật **112 request / 112 assertion / 0 đỏ**, khớp nhau cả local lẫn CI |
| CI/CD | 2 lượt mẫu **đã chạy thật** trên GitHub Actions: [XANH](https://github.com/DuyPham111/HW06/actions/runs/33649674605) · [ĐỎ](https://github.com/DuyPham111/HW06/actions/runs/33363180896) — kèm 1 sự cố CI thật đã tự phát hiện + sửa (xem `ci/ci-report.md` §5) |
| AI Audit Report + Critique | 14 log thật + critique 294 từ |
| **Video demo Agent Skill (§7)** | ✅ **đã xong** — https://www.youtube.com/watch?v=I8-LSwX6y5s |
| Excel | `excel/23127183_HW06_TestCases.xlsx`, 5 sheet, 158 case |
| Generator | thiết kế 6 giai đoạn + pseudocode + **đã hiện thực chạy thật** (`tools/gen-artifacts.mjs`) |
| Agent Skills | 4 skill trong `.claude/skills/` |
| File issue cho GitHub | 27 file soạn sẵn ở `bug-report/issues/BUG-XX.md`, chỉ cần copy-paste |
| Data-driven CSV | 3 file thật trong `postman/data/` |
| README, main-report, ci-report, api-selection | đã điền số liệu thật, không còn placeholder |
| Git commit log | `git-log/commit-log.txt`, 24+ commit |
| **A.1 — Sơ đồ generator tự vẽ** | ✅ **đã xong** — bạn vẽ trên draw.io, có ảnh + `.drawio`, đã commit vào `generator/diagram/` |

**Tự chấm hiện tại: 100/100** (xem `README.md` §3).

---

## A. Bằng chứng bắt buộc theo câu chữ đề (không đổi điểm 4 tiêu chí chính)

### A.2 — Đọc lại và ký tên 3 file `audit.md` (§6.2 — *"You are fully responsible"*)

AI đã audit và sửa lỗi dựa trên kết quả Newman thật (xem log ở mỗi file), nhưng đề đòi **chính bạn**
chịu trách nhiệm cuối cùng. Mở 3 file, đọc phần "Ghi chú audit" (không cần đọc lại toàn bộ 158 dòng
bảng), rồi thêm dòng ký tên thật ở cuối mỗi file (đổi phần đã viết sẵn):

- [`test-cases/api-01-login/audit.md`](../test-cases/api-01-login/audit.md)
- [`test-cases/api-02-apply-coupon/audit.md`](../test-cases/api-02-apply-coupon/audit.md)
- [`test-cases/api-03-product-update/audit.md`](../test-cases/api-03-product-update/audit.md)

```markdown
Đã đọc và duyệt toàn bộ N test case... — SV Phạm Vũ Ngọc Duy, 23127183, ngày dd/mm/2026.
```

### A.3 — Tự tay tái hiện 3 bug nặng nhất (chuẩn bị vấn đáp §13)

```bash
# SUT phải đang chạy (node server.js trong eshop-sut/backend)
bash bug-report/verify-bugs.sh 19   # BUG-19: sap toan bo backend - RESTART SUT SAU KHI CHAY
bash bug-report/verify-bugs.sh 10   # BUG-10: cong thuc coupon am
bash bug-report/verify-bugs.sh 03   # BUG-03: lo password plaintext
```

Đọc output, tự thấy dữ liệu/hành vi sai thật. Đây là thứ bạn cần chạy được **tại chỗ** nếu bị gọi
vấn đáp (30% sinh viên, §13).

### A.4 — Thêm ảnh minh hoạ vào 27 GitHub Issue đã tạo (§6.5, §11 đòi *"screenshot attached to each issue"*)

✅ **27/27 issue đã tạo** qua `gh` CLI — https://github.com/DuyPham111/HW06/issues (#1–#27, đúng
title + label + nội dung khớp `bug-report.md`).

> **Trạng thái: 23/27 issue đã có ảnh.** Kiểm bằng cách đọc body từng issue qua `gh`, không đếm tay.
> Còn đúng **4 issue** chưa đính ảnh — và 3 trong số đó là **nhóm đặc biệt** không có mục trong
> "Failed Tests", nên phải dùng ảnh **terminal** chứ không phải ảnh báo cáo HTML:
>
> | Issue | Bug | Vì sao chưa có | Chụp gì thay thế |
> |---|---|---|---|
> | [#1](https://github.com/DuyPham111/HW06/issues/1) | BUG-19 | không chạy trong Newman (làm sập SUT) | terminal chạy `bash bug-report/verify-bugs.sh 19` |
> | [#2](https://github.com/DuyPham111/HW06/issues/2) | BUG-01 | 0 assertion đỏ — *pass* nghĩa là khai thác thành công | terminal chạy `bash bug-report/verify-bugs.sh 01` |
> | [#10](https://github.com/DuyPham111/HW06/issues/10) | BUG-09 | 0 đỏ — bug chỉ lộ khi **so sánh** 2 case | terminal chạy `bash bug-report/verify-bugs.sh` (phần BUG-09) |
> | [#13](https://github.com/DuyPham111/HW06/issues/13) | BUG-12 | bị sót — bug này **có** trong Failed Tests | `23127183_api-02-apply-coupon_*.html` → `Ctrl+F` `TC-COUPON-004` |
>
> Ba issue đầu chụp cửa sổ terminal sao cho thấy **lệnh đã gõ + output có dòng sai**. Riêng #1 nhớ
> **khởi động lại SUT** sau khi chạy vì bug đó làm chết tiến trình Node.

**Việc còn lại — kéo-thả ảnh vào từng issue.** GitHub không có cách nào upload ảnh vào issue qua
API/CLI (chỉ kéo-thả được trên web), nên đây là phần bắt buộc phải làm tay. Chỉ có **4 file HTML**
trong `reports/newman/` (1 file/API + regression) vì mỗi file chứa **tất cả** request của API đó,
kể cả các request bị lỗi (bug) — không phải 1 file/bug. Cách lấy đúng ảnh cho đúng issue:

#### Bước chung — mở 1 file báo cáo và tìm đúng lỗi (làm 1 lần, lặp lại cho từng bug)

1. Mở **File Explorer**, vào `D:\Nam3\HK3\Kiểm thử phần mềm\HW06\HW06-API-Testing\reports\newman\`.
2. **Double-click** đúng file HTML theo API của bug (xem cột "File" ở bảng dưới) — file tự mở bằng
   trình duyệt mặc định (Chrome/Edge), không cần cài gì thêm.
3. Trên đầu trang, bấm tab màu đỏ **"Failed Tests"** (cạnh "Summary" và "Total Requests").
4. Bấm nút **"Expand All Failed Tests"** — toàn bộ lỗi hiện ra thành từng thẻ đỏ, mỗi thẻ có dòng
   tiêu đề **"Failed Test: TC-XXX-### ..."** và khung **"ASSERTION ERROR MESSAGE"** bên dưới.
5. Bấm `Ctrl+F` (tìm trên trang), gõ đúng **TC ID** ghi ở cột "Tìm gì" trong bảng dưới → trình duyệt
   nhảy tới đúng thẻ.
6. **Chụp màn hình đúng thẻ đó** (tiêu đề `Failed Test: ...` + khung `ASSERTION ERROR MESSAGE`) —
   dùng `Win+Shift+S` (Snipping Tool), kéo khung quanh đúng thẻ.
7. Quay lại tab GitHub Issue tương ứng (link ở cột "Issue") → bấm **Edit** (biểu tượng bút chì góc
   trên phải nội dung issue, hoặc kéo xuống ô "Add a comment") → **kéo-thả** ảnh vừa chụp vào ô soạn
   → **Save**/**Comment**.

#### Bảng tra cứu — 27 dòng, làm lần lượt từ trên xuống

| Issue | Bug | File cần mở | Tìm gì (Ctrl+F) |
|---|---|---|---|
| [#2](https://github.com/DuyPham111/HW06/issues/2) | BUG-01 | *(không có trong Failed Tests — xem "3 bug đặc biệt" bên dưới)* | — |
| [#3](https://github.com/DuyPham111/HW06/issues/3) | BUG-02 | `23127183_api-01-login_*.html` | `TC-LOGIN-022` |
| [#4](https://github.com/DuyPham111/HW06/issues/4) | BUG-03 | `23127183_api-01-login_*.html` | `TC-LOGIN-028` |
| [#5](https://github.com/DuyPham111/HW06/issues/5) | BUG-04 | `23127183_api-01-login_*.html` | `TC-LOGIN-029` |
| [#6](https://github.com/DuyPham111/HW06/issues/6) | BUG-05 | `23127183_api-01-login_*.html` | `TC-LOGIN-030` |
| [#7](https://github.com/DuyPham111/HW06/issues/7) | BUG-06 | `23127183_api-01-login_*.html` | `TC-LOGIN-016` |
| [#8](https://github.com/DuyPham111/HW06/issues/8) | BUG-07 | `23127183_api-01-login_*.html` | `TC-LOGIN-036` |
| [#9](https://github.com/DuyPham111/HW06/issues/9) | BUG-08 | `23127183_api-01-login_*.html` | `TC-LOGIN-103` |
| [#10](https://github.com/DuyPham111/HW06/issues/10) | BUG-09 | *(không có trong Failed Tests — xem "3 bug đặc biệt" bên dưới)* | — |
| [#11](https://github.com/DuyPham111/HW06/issues/11) | BUG-10 | `23127183_api-02-apply-coupon_*.html` | `TC-COUPON-001` |
| [#12](https://github.com/DuyPham111/HW06/issues/12) | BUG-11 | `23127183_api-02-apply-coupon_*.html` | `TC-COUPON-031` |
| [#13](https://github.com/DuyPham111/HW06/issues/13) | BUG-12 | `23127183_api-02-apply-coupon_*.html` | `TC-COUPON-004` |
| [#14](https://github.com/DuyPham111/HW06/issues/14) | BUG-13 | `23127183_api-02-apply-coupon_*.html` | `TC-COUPON-036` |
| [#15](https://github.com/DuyPham111/HW06/issues/15) | BUG-14 | `23127183_api-02-apply-coupon_*.html` | `TC-COUPON-034` |
| [#16](https://github.com/DuyPham111/HW06/issues/16) | BUG-15 | `23127183_api-02-apply-coupon_*.html` | `TC-COUPON-033` |
| [#17](https://github.com/DuyPham111/HW06/issues/17) | BUG-16 | `23127183_api-02-apply-coupon_*.html` | `TC-COUPON-023` |
| [#18](https://github.com/DuyPham111/HW06/issues/18) | BUG-17 | `23127183_api-02-apply-coupon_*.html` | `TC-COUPON-028` |
| [#19](https://github.com/DuyPham111/HW06/issues/19) | BUG-18 | `23127183_api-02-apply-coupon_*.html` | `TC-COUPON-032` |
| [#1](https://github.com/DuyPham111/HW06/issues/1) | BUG-19 | *(không có trong Failed Tests — xem "3 bug đặc biệt" bên dưới)* | — |
| [#20](https://github.com/DuyPham111/HW06/issues/20) | BUG-20 | `23127183_api-03-product-update_*.html` | `TC-PRODUPD-022` |
| [#21](https://github.com/DuyPham111/HW06/issues/21) | BUG-21 | `23127183_api-03-product-update_*.html` | `TC-PRODUPD-027` |
| [#22](https://github.com/DuyPham111/HW06/issues/22) | BUG-22 | `23127183_api-03-product-update_*.html` | `TC-PRODUPD-029` |
| [#23](https://github.com/DuyPham111/HW06/issues/23) | BUG-23 | `23127183_api-03-product-update_*.html` | `TC-PRODUPD-002` |
| [#24](https://github.com/DuyPham111/HW06/issues/24) | BUG-24 | `23127183_api-03-product-update_*.html` | `TC-PRODUPD-015` |
| [#25](https://github.com/DuyPham111/HW06/issues/25) | BUG-25 | `23127183_api-03-product-update_*.html` | `TC-PRODUPD-014` |
| [#26](https://github.com/DuyPham111/HW06/issues/26) | BUG-26 | `23127183_api-03-product-update_*.html` | `TC-PRODUPD-039` |
| [#27](https://github.com/DuyPham111/HW06/issues/27) | BUG-27 | `23127183_api-03-product-update_*.html` | `TC-PRODUPD-045` |

> `*` trong tên file là phần ngày giờ (`_20260902-222409` v.v.) — chỉ có đúng 1 file mỗi API nên gõ
> vài ký tự đầu trong File Explorer là lọc ra ngay.

#### 3 bug đặc biệt — KHÔNG có trong "Failed Tests" (dùng ảnh terminal thay vì ảnh HTML)

Ba bug này được chứng minh bằng **request PASS** (đúng như thiết kế — assertion khớp với hành vi
khai thác được) hoặc **không hề chạy trong Newman**, nên không xuất hiện ở tab "Failed Tests". Dùng
lại kết quả bạn đã chạy ở mục A.3:

| Issue | Bug | Lấy ảnh từ đâu |
|---|---|---|
| [#2](https://github.com/DuyPham111/HW06/issues/2) | BUG-01 | Chạy `bash bug-report/verify-bugs.sh 01` → chụp toàn bộ terminal, thấy rõ 3 request và dòng cuối trả về `403 "Tài khoản đã bị khóa"` dù mật khẩu đúng |
| [#10](https://github.com/DuyPham111/HW06/issues/10) | BUG-09 | Chạy `bash bug-report/verify-bugs.sh 02` (chuỗi khóa) — chụp 2 dòng cuối cho thấy request thứ 3 trả `403`, so với email không tồn tại luôn trả `401` (đối chiếu bằng lời trong caption ảnh nếu cần) |
| [#1](https://github.com/DuyPham111/HW06/issues/1) | BUG-19 | Chạy `bash bug-report/verify-bugs.sh 19` (⚠️ **làm sập SUT thật** — restart lại sau khi chụp: `cd eshop-sut/backend && node server.js`) → chụp toàn bộ terminal thấy dòng `KHONG KET NOI DUOC - SUT DA SAP`, hoặc chụp cửa sổ terminal đang chạy `node server.js` lúc nó in stack trace crash |

Nếu chưa chạy các lệnh trên, mở terminal tại `HW06/HW06-API-Testing`, chạy lệnh tương ứng, rồi chụp
`Win+Shift+S` như bình thường.

#### Nếu thiếu thời gian — làm tối thiểu 5 bug này trước

`#2 (BUG-01)` · `#4 (BUG-03)` · `#11 (BUG-10)` · `#15 (BUG-14)` · `#1 (BUG-19)` — đủ đại diện cả 3
API và đủ 2 kiểu bằng chứng (ảnh HTML report + ảnh terminal).

> Tối thiểu để không bị 0 điểm §6.5: đã có `bug-report/bug-report.md` **và** 27 issue thật trên
> GitHub (đạt cả 2 vế *"both in the Markdown report and on your GitHub Issues page"*). Phần ảnh là
> để đạt trọn §11 (*"screenshot attached to each issue"*), nên đừng bỏ qua nếu còn thời gian.

---

### A.5 — Ảnh chụp 2 lượt CI — ✅ ĐÃ XONG

`ci/screenshots/ci-run-xanh.png` + `ci-run-do.png`, đã chèn vào `ci/ci-report.md` §2 và §3.
Đã đối chiếu: ảnh xanh đúng run `33649674605` / commit `72654a3` / Status **Success**; ảnh đỏ đúng
run `33363180896` / commit `5d102c1` / Status **Failure** — khớp bảng trong báo cáo.

### A.6 — Ảnh trang GitHub Issues — ✅ ĐÃ XONG

3 ảnh trong `bug-report/screenshots/`: `github-issues-list.png` (thấy rõ **Open 27** + nhãn mức độ),
`github-issue-bug-19.png` (#1), `github-issue-bug-10.png` (#11). Đã chèn vào `bug-report/bug-report.md`
phần đầu và trong mục BUG-19, BUG-10.

---

## B. Khuyến khích / bằng chứng bổ sung (không bắt buộc để đủ 4 tiêu chí chính)

### B.1 — Postman GUI: chạy data-driven, tạo Mock Server + Monitor (§6, liệt kê Postman feature)

> Làm trong app **Postman Desktop** (không phải trình duyệt). Nếu chưa cài: tải tại
> https://www.postman.com/downloads/. Nếu đã cài nhưng chưa mở lại từ lúc dựng workspace ban đầu,
> mở app lên — workspace `HW06-API-Testing-23127183` bạn tạo trước đó vẫn còn ở sidebar bên trái.

#### Bước 0 — Bật SUT (bắt buộc, nếu chưa chạy)

Mở PowerShell/terminal, chạy:

```bash
cd "D:/Nam3/HK3/Kiểm thử phần mềm/HW06/eshop-sut/backend"
node server.js
```

Thấy dòng `Server is running on http://localhost:3000` là được — **để cửa sổ này chạy nền**, đừng
tắt trong lúc làm phần dưới.

#### Bước 1 — Import environment (nếu Postman đang để "No environment")

1. Trong Postman, sidebar trái → click **Environments**.
2. Nếu **không thấy** `HW06-local-23127183` trong danh sách: bấm nút **Import** (góc trên trái) →
   **Choose Files** → chọn file:
   `D:\Nam3\HK3\Kiểm thử phần mềm\HW06\HW06-API-Testing\postman\environments\HW06-local.postman_environment.json`
   → **Import**.
3. Ở **góc trên phải** màn hình Postman, có 1 dropdown (mặc định ghi "No Environment") → bấm vào →
   chọn **HW06-local-23127183**. **Bước này hay bị quên** — quên là mọi request lỗi ngay.

#### Bước 2 — Import 4 collection (nếu chưa import)

1. Sidebar trái → click **Collections**.
2. Nếu **không thấy** các collection tên `23127183_api-01-login`, `23127183_api-02-apply-coupon`,
   `23127183_api-03-product-update`, `23127183_regression`: bấm **Import** → **Choose Files** →
   chọn **cả 4 file cùng lúc** (giữ `Ctrl` để chọn nhiều) trong thư mục:
   `D:\Nam3\HK3\Kiểm thử phần mềm\HW06\HW06-API-Testing\postman\collections\`
   → **Import**.
3. Giờ sidebar **Collections** phải hiện đủ 4 collection, mỗi cái mở ra thấy các folder con
   `00-setup`, `01-domain`, `02-state`, `03-security`, `04-schema`.

#### Bước 3 — Chạy data-driven

> **Đã đổi cách làm:** Postman gần đây **khóa tính năng "Datasets and data files" của Runner vào gói
> trả phí** (bảng "Upgrade to use datasets and data files" hiện ra khi bấm chọn file CSV) — **đừng
> nâng cấp trả phí**, không cần thiết cho bài này. Dùng **Newman CLI** thay thế: cùng cơ chế
> data-driven, miễn phí hoàn toàn, và §8 của đề liệt kê Newman ngang hàng với Postman GUI.

✅ **Đã chạy thật sẵn cho anh** — kết quả: 10 vòng lặp theo đúng 10 dòng
`postman/data/coupon-cases.csv`, 10 assertion, **1 đỏ** (bắt đúng **BUG-12**: `total_amount` bằng
đúng `min_order_amount` bị từ chối sai theo FR-09 C3). Báo cáo đã lưu ở
`reports/newman/23127183_data-driven-demo.html`.

**Việc bạn cần làm — chỉ chụp ảnh:**

1. Mở file `D:\Nam3\HK3\Kiểm thử phần mềm\HW06\HW06-API-Testing\reports\newman\23127183_data-driven-demo.html`
   bằng trình duyệt (double-click trong File Explorer).
2. Trang này hiện **10 iteration** (Iteration 1/10 → 10/10), mỗi iteration là 1 dòng CSV chạy qua
   request `POST /api/apply-coupon`. Cuộn xem tổng quan, hoặc bấm tab **"Failed Tests"** để thấy
   ngay assertion đỏ của BUG-12.
3. **Chụp màn hình** phần đầu trang (thấy rõ dòng `TOTAL ITERATIONS: 10`) → lưu
   `bug-report/screenshots/postman-data-driven.png`.

**Nếu muốn tự chạy lại** (không bắt buộc, file đã có sẵn rồi):

```bash
cd "D:/Nam3/HK3/Kiểm thử phần mềm/HW06/HW06-API-Testing"
npx newman run postman/collections/23127183_data-driven-demo.postman_collection.json \
  -e postman/environments/HW06-local.postman_environment.json \
  -d postman/data/coupon-cases.csv \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export reports/newman/23127183_data-driven-demo.html
```

> `postman/collections/23127183_data-driven-demo.postman_collection.json` là 1 collection nhỏ
> (1 request) dựng riêng để minh hoạ tính năng này — tách khỏi 4 collection chính (không đụng tới bộ
> test đã chạy chính thức).

#### Bước 4 — Tạo Mock Server (minh hoạ bằng đúng bug công thức coupon, BUG-10)

1. Mở collection `23127183_api-02-apply-coupon` → mở folder `01-domain` → click vào request
   `TC-COUPON-001` (case SAVE10/500.000 — đang đỏ vì SUT tính sai).
2. Bên phải khung **Send**, tìm tab **Examples** (nằm cạnh nút Send/Save) → bấm **Add Example**.
3. Đặt tên ví dụ: `FR-09 dung dac ta`. Ở phần **Response**:
   - **Status**: `200 OK`
   - **Body** (raw, JSON):
     ```json
     { "success": true, "coupon_id": 1, "discount_amount": 50000, "final_amount": 450000, "message": "Áp dụng thành công! Giảm 10%" }
     ```
   → **Save**.
4. Quay lại sidebar, rê chuột vào tên collection `23127183_api-02-apply-coupon` → `...` → **Mock
   collection**.
5. Đặt tên mock: `HW06-mock-FR09-23127183` → **Environment**: chọn "Create a new one automatically"
   hoặc để mặc định → bấm **Create Mock Server**.
6. Postman hiện 1 URL dạng `https://xxxxxxxx.mock.pstmn.io` — **copy URL này**, dán vào
   `postman/README.md` mục Mock Server (thay chỗ `_(điền)_`).
7. Vào **Environments** → tạo environment mới tên `HW06-mock-23127183` (bấm `+` cạnh "Environments")
   → thêm 1 biến `base_url` = URL mock vừa copy, và 1 biến `student_id` = `23127183`.
8. Quay lại request `TC-COUPON-001`, đổi environment (dropdown góc trên phải) sang
   `HW06-mock-23127183` → bấm **Send** → thấy response trả đúng `discount_amount: 50000` (vì đây là
   ví dụ bạn tự đặt, đúng công thức thật) → assertion (`pm.test`) của case này giờ sẽ **xanh**.
9. **Chụp màn hình** response xanh này → lưu `bug-report/screenshots/postman-mock-server.png`.
10. **Đổi environment về lại `HW06-local-23127183`** trước khi làm tiếp (quan trọng — quên bước này
    thì các request sau gọi nhầm vào mock thay vì SUT thật).

#### Bước 5 — Tạo Monitor (giám sát mock server, vì mock chạy trên cloud của Postman)

1. Sidebar → rê chuột vào collection `23127183_api-02-apply-coupon` → `...` → **Monitor collection**.
2. Tên: `HW06-monitor-FR09-23127183`. **Environment**: chọn `HW06-mock-23127183` (không chọn
   `HW06-local` — vì Postman Cloud không với tới `localhost` của bạn).
3. **Tần suất**: chọn **Weekly** (không cần chạy dày, tránh tốn quota).
4. Bấm **Create Monitor**.
5. Sau khi tạo xong, bấm nút **Run** (chạy thử ngay 1 lần) để có kết quả.
6. **Chụp màn hình** trang kết quả monitor (thấy tên monitor + 1 lượt chạy xanh) → lưu
   `bug-report/screenshots/postman-monitor.png`.

#### Bước 6 — Cập nhật lại tài liệu

Mở [`postman/README.md`](../postman/README.md) §4, điền URL mock thật + kết quả monitor thật vào
2 ô đang để `_(điền)_`. Rồi commit:

```bash
cd "D:/Nam3/HK3/Kiểm thử phần mềm/HW06/HW06-API-Testing"
git add bug-report/screenshots/postman-data-driven.png bug-report/screenshots/postman-mock-server.png bug-report/screenshots/postman-monitor.png postman/README.md
git commit -m "docs: anh Postman data-driven + Mock Server + Monitor (§6)"
git push
```

### B.2 — Video demo Agent Skill (§7) — ✅ ĐÃ XONG

https://www.youtube.com/watch?v=I8-LSwX6y5s

Link đã điền vào: `README.md` (bảng liên kết), `report/main-report.md` §10, và
`.claude/skills/demo-video-link.md`. Kịch bản gốc: [`docs/12`](12-AGENT-SKILLS-VIDEO.md) §3.

> Nhớ kiểm lại video đang để **Unlisted**, không phải Private — Private thì TA bấm vào không xem được.

### B.3 — Xuất PDF cho 6 tài liệu bắt buộc (§14 đòi cả `.md` và `.pdf`)

Không có công cụ dòng lệnh xuất PDF sẵn trên máy (đã kiểm tra: không có `pandoc`/`wkhtmltopdf`/thư
viện Python). Cách nhanh nhất — VS Code + extension **Markdown PDF**:

1. Cài extension `yzane.markdown-pdf` trong VS Code.
2. Mở từng file → `Ctrl+Shift+P` → **Markdown PDF: Export (pdf)**.

Danh sách 6 file cần xuất:

- [ ] `report/main-report.md`
- [ ] `ai-audit/ai-audit-report.md`
- [ ] `ai-audit/ai-critique.md`
- [ ] `bug-report/bug-report.md`
- [ ] `ci/ci-report.md`
- [ ] `generator/design.md`

### B.4 — Đối chiếu API với các thành viên khác trong nhóm (nếu họ phản hồi)

Hiện đang dùng ảnh báo trước trong nhóm chat làm bằng chứng chống trùng (§5 chỉ đòi *"not
duplicated"*, không đòi đúng định dạng bảng — xem `docs/api-selection.md` §1). Nếu về sau các bạn
phản hồi, điền thêm bảng đối chiếu (không bắt buộc, chỉ giúp yên tâm hơn).

---

## Checklist tổng — theo đúng thứ tự ưu tiên

- [x] **A.1** Vẽ sơ đồ generator + commit → tự chấm **100/100**
- [x] **A.2** Đọc + ký tên 3 file `audit.md`
- [x] **A.3** Tự tay chạy `verify-bugs.sh` cho ≥3 bug nặng nhất
- [x] **A.4a** Tạo 27/27 GitHub Issues (đã xong qua `gh` CLI)
- [ ] **A.4b** Đính ảnh cho 4 issue còn lại: **#1, #2, #10, #13** (23/27 đã xong)
- [x] **A.5** Ảnh 2 lượt CI → đã chèn vào `ci/ci-report.md` §2, §3
- [x] **A.6** Ảnh trang GitHub Issues → đã chèn vào `bug-report/bug-report.md`
- [x] **B.1** Data-driven + Mock Server + Monitor — cả 3 đã xong, có ảnh + số liệu thật trong `postman/README.md` §2, §4
- [x] **B.2** Video demo → https://www.youtube.com/watch?v=I8-LSwX6y5s
- [ ] **B.3** Xuất PDF 6 file
- [ ] **B.4** Bảng đối chiếu nhóm (tuỳ chọn)
- [ ] Đóng gói cuối: xem [`docs/16-DONG-GOI-CHECKLIST.md`](16-DONG-GOI-CHECKLIST.md) — kiểm đủ 13
      mục §14, đặt tên zip đúng `23127183_HW06_AI_API_100.zip`
