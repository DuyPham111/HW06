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

Kịch bản dưới đây dùng **đúng số liệu thật** đã có trong repo (158 test case, 27 bug, BUG-19 sập
server, BUG-10 công thức coupon âm, 2 lượt CI thật...) — không cần bịa gì thêm, chỉ cần **đọc theo
và thao tác đúng trình tự**. Tổng thời lượng **~12 phút**. Có thể đọc lại lời thoại 1–2 lần cho quen
trước khi quay, nhưng **đừng học thuộc lòng như trả bài** — nói tự nhiên theo ý, lời thoại chỉ là sườn.

### 3.1 Chuẩn bị trước khi bấm Record (làm 1 lần)

| # | Việc | Vì sao |
|---|---|---|
| 1 | Mở sẵn 3 cửa sổ: **VS Code** (đã mở thư mục `HW06-API-Testing`), **terminal** (Git Bash, đã `cd` vào đúng thư mục), **trình duyệt** (2 tab: Postman web hoặc app, GitHub repo) | đỡ mất thời gian tìm/mở giữa lúc quay |
| 2 | Chạy sẵn SUT: `cd eshop-sut/backend && node server.js`, để cửa sổ này **luôn hiện được** khi cần | chứng minh đang chạy `localhost:3000` thật, không phải giả |
| 3 | Mở sẵn Postman, chọn đúng collection `23127183_api-01-login`, environment `HW06-local-23127183`, và **bật sẵn Postman Console** (`Ctrl+Alt+C`) | đỡ thao tác thừa giữa video |
| 4 | Phóng to chữ terminal + VS Code lên (Ctrl + hoặc Settings → Font size ≥ 16) | quay màn hình nhỏ chữ sẽ không đọc được khi xem trên YouTube |
| 5 | Mở sẵn tab GitHub: trang Issues (`github.com/DuyPham111/HW06/issues`) và trang Actions (1 lượt xanh, 1 lượt đỏ) | dùng ở phút cuối |
| 6 | Cài OBS Studio (miễn phí) hoặc dùng **Xbox Game Bar** có sẵn trên Windows 11 (`Win + G` → biểu tượng camera để quay) | ghi màn hình + giọng nói cùng lúc |
| 7 | Kiểm micro: nói thử 1 câu, nghe lại xem rõ tiếng không | quay xong mới phát hiện mất tiếng thì phải quay lại từ đầu |

### 3.2 Kịch bản đầy đủ — thao tác + lời thoại từng phút

> Ký hiệu: **[HÀNH ĐỘNG]** = việc tay phải làm trên màn hình. **[NÓI]** = lời thoại đọc/kể, không
> cần đúng từng chữ, cứ theo đúng ý là được.

---

**0:00 – 0:50 — Giới thiệu**

**[HÀNH ĐỘNG]** Mở `README.md` trong VS Code, cuộn cho thấy tiêu đề và bảng Test Summary Report (§2).

**[NÓI]**
> "Chào thầy cô và các bạn. Em là Phạm Vũ Ngọc Duy, mã số sinh viên 23127183, môn Kiểm thử phần
> mềm. Đây là video demo cho bài HW06, API Testing trên hệ thống EShop.
>
> Bài này em chọn 3 API, mỗi API thuộc một pool theo đúng yêu cầu đề bài: API đăng nhập
> `POST /api/login` ở Pool A, API áp mã giảm giá `POST /api/apply-coupon` ở Pool B, và API cập nhật
> sản phẩm `PUT /api/products/:id` ở Pool C. Ba API này em giữ nguyên từ HW02, HW04, HW05, để tận
> dụng những gì đã hiểu về nghiệp vụ của hệ thống.
>
> Sau khi làm xong, em có tổng cộng 158 test case, chạy Newman thật ra 163 request, phát hiện 27 bug
> thật, và đã tạo 27 GitHub Issue tương ứng. Trong video này em sẽ demo phần quan trọng nhất: cách
> em dùng AI, cụ thể là Agent Skill, để sinh test case theo đúng quy trình 5 bước mà đề bài yêu cầu,
> chứ không phải gửi một prompt duy nhất rồi lấy kết quả."

