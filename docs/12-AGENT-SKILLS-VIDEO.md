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
> Kịch bản dưới đây dài **~8 phút**.

> ⚠️ **Điều dễ làm hỏng video nhất.** §7 đòi video cho thấy skill **sinh test case** cho một API.
> Một video chỉ chạy đúng một prompt rồi dành phần lớn thời lượng đi kể lại kết quả có sẵn — bảng
> case, báo cáo Newman, CI, Issues — là **không đạt yêu cầu đó**, dù mọi con số đều thật. Đặc biệt
> nếu prompt duy nhất đó là **bước 1** của skill, vì bước 1 theo thiết kế **chưa sinh case nào**.
> Kịch bản này vì vậy đặt **3 lượt gọi AI thật** làm trục chính, trong đó lượt thứ 3 sinh test case
> trực tiếp trên màn hình.

Kịch bản dùng **đúng số liệu thật** đã có trong repo (45 case AI sinh cho API-01 chia 4 nhóm, 158
case cho cả 3 API, `53/53/9` khi chạy Newman, 27 bug) — không cần bịa gì thêm. Có thể đọc lại lời
thoại 1–2 lần cho quen trước khi quay, nhưng **đừng học thuộc lòng như trả bài** — nói tự nhiên theo
ý, lời thoại chỉ là sườn.

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

### 3.2 Kịch bản ~8:00 — thao tác + lời thoại từng đoạn

> Ký hiệu: **[HÀNH ĐỘNG]** = việc tay phải làm trên màn hình. **[NÓI]** = lời thoại đọc/kể, không
> cần đúng từng chữ, cứ theo đúng ý là được.

**Trục của video này là §7: *"a demonstration video showing it generate tests for one API"*.** Nên
**hơn một nửa thời lượng phải là skill đang sinh test case thật**, chứ không phải đi kể lại kết quả
đã có sẵn trong repo. Phần CI, Issues, bug report thuộc §6/§8 — đã có bằng chứng riêng trong bài,
video chỉ cần nhắc một câu ở cuối.

Có **3 lượt gọi AI thật** trong video, theo đúng thứ tự dưới đây. Hai lượt đầu là một **phép so sánh
có chủ đích** (không phải may rủi): hỏi cùng một câu, lần đầu chỉ đưa đặc tả, lần sau đưa thêm mã
nguồn — để thấy đúng cái mà sơ đồ tự vẽ khẳng định: **phải đọc 3 nguồn chứ không phải 1**.

---

**0:00 – 0:30 — Giới thiệu**

**[HÀNH ĐỘNG]** Mở `README.md` trong VS Code, cuộn nhanh qua tiêu đề.

**[NÓI]**
> "Chào thầy cô và các bạn. Em là Phạm Vũ Ngọc Duy, mã số sinh viên 23127183, môn Kiểm thử phần mềm.
> Video này demo Agent Skill của em sinh test case cho một API của hệ thống EShop — cụ thể là API
> đăng nhập `POST /api/login`. Em sẽ chạy skill trực tiếp, không phải chiếu lại kết quả có sẵn."

---

**0:30 – 1:15 — Sơ đồ tự vẽ: thiết kế của generator**

**[HÀNH ĐỘNG]** Mở `generator/design.md`, cho thấy ảnh `generator-flow-selfdrawn.png`.

**[NÓI]**
> "Đây là sơ đồ generator em tự thiết kế và tự vẽ trên draw.io — đề cấm sơ đồ do AI sinh nên em vẽ tay.
> Điểm quan trọng nhất của thiết kế nằm ở giai đoạn đầu: generator **bắt buộc đọc 3 nguồn** — đặc tả
> API, tài liệu yêu cầu chức năng FR và bảo mật SEC, và **mã nguồn thật của hệ thống**. Và ở giai
> đoạn 3, nó sinh test case theo 4 nhóm — domain, state, security, schema — **mỗi nhóm một lượt hỏi
> AI riêng**, vì đề bài cấm gộp tất cả vào một prompt.
>
> Hai điều đó nghe có vẻ là chi tiết kỹ thuật nhỏ, nhưng lát nữa em sẽ chứng minh nếu bỏ một trong
> hai thì bộ test sai ngay."

---

