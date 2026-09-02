# 12 — §7 Agent Skills + video demo (khuyến khích)

> Output: 4 file `.claude/skills/*/SKILL.md` (khung đã có) + link YouTube trong README.
> **Commit:** `feat: 4 Agent Skill cho pipeline HW06 (§7)`

---

## 1. Vì sao nên làm

§7: *"You are encouraged to implement it as a reusable Agent Skill and submit a demonstration video
(YouTube link) showing it generate tests for one API."*

§2 cũng nói: *"You are encouraged to build Agent Skills that can automatically perform these
activities on similar exercises."*

Tiêu chí 4 của bảng chấm là **"Agent Skills (AI-driven test generator)" — 10 điểm**. Thiết kế +
sơ đồ + pseudocode ([11](11-GENERATOR-DESIGN.md)) là phần bắt buộc; Skill là cách rẻ nhất để chứng
minh thiết kế đó **dùng được**, không chỉ nằm trên giấy. HW02 và HW05 bạn đều đã làm skill và đều 100đ.

---

## 2. Bốn skill — khung đã dựng sẵn trong `.claude/skills/`

| Skill | Phủ mục nào của đề | Việc chính |
|---|---|---|
| `api-test-design` | §6.1 | sinh test case qua **5 bước riêng** — §2 cấm prompt gộp |
| `api-test-audit` | §6.2 + §6.3 | dán nhãn VALID/INVALID/INCOMPLETE + ≥5 case AI bỏ sót và **vì sao** |
| `postman-newman` | §6.4 | dựng collection, assertion đủ mạnh, chạy Newman, cổng CI |
| `ai-audit-logger` | §9 | ghi AI Audit Report đúng 4 trường đề đòi |

Mỗi file đã có frontmatter và khung mục. Việc của bạn: **điền phần nội dung theo đúng cách bạn đã
làm thật**. Skill mô tả quy trình bạn chưa từng chạy là skill vô dụng — và TA hỏi được ở vấn đáp.

### Frontmatter — viết `description` cho đúng

```yaml
---
name: api-test-design
description: Design API test cases from an API specification, one technique step at a time — domain partitions on every parameter, state transitions, security SEC-01..SEC-07, and schema validation. Use for HW06 when generating test cases for a chosen EShop API before writing the Postman collection.
---
```

`description` là thứ quyết định skill có được kích hoạt đúng lúc không. Viết theo công thức:
**làm gì** + **khi nào dùng**. Đừng viết chung chung kiểu *"Skill hỗ trợ kiểm thử API"*.

---

## 3. Video demo — nếu làm

> **Thời lượng: không bắt buộc tối thiểu.** §7 chỉ ghi *"a demonstration video showing it generate
> tests for one API"*, không kèm số phút nào (khác HW05 từng bắt buộc ≥6 phút cho một video khác).
> Kịch bản dưới đây rút gọn còn **~7:30 phút**, vẫn đủ 3 yếu tố bắt buộc lọt khung hình (§3.3).

Kịch bản dùng **đúng số liệu thật** đã có trong repo (158 test case, 27 bug, BUG-02 khóa tài khoản
sai ngưỡng, BUG-03 lộ password, 2 lượt CI thật...) — không cần bịa gì thêm, chỉ cần **đọc theo và
thao tác đúng trình tự**. Có thể đọc lại lời thoại 1–2 lần cho quen trước khi quay, nhưng **đừng học
thuộc lòng như trả bài** — nói tự nhiên theo ý, lời thoại chỉ là sườn.

### 3.1 Chuẩn bị trước khi bấm Record (làm 1 lần)