---

**0:50 – 2:20 — Vấn đề: vì sao không được gộp 1 prompt**

**[HÀNH ĐỘNG]** Chuyển sang mở `generator/design.md`, cuộn tới mục sơ đồ, cho thấy ảnh
`generator-flow-selfdrawn.png`.

**[NÓI]**
> "Đề bài ở mục 2 nói rõ: không được dùng một prompt kiểu 'hãy sinh hết test case từ spec rồi chạy
> luôn', mà phải hướng dẫn AI đi từng bước, như một trợ lý có kỷ luật chứ không phải hộp đen.
>
> Đây là sơ đồ em tự thiết kế và tự vẽ tay trên draw.io — không dùng AI vẽ, vì đề cấm rõ điều đó ở
> mục 11. Sơ đồ có 6 giai đoạn: đọc 3 nguồn dữ liệu là đặc tả API, yêu cầu chức năng, và mã nguồn
> thật của hệ thống; suy ra ràng buộc cho từng tham số; sinh test case theo 4 nhóm — domain, state,
> security, schema — mỗi nhóm là MỘT lượt hỏi AI riêng biệt; sau đó khử trùng, xuất ra file, và cuối
> cùng là cổng kiểm chất lượng tự động.
>
> Bây giờ em sẽ demo trực tiếp giai đoạn sinh test case này, chạy thật trên máy, không phải dựng lại."

---

**2:20 – 3:20 — Giới thiệu Agent Skill sẽ dùng**

**[HÀNH ĐỘNG]** Mở file `.claude/skills/api-test-design/SKILL.md` trong VS Code, cuộn lướt qua phần
"5 bước".

**[NÓI]**
> "Em đã đóng gói quy trình 5 bước này thành một Agent Skill tên là `api-test-design`, nằm trong
> thư mục `.claude/skills`. Skill này ép AI phải đi tuần tự: bước 1 chỉ đọc và trả lời câu hỏi về
> API, chưa được sinh test case; bước 2 mới chốt bảng phân vùng; bước 3, 4, 5 mới lần lượt sinh case
> Domain, State và Security, rồi Schema — mỗi bước một lượt gọi AI riêng.
>
> Bây giờ em mở terminal, gọi Claude Code, và chạy thử lại bước 1 của skill này trên chính API đăng
> nhập, để các thầy cô thấy AI phản hồi thật, theo thời gian thực."

---

**3:20 – 7:30 — Demo chạy thật (đoạn quan trọng nhất)**

**[HÀNH ĐỘNG]** Chuyển qua cửa sổ terminal đã mở sẵn Claude Code (gõ `claude` nếu chưa mở). Gõ đúng
prompt sau (copy từ `docs/03-GENERATE-AI.md` mục API-01 bước 1, có thể rút gọn 1 chút để nhập nhanh
lúc quay):

```text
Dùng skill api-test-design. Đọc mục 1.2 trong api_specification.md, FR-02 và bảng SEC trong
README.md của SUT, và server.js dòng 32-66. Bước này CHƯA sinh test case — chỉ trả lời: cơ chế
khóa tài khoản theo FR-02 là gì (bao nhiêu lần sai thì khóa, khóa bao lâu), và cơ chế thật trong
code là gì? Hai bên có khớp không?
```

**[NÓI]** (đọc trong lúc AI đang xử lý, hoặc ngay sau khi có kết quả)
> "Đây là đúng bước 1 của skill — chưa sinh test case, chỉ bắt AI đọc và đối chiếu. Các thầy cô để ý
> câu trả lời của AI ở đây."

**[HÀNH ĐỘNG]** Đợi AI trả lời xong, đọc to kết quả trên màn hình.