**1:15 – 1:55 — Skill là hiện thực của sơ đồ**

**[HÀNH ĐỘNG]** Mở `.claude/skills/api-test-design/SKILL.md`, dừng ở **bảng 5 bước**, rồi cuộn xuống
**"Ba luật không được vi phạm"**.

**[NÓI]**
> "Em đóng gói sơ đồ đó thành Agent Skill tên `api-test-design`. Skill ép quy trình đi đúng 5 bước:
> bước 1 chỉ đọc và trả lời, **chưa được sinh case**; bước 2 chốt bảng phân vùng; bước 3, 4a, 4b, 5
> mới lần lượt sinh Domain, State, Security, Schema — mỗi bước một lượt riêng.
>
> Và đây là ba luật skill bắt AI tuân theo. Luật quan trọng nhất là luật số 2: **expected phải bám
> đặc tả, không được bám mã nguồn**. Vì hệ thống này có bug cố ý — nếu chép hành vi hiện tại làm kỳ
> vọng thì bộ test sẽ luôn xanh trên một hệ thống đang sai."

---

**1:55 – 2:35 — Lượt AI thứ 1: chỉ đưa đặc tả**

**[HÀNH ĐỘNG]** Sang terminal đang mở Claude Code (mở bằng `claude` trong `HW06-API-Testing`). Gõ:

```text
Dùng skill api-test-design, bước 1. CHỈ đọc FR-02 trong ../eshop-sut/README.md và mục 1.2 trong
../eshop-sut/api_specification.md. Chưa sinh test case. Trả lời đúng 2 câu: sai mật khẩu bao
nhiêu lần thì tài khoản bị khóa, và khóa trong bao lâu?
```

**[NÓI]** (trong lúc AI trả lời)
> "Lượt đầu em cố tình **chỉ đưa đặc tả**, giấu mã nguồn đi."

**[HÀNH ĐỘNG]** Đọc to câu trả lời.

**[NÓI]**
> "AI trả lời: sai **3 lần** thì khóa, khóa **30 giây**. Và AI trả lời hoàn toàn đúng — vì FR-02
> viết đúng như vậy. Nếu em dừng ở đây thì toàn bộ test case về khóa tài khoản sẽ dựng trên hai con
> số này."

---

**2:35 – 3:25 — Lượt AI thứ 2: đưa thêm mã nguồn thật**

**[HÀNH ĐỘNG]** Gõ tiếp trong cùng phiên:

```text
Giờ đọc thêm ../eshop-sut/backend/server.js dòng 32-66. Hành vi THẬT trong code có khớp với
FR-02 không? Nếu lệch thì lệch ở đâu, và test case phải bám bên nào?
```

**[NÓI]** (trong lúc AI xử lý)
> "Bây giờ em đưa nốt nguồn thứ ba — chính là mã nguồn — đúng như sơ đồ yêu cầu."

**[HÀNH ĐỘNG]** Đọc to kết quả. AI phải chỉ ra **2 chỗ lệch**.

**[NÓI]**
> "Và đây là lý do sơ đồ của em bắt đọc cả ba nguồn. AI chỉ ra hai chỗ lệch. Thứ nhất, đặc tả nói mỗi
> lần sai tăng bộ đếm **1 đơn vị**, nhưng code cộng **2** — nên tài khoản bị khóa ngay từ lần sai
> **thứ 2**, không phải thứ 3. Thứ hai, đặc tả nói khóa **30 giây**, còn code khóa **180 nghìn
> mili giây**, tức **3 phút** — gấp 6 lần.
>
> Và đúng theo luật số 2 của skill: **expected vẫn bám đặc tả**. Chính vì bám đặc tả nên chỗ lệch thứ
> nhất hiện ra thành test đỏ, và test đỏ đó là bug thật — chứ không phải em sửa kỳ vọng cho khớp code."

---

**3:25 – 4:00 — Kiểm chứng bằng `curl`, không tin AI**

**[HÀNH ĐỘNG]** Sang terminal thứ 2, chạy:

```bash
bash bug-report/verify-bugs.sh 02
```