| # | Việc | Vì sao |
|---|---|---|
| 1 | Mở sẵn 3 cửa sổ: **VS Code** (đã mở thư mục `HW06-API-Testing`), **2 terminal** đã `cd` vào `HW06-API-Testing`, **trình duyệt** (2 tab: Postman, GitHub repo) | đỡ mất thời gian tìm/mở giữa lúc quay. Cần 2 terminal vì đoạn demo phải chuyển qua lại giữa Claude Code và `curl` |
| 2 | **Khởi động lại SUT ngay trước khi quay** — terminal thứ 3, chạy đúng lệnh dưới bảng này. Để cửa sổ này **luôn hiện được** khi cần | ❶ chứng minh `localhost:3000` chạy thật; ❷ **DB được seed lại mỗi lần khởi động** — nếu không restart, dữ liệu rác từ các lần chạy thử trước sẽ làm số liệu lệch ngay trên video |
| 3 | Mở sẵn Postman, chọn đúng collection `23127183_api-01-login`, environment `HW06-local-23127183`, và **bật sẵn Postman Console** (`Ctrl+Alt+C`) | đỡ thao tác thừa giữa video |
| 4 | Phóng to chữ terminal + VS Code lên (Ctrl + hoặc Settings → Font size ≥ 16) | quay màn hình nhỏ chữ sẽ không đọc được khi xem trên YouTube |
| 5 | Mở sẵn tab GitHub: trang Issues (`github.com/DuyPham111/HW06/issues`) và trang Actions (1 lượt xanh, 1 lượt đỏ) | dùng ở phút cuối |
| 6 | Cài OBS Studio (miễn phí) hoặc dùng **Xbox Game Bar** có sẵn trên Windows 11 (`Win + G` → biểu tượng camera để quay) | ghi màn hình + giọng nói cùng lúc |
| 7 | Kiểm micro: nói thử 1 câu, nghe lại xem rõ tiếng không | quay xong mới phát hiện mất tiếng thì phải quay lại từ đầu |
| 8 | **Chạy nháp trọn kịch bản 1 lần** (không quay), rồi **restart lại SUT** trước khi quay thật | phát hiện sớm lệnh nào lỗi; và trả DB về sạch để số liệu trên video khớp báo cáo |

**Lệnh khởi động SUT** — SUT nằm **ngoài** thư mục bài làm (`.gitignore` bỏ qua `eshop-sut/`), nên
phải lùi một cấp, **không phải** `cd eshop-sut/backend`:

```bash
cd "D:/Nam3/HK3/Kiểm thử phần mềm/HW06/eshop-sut/backend" && node server.js
```

Đợi tới khi thấy **đúng 2 dòng** này (dòng đầu chính là bằng chứng DB vừa được seed lại sạch):

```text
Database initialized and seeded (Phase 2).
Server is running on http://localhost:3000
```

Rồi kiểm tra ở terminal khác (lệnh này chạy giống nhau trên cả PowerShell lẫn Git Bash):

```bash
curl -s http://localhost:3000/api/products
```

Phải in ra JSON danh sách 5 sản phẩm. Nếu ra rỗng hoặc báo lỗi kết nối thì SUT chưa lên — đừng bắt
đầu quay.

> Đừng thêm `-o /dev/null` vào lệnh trên: trên PowerShell, `curl.exe` không hiểu `/dev/null` và trả
> về exit code 23 kèm chữ đỏ, nhìn như lỗi trong khi SUT vẫn bình thường.

### 3.2 Kịch bản rút gọn ~7:30 — thao tác + lời thoại từng đoạn

> Ký hiệu: **[HÀNH ĐỘNG]** = việc tay phải làm trên màn hình. **[NÓI]** = lời thoại đọc/kể, không
> cần đúng từng chữ, cứ theo đúng ý là được. So với bản đầy đủ, bản này **gộp phần giới thiệu skill
> vào ngay trước lúc demo**, và **rút ngắn phần kết quả/CI/Issues** thành các đoạn quan sát nhanh —
> phần lõi (demo chạy thật + AI trả lời sai + `curl` xác minh) **giữ nguyên gần như đầy đủ**, vì đó
> là phần có giá trị nhất và không nên cắt.

---

**0:00 – 0:35 — Giới thiệu**

**[HÀNH ĐỘNG]** Mở `README.md` trong VS Code, cuộn nhanh qua tiêu đề và bảng Test Summary.

**[NÓI]**
> "Chào thầy cô và các bạn. Em là Phạm Vũ Ngọc Duy, mã số sinh viên 23127183, môn Kiểm thử phần
> mềm. Đây là video demo Agent Skill cho bài HW06, API Testing trên hệ thống EShop — em chọn 3 API
> đăng nhập, áp mã giảm giá, và cập nhật sản phẩm, mỗi API một pool theo đúng đề bài. Sau khi làm
> xong em có 158 test case, chạy Newman thật, phát hiện 27 bug thật. Video này em demo cách em dùng
> Agent Skill để sinh test case theo đúng quy trình 5 bước, không phải một prompt gộp."