**[NÓI]**
> "Và đây chính là chỗ AI trả lời sai mà em đã ghi lại trong file audit. AI đọc đúng con số '3 lần'
> trong văn bản đặc tả, nhưng khi em tự tay chạy `curl` thật để kiểm chứng — em sẽ mở lại đoạn này —
> thì phát hiện tài khoản thực ra bị khóa sau đúng 2 lần sai, chứ không phải 3, vì đoạn code cộng
> dồn bộ đếm những 2 đơn vị mỗi lần sai chứ không phải 1. Đây chính xác là lý do đề bài bắt buộc phải
> tự chạy thật để kiểm chứng, chứ không được tin tuyệt đối vào việc AI đọc code."

**[HÀNH ĐỘNG]** Chuyển sang terminal thứ hai (hoặc mở file `bug-report/verify-bugs.sh`), chạy lệnh:

```bash
bash bug-report/verify-bugs.sh 02
```

**[NÓI]**
> "Đây là script em viết để tái hiện lại đúng phát hiện đó bằng `curl` thật, độc lập với Postman.
> Các thầy cô thấy: request sai lần 1 trả 401, sai lần 2 vẫn trả 401 nhưng lúc này tài khoản đã bị
> khóa ngầm, và đến request thứ 3 — dù gõ đúng mật khẩu — vẫn bị chặn với mã 403. Đây là bug thật,
> em đặt tên BUG-02 trong báo cáo."

---

**7:30 – 9:00 — Kết quả: bảng test case và file audit**

**[HÀNH ĐỘNG]** Mở `test-cases/api-01-login/generated.md`, cuộn cho thấy bảng phân bố 4 nhóm kỹ
thuật (Domain 18, State 12, Security 8, Schema 7) và vài dòng đầu bảng 12 cột.

**[NÓI]**
> "Sau khi chạy đủ 5 bước như vậy cho API đăng nhập, kết quả là 45 test case do AI sinh, chia đều 4
> nhóm kỹ thuật: domain partition, state transition, bảo mật theo 7 tiêu chí SEC, và schema
> validation. Mỗi dòng trong bảng đều có cột 'Căn cứ' — bắt buộc phải trỏ về đúng một mục trong đặc
> tả, hoặc ghi rõ là đặc tả im lặng — để tránh AI bịa ra kỳ vọng không có cơ sở."

**[HÀNH ĐỘNG]** Mở `test-cases/api-01-login/audit.md`, cuộn tới mục "Ghi chú audit", chỉ vào đoạn nói
về `TC-LOGIN-021`/`022`.

**[NÓI]**
> "Đây là file audit — bước con người phải chịu trách nhiệm cuối cùng theo đúng yêu cầu đề bài. Em
> ghi lại rõ ràng: case nào AI dự đoán sai, sai ở đâu, và em đã sửa thế nào. Ngoài ra em còn tự thêm
> 6 test case mà AI hoàn toàn bỏ sót, ví dụ như việc kẻ tấn công có thể khóa tài khoản của người khác
> chỉ bằng cách biết email, không cần biết mật khẩu — đây là bug BUG-01, mức độ nghiêm trọng nhất."

---

**9:00 – 10:30 — Chạy Newman, xem báo cáo thật**

**[HÀNH ĐỘNG]** Quay lại terminal, gõ:

```bash
npm run test:api1
```

Đợi chạy xong (khoảng 5 giây), để lộ rõ dòng cuối có tổng số request/assertion và danh sách assertion
đỏ trên terminal.

**[NÓI]**
> "Bây giờ em chạy thật bộ test này bằng Newman. Các thầy cô thấy hostname luôn là `localhost:3000` —
> đúng SUT em đang chạy trên máy, không phải giả lập. Kết quả: 53 request, 53 assertion, và 9
> assertion đỏ — mỗi assertion đỏ này em đã đối chiếu và map về đúng một bug thật trong báo cáo."

**[HÀNH ĐỘNG]** Mở file HTML báo cáo mới nhất trong `reports/newman/` bằng trình duyệt, cuộn tới một
request đỏ bất kỳ (ví dụ `TC-LOGIN-028`, liên quan BUG-03 lộ mật khẩu).

**[NÓI]**
> "Đây là báo cáo HTML do Newman xuất ra. Em bấm vào request bị đỏ này — `TC-LOGIN-028` — kiểm tra
> response thật trả về sau khi đăng nhập thành công. Các thầy cô thấy field `password` xuất hiện
> nguyên văn trong response — đây chính là bug BUG-03, hệ thống đang lộ mật khẩu dạng thô ra ngoài."