**[NÓI]**
> "Nhưng AI nói vẫn chỉ là AI nói. Em kiểm chứng bằng `curl` thật, độc lập với Postman. Script đăng
> ký một tài khoản mới, rồi sai mật khẩu 2 lần. Sai lần 1 trả 401, sai lần 2 vẫn 401 — nhưng tài
> khoản đã bị khóa ngầm. Và request thứ 3, **dù gõ đúng mật khẩu**, vẫn bị chặn với mã 403. Đúng như
> AI vừa suy ra từ code. Đây là bug BUG-02 trong báo cáo của em."

---

**4:00 – 5:50 — Lượt AI thứ 3: skill SINH TEST CASE thật (đoạn chính của video)**

**[HÀNH ĐỘNG]** Quay lại terminal Claude Code, gõ prompt bước 3 (copy từ
[`docs/03-GENERATE-AI.md`](03-GENERATE-AI.md) §3):

```text
Tiếp bước 3 của skill: sinh test case nhóm Domain cho POST /api/login — CHỈ nhóm Domain, chưa
state, chưa security, chưa schema. Mỗi phân vùng ít nhất 1 case. ID từ TC-LOGIN-001. Cột Kỹ
thuật = Domain, Nguồn = AI, Audit và Kết quả để trống. Expected body phải kiểm được bằng
pm.test. Xuất đúng 12 cột theo khuôn trong skill.
```

**[NÓI]** (nói trong lúc AI đang sinh — đây là đoạn chờ lâu nhất, khoảng 1–2 phút)
> "Đây là bước 3, và là phần chính của video: skill đang sinh test case thật cho API đăng nhập. Các
> thầy cô để ý ba điều.
>
> Thứ nhất, nó **chỉ sinh nhóm Domain** — không đụng tới state, security hay schema. Bốn nhóm là bốn
> lượt riêng, đúng như sơ đồ và đúng như đề bài yêu cầu.
>
> Thứ hai, mỗi dòng ra đúng **12 cột**, trong đó có cột **Căn cứ** — mỗi test case bắt buộc trỏ về một
> mục cụ thể trong đặc tả, hoặc ghi rõ là *đặc tả im lặng*. Đây là cách skill chặn AI bịa kỳ vọng.
>
> Thứ ba, cột **Nguồn** ghi `AI`. Case nào do em tự nghĩ ra sau này sẽ ghi `SV` — đề bài phạt việc
> nhận nhầm công."

**[HÀNH ĐỘNG]** Khi bảng hiện xong, cuộn qua vài dòng, **dừng lại ở một dòng có cột `Căn cứ` ghi
*"đặc tả im lặng"*** và một dòng case mật khẩu sai.

**[NÓI]**
> "Bảng vừa sinh xong. Ví dụ dòng này: case sai mật khẩu, expected là 401 **và** body không được nói
> rõ là sai email hay sai mật khẩu — căn cứ là FR-02, *không để lộ chi tiết nguyên nhân*. Còn dòng
> này, đặc tả không nói gì về trường hợp thiếu hẳn field, nên cột Căn cứ ghi thẳng là *đặc tả im
> lặng*, và kỳ vọng chỉ dám khẳng định phần chắc chắn: không được trả lỗi 500."

---

**5:50 – 6:30 — Đối chiếu với bộ đã nộp**

**[HÀNH ĐỘNG]** Mở `test-cases/api-01-login/generated.md`, cho thấy **bảng phân bố 4 nhóm**
(Domain 18 · State 12 · Security 9 · Schema 6).

**[NÓI]**
> "Bốn bước còn lại — state, security, schema — em chạy y hệt cách vừa rồi, mỗi nhóm một lượt riêng,
> và đây là kết quả đầy đủ cho API đăng nhập: **45 test case do AI sinh**, chia đúng 4 nhóm.
>
> Một điểm em muốn nói thật: bảng vừa sinh trực tiếp trên video **không trùng từng dòng** với bảng
> trong bài nộp. Đó là bản chất của generator dùng AI — nó không tất định. Và **chính vì thế** đề bài
> mới bắt phải có bước audit của con người ở §6.2: em đã tự đọc lại từng case, dán nhãn hợp lệ hay
> không, sửa case sai, và tự thêm **6 case mà AI bỏ sót** cho riêng API này."

---

**6:30 – 7:10 — Case sinh ra có chạy được thật không**