---

**0:35 – 1:40 — Vấn đề + sơ đồ tự vẽ**

**[HÀNH ĐỘNG]** Mở `generator/design.md`, cho thấy ảnh `generator-flow-selfdrawn.png`.

**[NÓI]**
> "Đề bài cấm dùng một prompt kiểu 'sinh hết test case rồi chạy luôn' — phải hướng dẫn AI đi từng
> bước. Đây là sơ đồ em tự thiết kế và tự vẽ tay trên draw.io, không dùng AI vẽ vì đề cấm rõ điều
> đó. Sáu giai đoạn: đọc 3 nguồn dữ liệu — đặc tả, yêu cầu chức năng, và mã nguồn thật — suy ra ràng
> buộc, sinh case theo 4 nhóm mỗi nhóm một lượt AI riêng, rồi xuất file và kiểm chất lượng.
>
> Em đã đóng gói đúng quy trình này thành Agent Skill tên `api-test-design`. Bây giờ em chạy thử
> lại bước 1 của skill, trên chính API đăng nhập, để thấy AI phản hồi thật theo thời gian thực."

---

**1:40 – 4:40 — Demo chạy thật (đoạn quan trọng nhất — giữ nguyên, đừng cắt)**

**[HÀNH ĐỘNG]** Chuyển qua terminal đã mở sẵn Claude Code (gõ `claude` trong `HW06-API-Testing` nếu
chưa mở). Gõ prompt sau — **dùng đúng đường dẫn `../eshop-sut/`** vì SUT nằm ngoài thư mục bài làm:

```text
Dùng skill api-test-design. Đọc mục 1.2 trong ../eshop-sut/api_specification.md, FR-02 và bảng
SEC trong ../eshop-sut/README.md, và ../eshop-sut/backend/server.js dòng 32-66. Bước này CHƯA
sinh test case — chỉ trả lời: cơ chế khóa tài khoản theo FR-02 là gì (bao nhiêu lần sai thì khóa,
khóa bao lâu), và cơ chế thật trong code là gì? Hai bên có khớp không?
```

> ⚠️ **Chạy thử prompt này 1 lần trước khi quay** (bước 8 bảng chuẩn bị). Lần đầu đọc file ngoài
> thư mục làm việc, Claude Code sẽ hỏi xin quyền truy cập `../eshop-sut` — bấm đồng ý **lúc chạy
> nháp**, để lúc quay thật nó chạy thẳng, không có hộp thoại chen ngang.

**[NÓI]** (đọc trong lúc AI xử lý)
> "Đây đúng là bước 1 của skill — chưa sinh test case, chỉ bắt AI đọc và đối chiếu."

**[HÀNH ĐỘNG]** Đợi AI trả lời xong, đọc to kết quả.

**[NÓI]**
> "Và đây chính là chỗ AI trả lời sai mà em đã ghi lại trong file audit. AI đọc đúng con số '3 lần'
> trong văn bản đặc tả, nhưng khi em tự chạy `curl` thật để kiểm chứng thì phát hiện tài khoản thực
> ra bị khóa sau đúng 2 lần sai, vì code cộng dồn bộ đếm 2 đơn vị mỗi lần sai chứ không phải 1. Đây
> chính xác là lý do đề bắt buộc phải tự chạy thật kiểm chứng, không tin tuyệt đối vào AI đọc code."

**[HÀNH ĐỘNG]** Chuyển terminal khác, chạy:

```bash
bash bug-report/verify-bugs.sh 02
```

**[NÓI]**
> "Đây là script tái hiện lại đúng phát hiện đó bằng `curl` thật, độc lập với Postman. Sai lần 1 trả
> 401, sai lần 2 vẫn 401 nhưng tài khoản đã bị khóa ngầm, và request thứ 3 — dù gõ đúng mật khẩu —
> vẫn bị chặn mã 403. Đây là bug thật, em đặt tên BUG-02."

---