---

**10:30 – 11:15 — Bằng chứng chống gian lận (§11)**

**[HÀNH ĐỘNG]** Chuyển sang cửa sổ Postman đã mở sẵn, bấm **Send** một request bất kỳ trong collection
`23127183_api-01-login`, sau đó mở Postman Console (đã bật sẵn từ bước chuẩn bị).

**[NÓI]**
> "Một yêu cầu bắt buộc của đề là mọi request phải mang header `X-Student-Id` để chống gian lận. Em
> đặt việc này trong một pre-request script ở cấp toàn bộ collection, để không sót request nào. Đây
> là Postman Console đang in ra dòng log kèm đúng mã số sinh viên của em, và ở panel request cũng
> thấy header `X-Student-Id: 23127183` được gắn tự động."

---

**11:15 – 11:50 — Kết quả tổng thể: CI/CD và GitHub Issues**

**[HÀNH ĐỘNG]** Chuyển sang tab trình duyệt GitHub Actions, cho thấy 1 lượt chạy màu xanh (thành
công) và 1 lượt màu đỏ (thất bại có chủ đích).

**[NÓI]**
> "Bộ test này cũng được tích hợp CI/CD thật trên GitHub Actions. Đây là một lượt chạy xanh hoàn
> toàn, và đây là một lượt đỏ — được tạo có chủ đích bằng cách hạ ngưỡng chấp nhận lỗi xuống thấp hơn
> thực tế, để chứng minh cổng kiểm tra hoạt động đúng, bắt được hồi quy thật."

**[HÀNH ĐỘNG]** Chuyển qua tab GitHub Issues, cuộn cho thấy danh sách 27 issue với nhãn mức độ và API.

**[NÓI]**
> "Và đây là 27 bug em tìm được trong cả 3 API, đã tạo thành Issue thật trên GitHub, mỗi issue gắn
> nhãn mức độ nghiêm trọng và API tương ứng, kèm ảnh minh chứng."

---

**11:50 – 12:20 — Kết luận**

**[HÀNH ĐỘNG]** Quay lại VS Code, mở `.claude/skills/` cho thấy đủ 4 skill.

**[NÓI]**
> "Tổng kết lại: em đã xây dựng 4 Agent Skill — sinh test case, audit, dựng collection Postman và
> chạy Newman, và ghi log AI Audit Report — để có thể tái sử dụng cho các API khác hoặc các bài tập
> tương tự sau này, đúng như đề bài khuyến khích ở mục 2. Toàn bộ quy trình đã được chạy thật, không
> phải dựng kịch bản, và mọi con số trong báo cáo đều lấy trực tiếp từ kết quả Newman thật.
>
> Em cảm ơn thầy cô và các bạn đã theo dõi."

---

### 3.3 Ba điều bắt buộc phải lọt vào khung hình

(để video có giá trị làm bằng chứng, không chỉ là thuyết trình miệng)

1. **Postman Console** in `[HW06] X-Student-Id = 23127183` — đoạn 10:30–11:15.
2. **Terminal Newman** với hostname `http://localhost:3000` — đoạn 9:00–10:30.
3. **Sơ đồ tự vẽ** — đoạn 0:50–2:20, nói rõ vẽ bằng draw.io, ngày 31/08/2026.

### 3.4 Quay và đăng

- Quay bằng **OBS Studio** hoặc **Xbox Game Bar** (`Win+G` → biểu tượng camera). Độ phân giải 1080p,
  **bắt buộc thu giọng nói tiếng Việt** (không chỉ phụ đề).
- **Đừng quay lại nhiều lần cho hoàn hảo.** Đoạn AI trả lời sai (2:20–3:20) và bạn phát hiện, sửa lại
  bằng `curl` thật (3:20–7:30) **chính là phần đáng giá nhất** của video — nói vấp một chút không sao,
  miễn nội dung đúng và chân thực.
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