**[HÀNH ĐỘNG]** Terminal: `npm run test:api1` (chạy ~5 giây).

```bash
npm run test:api1
```

> **Số liệu đúng phải ra:** `53 request · 53 assertion · 9 đỏ`. Nếu ra số khác → SUT chưa restart.

**[NÓI]**
> "Cuối cùng, test case sinh ra phải chạy được thật chứ không nằm trên giấy. Em chạy bằng Newman —
> hostname `localhost:3000`, đúng hệ thống đang chạy trên máy em. 53 request, 53 assertion, 9 đỏ.
> Và 9 assertion đỏ này không phải lỗi bộ test — chúng chính là 9 bug thật, vì kỳ vọng bám đặc tả
> còn hệ thống thì làm sai đặc tả."

---

**7:10 – 7:40 — Bằng chứng chống gian lận (§11)**

**[HÀNH ĐỘNG]** Sang Postman đã mở sẵn, bấm **Send** một request, mở Postman Console.

**[NÓI]**
> "Đề yêu cầu mọi request phải mang header `X-Student-Id`. Em đặt trong pre-request script ở cấp
> collection để không sót request nào — đây là Postman Console đang in ra đúng mã số sinh viên của em,
> 23127183."

---

**7:40 – 8:00 — Kết luận**

**[NÓI]**
> "Tổng kết: em đã xây 4 Agent Skill — sinh case, audit, dựng collection và chạy Newman, và ghi log
> AI Audit — để tái dùng cho API khác. Áp dụng cho cả 3 API, em có 158 test case và tìm ra 27 bug
> thật, tất cả đã tạo thành Issue trên GitHub và có pipeline CI chạy tự động. Em cảm ơn thầy cô và
> các bạn đã theo dõi."

### 3.3 Bốn điều bắt buộc phải lọt vào khung hình

(để video có giá trị làm bằng chứng, không chỉ là thuyết trình miệng)

1. **Skill đang sinh test case thật** — đoạn 4:00–5:50. **Đây là điều §7 đòi đích danh**
   (*"showing it generate tests for one API"*); thiếu nó thì ba điều còn lại không cứu được video.
2. **Sơ đồ tự vẽ** — đoạn 0:30–1:15, nói rõ vẽ bằng draw.io, ngày 31/08/2026.
3. **Terminal Newman** với hostname `http://localhost:3000` — đoạn 6:30–7:10.
4. **Postman Console** in `[HW06] X-Student-Id = 23127183` — đoạn 7:10–7:40.

### 3.4 Quay và đăng

- Quay bằng **OBS Studio** hoặc **Xbox Game Bar** (`Win+G` → biểu tượng camera). Độ phân giải 1080p,
  **bắt buộc thu giọng nói tiếng Việt** (không chỉ phụ đề).
- **Đừng quay lại nhiều lần cho hoàn hảo.** Đoạn skill sinh case thật (4:00–5:50) và đoạn so sánh
  2 lượt AI (1:55–3:25) **chính là phần đáng giá nhất** — nói vấp một chút không sao, miễn nội dung
  đúng và chân thực.
- **AI không tất định — và điều đó không sao.** Bảng case sinh trên video sẽ khác bài nộp, số lượng
  case cũng có thể lệch. Kịch bản đã có sẵn câu nói thẳng điều này ở đoạn 5:50–6:30; **cứ nói đúng
  những gì AI thực sự trả lời**, đừng cắt dựng để ép AI khớp kịch bản — dàn dựng thì mất sạch giá trị
  làm bằng chứng.
- **Nếu lượt AI thứ 2 không chỉ ra đủ 2 chỗ lệch:** hỏi thêm một câu *"còn thời gian khóa thì sao?"*.
  Hai chỗ lệch đều nằm sẵn trong code nên hỏi tới là ra, không cần mớm đáp án.
- **Nếu lượt 1 mà AI đã tự nói "code cộng 2":** nghĩa là nó lỡ đọc file khác ngoài yêu cầu. Nói thẳng
  trên video là AI đọc quá phạm vi được giao, rồi chuyển sang lượt 2 bình thường — vẫn giữ được ý
  chính là *phải đối chiếu đặc tả với mã nguồn*.
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