**4:40 – 5:20 — Kết quả nhanh: bảng test case và file audit**

**[HÀNH ĐỘNG]** Mở nhanh `test-cases/api-01-login/generated.md` (bảng phân bố 4 nhóm), rồi
`audit.md` (đoạn ghi chú `TC-LOGIN-021`/`022`).

**[NÓI]**
> "Sau 5 bước, kết quả là 45 test case AI sinh, chia 4 nhóm domain, state, security, schema, mỗi
> dòng đều có cột 'Căn cứ' trỏ về đặc tả để tránh AI bịa kỳ vọng. Đây là file audit — nơi em chịu
> trách nhiệm cuối cùng, ghi rõ case nào AI sai và sửa thế nào — em còn tự thêm 6 case AI bỏ sót,
> ví dụ kẻ tấn công khóa được tài khoản người khác chỉ bằng email, không cần mật khẩu, đó là BUG-01."

---

**5:20 – 6:20 — Chạy Newman thật**

**[HÀNH ĐỘNG]** Terminal: gõ `npm run test:api1`. Chạy hết **~5 giây**, không phải chờ lâu.

```bash
npm run test:api1
```

Để lộ trên khung hình: bảng tổng kết Newman (cột `executed` / `failed`) và danh sách assertion đỏ.

> **Số liệu đúng phải ra:** `53 request · 53 assertion · 9 đỏ`. Nếu ra số khác → SUT chưa được
> restart, dừng quay, restart SUT rồi quay lại đoạn này.

**[NÓI]**
> "Em chạy thật bộ test bằng Newman — hostname luôn là `localhost:3000`, đúng SUT em đang chạy, không
> giả lập. Kết quả 53 request, 53 assertion, 9 assertion đỏ, mỗi cái map về đúng một bug thật."

**[HÀNH ĐỘNG]** Mở báo cáo HTML. **Không cần mò trong thư mục** — dòng gần cuối của terminal in sẵn
đường dẫn đầy đủ, dạng:

```text
Bao cao HTML: ...\reports\newman\23127183_api-01-login_<YYYYmmdd-HHMMSS>.html
```

Ctrl+click vào đường dẫn đó (hoặc copy dán vào trình duyệt). Nếu terminal không cho click:

```bash
start "$(ls -t reports/newman/23127183_api-01-login_*.html | head -1)"
```

PowerShell thì dùng:

```powershell
Invoke-Item (Get-ChildItem reports\newman\23127183_api-01-login_*.html | Sort-Object LastWriteTime -Descending)[0].FullName
```

**Điều hướng trong trang báo cáo — đúng 2 bước** (đã kiểm chứng trên file thật):

| Bước | Thao tác | Thấy gì |
|---|---|---|
| 1 | Bấm **tab đỏ `Failed Tests`** (có badge **`9`**) trên thanh tab ngang ở đầu trang | 9 dòng đỏ hiện ra cùng lúc — bằng chứng trực quan cho con số 9 vừa đọc |
| 2 | Quay lại **tab đầu tiên** (danh sách request), `Ctrl+F` gõ `TC-LOGIN-028` → bấm dòng **`Iteration: 1 - TC-LOGIN-028`** để bung ra → cuộn tới khối **`Response Body`** | JSON response, trong đó có `"password":"Test1234!"` |

> ⚠️ Đừng tìm response body trong tab `Failed Tests` — tab đó **chỉ hiện thông báo assertion**
> (`... to not have property 'password'`), **không** có response body. Muốn quay được dòng mật khẩu
> nguyên văn thì bắt buộc phải sang danh sách request ở bước 2.

**[NÓI]**
> "Bấm vào request đỏ này, thấy field `password` xuất hiện nguyên văn trong response — bug BUG-03,
> hệ thống lộ mật khẩu dạng thô."

> 💡 **Mẹo:** ngay dưới `Response Body` của cùng request này còn có khối **`Console Logs`** in sẵn
> `[HW06] X-Student-Id = 23127183 | POST /api/login | <timestamp>`. Nếu lúc quay Postman Console
> có trục trặc, chỉ cần cuộn thêm vài dòng ở đây là đã có đủ bằng chứng §11 — không phải quay lại.

---

**6:20 – 6:50 — Bằng chứng chống gian lận (§11)**

**[HÀNH ĐỘNG]** Chuyển sang Postman đã mở sẵn, bấm **Send** 1 request, mở Postman Console.

**[NÓI]**
> "Mọi request phải mang header `X-Student-Id` để chống gian lận — em đặt trong pre-request script
> cấp collection. Đây là Postman Console in ra đúng mã số sinh viên của em."

---

**6:50 – 7:20 — CI/CD và GitHub Issues (quan sát nhanh)**

**[HÀNH ĐỘNG]** Chuyển nhanh 2 tab: GitHub Actions (1 lượt xanh, 1 đỏ), GitHub Issues (27 issue).

**[NÓI]**
> "Bộ test cũng chạy CI/CD thật trên GitHub Actions — một lượt xanh hoàn toàn, một lượt đỏ tạo có
> chủ đích để chứng minh cổng kiểm tra bắt được hồi quy. Và đây là 27 bug đã tạo thành Issue thật."

---

**7:20 – 7:35 — Kết luận**

**[NÓI]**
> "Tổng kết: em xây dựng 4 Agent Skill để tái sử dụng cho các API hoặc bài tập tương tự sau này.
> Toàn bộ quy trình chạy thật, không dựng kịch bản. Em cảm ơn thầy cô và các bạn đã theo dõi."

---

### 3.3 Ba điều bắt buộc phải lọt vào khung hình

(để video có giá trị làm bằng chứng, không chỉ là thuyết trình miệng)

1. **Postman Console** in `[HW06] X-Student-Id = 23127183` — đoạn 6:20–6:50.
2. **Terminal Newman** với hostname `http://localhost:3000` — đoạn 5:20–6:20.
3. **Sơ đồ tự vẽ** — đoạn 0:35–1:40, nói rõ vẽ bằng draw.io, ngày 31/08/2026.

### 3.4 Quay và đăng

- Quay bằng **OBS Studio** hoặc **Xbox Game Bar** (`Win+G` → biểu tượng camera). Độ phân giải 1080p,
  **bắt buộc thu giọng nói tiếng Việt** (không chỉ phụ đề).
- **Đừng quay lại nhiều lần cho hoàn hảo.** Đoạn demo chạy thật, AI trả lời sai, rồi bạn phát hiện và
  sửa lại bằng `curl` thật (1:40–4:40) **chính là phần đáng giá nhất** của video — nói vấp một chút
  không sao, miễn nội dung đúng và chân thực.
- Nếu lỡ prompt AI trả lời khác với kịch bản (AI không cố định câu chữ), **cứ nói theo đúng những gì
  AI thực sự trả lời**, rồi dẫn dắt về đúng kết luận đã biết (khóa sau 2 lần, không phải 3) — đừng
  cắt dựng lại để ép AI nói đúng kịch bản, vì đó là hành vi dàn dựng, mất giá trị làm bằng chứng.
- Xuất video, upload lên **YouTube → Unlisted** (không phải **Private** — Private thì TA link vào sẽ
  không xem được).
- Copy link, dán vào 2 chỗ: mục *Liên kết* trong `README.md`, và tạo file
  `.claude/skills/demo-video-link.md` với đúng nội dung: `# Video demo Agent Skill\n\n<link YouTube>`.

---

## 4. Nếu không làm video

Ghi rõ trong README, đừng để trống:

> §7 ghi *"encouraged"* — video demo là tuỳ chọn. Phần bắt buộc của §7 (thiết kế generator, sơ đồ
> tự vẽ, pseudocode) đã có đầy đủ tại `generator/`. Hiện thực dưới dạng 4 Agent Skill tại
> `.claude/skills/`.

---

## 5. Checklist

- [ ] 4 file `SKILL.md` đã điền nội dung, mô tả **đúng quy trình bạn đã chạy thật**
- [ ] `description` trong frontmatter theo công thức "làm gì + khi nào dùng"
- [ ] (nếu làm video) link YouTube **Unlisted**, có trong README và `demo-video-link.md`
- [ ] (nếu không làm video) đã ghi lý do trong README
- [ ] Commit: `feat: 4 Agent Skill cho pipeline HW06 (§7)`
