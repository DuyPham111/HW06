# 03 — §6.1 Sinh test case bằng AI theo **5 bước riêng** (≥35 case/API)

> **File dài nhất và quan trọng nhất.** Làm xong API-01 thì API-02, API-03 chỉ là lặp lại quy trình
> với bảng tham số khác.
> Output mỗi API: `test-cases/api-0X-*/generated.md` + 5 mục trong `ai-audit/ai-audit-report.md`.
> **Commit:** `test(api-01): sinh test case bang AI theo 5 buoc (§6.1)`

---

## 1. Luật: 5 bước = 5 lượt hỏi AI riêng. Không gộp.

§2 của đề **cấm đích danh** prompt kiểu *"generate all the API test cases from the spec and run them"*.
Người chấm nhìn `ai-audit/ai-audit-report.md`. Nếu 1 lượt hỏi ra 40 case thì mất điểm §2 dù bảng đẹp.

| Bước | Việc | Ra cái gì | Ghi log |
|---|---|---|---|
| **B1** | Dạy AI về API: bắt nó **đọc và trả lời**, chưa sinh case | bảng tham số + chỗ spec im lặng | LOG-00x |
| **B2** | Cùng AI chốt **bảng phân vùng** (domain partition) cho từng tham số | bảng partition | LOG-00x |
| **B3** | Sinh case **nhóm Domain** (chỉ nhóm này) | ~15–20 case | LOG-00x |
| **B4** | Sinh case **nhóm State transition** rồi **nhóm Security** — 2 lượt riêng | ~5 + ~8 case | LOG-00x ×2 |
| **B5** | Sinh case **nhóm Schema validation** | ~7 case | LOG-00x |

**Tổng ≥35 case/API.** Đề nói *"target ≥35 per API"* — 35 là sàn, không phải trần.

> Vì sao tách B4 thành 2 lượt: state transition và security là hai cách nghĩ khác nhau. Gộp một
> prompt thì AI luôn dồn về security (nó "quen tay" hơn) và sinh 2–3 case state cho có.

---

## 2. Khuôn bảng test case — 12 cột, dùng chung cho cả 3 API

Bắt AI xuất **đúng** 12 cột này. Chúng là đầu vào của trình xuất Excel (§14) và của bảng audit (§6.2),
nên lệch cột là phải sửa tay 3 chỗ.

```
| TC ID | Kỹ thuật | Tham số & phân vùng | Request | Auth | Query / Body | Expected status | Expected body / schema | Căn cứ | Nguồn | Audit | Kết quả |
```

| Cột | Điền gì | Lưu ý |
|---|---|---|
| `TC ID` | `TC-LOGIN-001` … | 001–099 = lượt AI đầu; 101+ = case bổ sung ở [05](05-EXTEND.md) |
| `Kỹ thuật` | `Domain` / `State` / `Security SEC-0X` / `Schema` | đúng 4 nhóm mà §6.1 đòi |
| `Tham số & phân vùng` | tham số nào, phân vùng nào | ví dụ: `email` — **sai định dạng** |
| `Request` | `POST /api/login` | ghi cả method |
| `Auth` | `không có header` / `user thường` / `admin` / `token rác` | |
| `Query / Body` | payload thật | đủ để copy thẳng vào Postman |
| `Expected status` | `200` / `400` / `401` … | |
| `Expected body / schema` | khẳng định về body | **phải kiểm được bằng `pm.test`** |
| `Căn cứ` | `spec §1.2` / `FR-02` / `SEC-01` | **cột quan trọng nhất** — không có căn cứ = expected bịa |
| `Nguồn` | `AI` / `AI-2` / `SV` | ai nghĩ ra case này |
| `Audit` | để **trống** ở bước này | điền ở [04](04-AUDIT.md) |
| `Kết quả` | để **trống** ở bước này | điền sau khi chạy Newman |

---

## 3. API-01 · `POST /api/login` — 5 bước, prompt copy dán được

### Bước 1 — Dạy AI về API (chưa sinh case)

> **Prompt (dán nguyên văn):**
>
> Tôi sắp thiết kế test case API cho bài tập kiểm thử. **Bước này chưa sinh test case** — tôi chỉ
> muốn bạn đọc và trả lời câu hỏi.
>
> Đây là đặc tả endpoint: [dán mục **1.2 Đăng nhập** của `eshop-sut/api_specification.md`]
>
> Đây là yêu cầu chức năng liên quan: [dán **FR-02** của `eshop-sut/README.md`]
>
> Đây là các yêu cầu bảo mật của hệ thống: [dán bảng **SEC-01 … SEC-07**]
>
> Đây là mã nguồn handler thật: [dán `backend/server.js` dòng 32–66] và middleware xác thực
> [dán hàm `authenticateToken`]
>
> Trả lời đúng 6 câu, **chỉ dựa trên tài liệu tôi dán, không suy diễn**:
> 1. Liệt kê **mọi** tham số của request này: tên, nằm ở đâu (body/header/query), kiểu, bắt buộc hay không.
> 2. Với mỗi tham số, đặc tả **có nói** ràng buộc gì? Chỗ nào đặc tả **im lặng** (không nói gì)?
> 3. Response thành công có **chính xác** những field nào? Response lỗi có shape gì? Có status code nào không được ghi trong đặc tả mà code vẫn trả về không?
> 4. Cơ chế khóa tài khoản theo **FR-02** là gì (bộ đếm tăng bao nhiêu, khóa sau mấy lần, khóa bao lâu)? Cơ chế trong **code** là gì? Hai bên có khớp không — chỉ rõ số dòng.
> 5. Endpoint này liên quan tới SEC nào trong SEC-01…SEC-07? Với mỗi SEC, code có thỏa không, chỉ rõ dòng.
> 6. Có trạng thái nào của tài khoản làm response khác nhau không (chưa khóa / đang khóa / hết hạn khóa)? Muốn đưa tài khoản vào từng trạng thái đó thì phải gửi chuỗi request nào?
>
> Trả lời dạng bảng. Chỗ nào đặc tả không nói thì ghi rõ **"đặc tả im lặng"**, đừng đoán.

**Đáp án đúng để bạn đối chiếu — AI trả khác là AI sai, ghi ngay vào bảng human review:**

| Câu | Sự thật |
|---|---|
| 1 | Body: `email` (string, bắt buộc), `password` (string, bắt buộc). Không có header bắt buộc nào. |
| 2 | Đặc tả **không** nói định dạng email, độ dài mật khẩu, hành vi khi thiếu trường. FR-02 nói "email phải `type="email"`" nhưng đó là ràng buộc **UI**, không phải API. |
| 3 | Thành công: `{message, token, user}` — và `user` là **nguyên dòng DB**, gồm cả `password`, `login_attempts`, `locked_until`. Lỗi: `{error}`. Status `403` khi bị khóa **không** có trong đặc tả API. |
| 4 | FR-02: +1 mỗi lần sai, khóa khi ≥3 lần, khóa **30s**. Code: `+2` (`:54`), khóa khi `newAttempts >= 3` → **2 lần sai là khóa**, `180000ms` = **180s** (`:57`). **Không khớp — 3 điểm lệch.** |
| 5 | SEC-01: **vi phạm** — `user.password === password` (`:46`) so chuỗi trần, và `database.js:92` lưu plaintext. SEC-02: token sinh bằng `jwt.sign` **không `expiresIn`** (`:50`) → không hết hạn. SEC-05: query có tham số hóa (`:35`) → **đạt**. |
| 6 | 3 trạng thái: bình thường / đang khóa (`locked_until` > now → 403) / hết hạn khóa (`locked_until` < now → cho thử lại nhưng `login_attempts` **không được reset**, nên 1 lần sai nữa là khóa lại). Đưa vào trạng thái khóa: gửi 2 request sai mật khẩu liên tiếp. |

> Nếu AI trả **"khóa sau 3 lần sai"** — đó là lỗi đầu tiên của nó và là dòng đầu tiên trong bảng
> human review. Lý do nó sai: nó đọc `if (newAttempts >= 3)` rồi khớp thẳng với FR-02, **không**
> cộng dồn bước nhảy `+2` qua từng request. Đây đúng là loại lỗi *không mô phỏng trạng thái qua
> nhiều request* mà bạn đã ghi ở HW02 và HW05.

**Ghi log:** `LOG-001` — tool, ngày giờ, prompt trên, output nguyên văn, cột "AI sai gì".

---

### Bước 2 — Chốt bảng phân vùng (domain partition)

> **Prompt:**
>
> Dựa trên đúng các dữ kiện bạn vừa xác nhận (không thêm giả định mới), hãy lập **bảng phân vùng
> (domain partition)** cho từng tham số của `POST /api/login`.
>
> Với mỗi tham số, liệt kê các phân vùng theo khung sau và bỏ phân vùng nào không áp dụng:
> hợp lệ điển hình · biên dưới · biên dưới − 1 · biên trên · biên trên + 1 · rỗng · thiếu hẳn trường ·
> sai kiểu (số / mảng / object / null) · quá dài · ký tự đặc biệt · Unicode có dấu · khoảng trắng đầu-cuối.
>
> Thêm **một tham số ẩn**: *trạng thái tài khoản* — với các phân vùng: tồn tại & mật khẩu đúng ·
> tồn tại & mật khẩu sai · không tồn tại · đang bị khóa · vừa hết hạn khóa.
>
> Với **mỗi** phân vùng ghi 3 cột: **giá trị mẫu cụ thể** · **expected status** · **căn cứ**
> (`spec §1.2` / `FR-02` / `SEC-0X` / **"đặc tả im lặng"**).
>
> Quy tắc bắt buộc: nếu đặc tả **im lặng** về một phân vùng thì **không được bịa** status code.
> Trong trường hợp đó chỉ khẳng định phần đặc tả bảo đảm (ví dụ "phải trả JSON, không phải HTML;
> không được 500") và ghi rõ căn cứ là "đặc tả im lặng".
>
> Xuất ra bảng Markdown. Chưa viết test case.

**Người review chỗ nào:** đọc cột *Căn cứ*. Mọi dòng có căn cứ là "suy luận hợp lý" mà không trỏ
được về `spec §` / `FR-` / `SEC-` thì **hạ expected** xuống phần spec bảo đảm. Đây là chỗ AI hay
bịa nhất, và một expected bịa sẽ sinh ra **bug giả** trong báo cáo — lỗi tệ nhất của bài này.

**Ghi log:** `LOG-002`.

---

### Bước 3 — Sinh case nhóm **Domain** (chỉ nhóm này)

> **Prompt:**
>
> Từ bảng phân vùng đã chốt, hãy viết test case cho **nhóm Domain** của `POST /api/login`.
> **Chỉ nhóm Domain** — chưa viết state transition, chưa viết security, chưa viết schema.
>
> Yêu cầu:
> - Mỗi phân vùng trong bảng phải có **ít nhất 1** test case. Ưu tiên phủ hết trước khi thêm biến thể.
> - ID chạy từ `TC-LOGIN-001`.
> - Cột `Kỹ thuật` = `Domain`.
> - Cột `Nguồn` = `AI`.
> - Cột `Audit` và `Kết quả` để **trống**.
> - `Expected body / schema` phải là khẳng định **kiểm được bằng `pm.test`** — ví dụ
>   *"body có field `token` kiểu string, độ dài > 0"*, chứ không phải *"trả về đúng"*.
> - Với case mật khẩu sai: expected là `401` **và** body **không** chứa thông tin nói rõ là sai
>   email hay sai mật khẩu (FR-02: *"không để lộ chi tiết nguyên nhân"*).
>
> Xuất **đúng 12 cột** theo header sau, không thêm bớt cột:
> `| TC ID | Kỹ thuật | Tham số & phân vùng | Request | Auth | Query / Body | Expected status | Expected body / schema | Căn cứ | Nguồn | Audit | Kết quả |`

Kỳ vọng: **16–20 case**. Nếu AI ra dưới 12 case thì nó đang gộp phân vùng — bảo nó tách ra.

**Ghi log:** `LOG-003`.

---

### Bước 4a — Sinh case nhóm **State transition**

> **Prompt:**
>
> Vẫn `POST /api/login`. Bây giờ **chỉ** viết test case cho **state transition**, không viết nhóm khác.
>
> Trạng thái ở đây là **trạng thái khóa của tài khoản** theo FR-02, đi qua chuỗi:
> `login_attempts = 0` → sai 1 lần → sai lần nữa → bị khóa → thử lại khi đang khóa → hết hạn khóa →
> đăng nhập đúng để reset.
>
> Yêu cầu:
> - Mỗi test case là **một request trong chuỗi**, đánh số theo đúng thứ tự thực thi, và ghi rõ ở cột
>   `Tham số & phân vùng` rằng nó là bước thứ mấy và phụ thuộc case nào.
> - Test case phải dùng một **tài khoản mồi riêng** (đăng ký mới ở bước 0 qua `POST /api/register`),
>   **không** dùng `test@eshop.com`, để chuỗi này không làm hỏng các case khác.
> - Expected bám **FR-02** (+1 mỗi lần sai, khóa từ lần thứ 3, khóa 30 giây), **không** bám hành vi
>   hiện tại của code.
> - Có ít nhất 1 case kiểm **bộ đếm được reset** sau khi đăng nhập đúng.
> - Có ít nhất 1 case kiểm hành vi sau khi **hết hạn khóa**.
> - ID tiếp nối dãy hiện có. `Kỹ thuật` = `State`. `Nguồn` = `AI`. Cùng 12 cột.

Kỳ vọng: **5–7 case**.

> **Lưu ý thực thi:** FR-02 nói khóa 30 giây nhưng code khóa 180 giây. Case *"sau khi hết hạn khóa"*
> mà chờ thật thì làm lượt Newman dài thêm 3 phút. Cách xử lý ghi ở [06](06-POSTMAN-COLLECTION.md) §6
> — **đừng** vì thế mà bỏ case.

**Ghi log:** `LOG-004`.

---

### Bước 4b — Sinh case nhóm **Security** (lượt riêng)

> **Prompt:**
>
> Vẫn `POST /api/login`. Bây giờ **chỉ** viết test case **bảo mật**, ánh xạ tới SEC-01…SEC-07.
>
> Với mỗi test case, cột `Kỹ thuật` phải ghi rõ mã SEC (ví dụ `Security SEC-01`), và cột `Căn cứ`
> phải trích **nguyên văn** yêu cầu SEC đó.
>
> Bắt buộc phủ các hướng sau:
> - **SEC-01** — mật khẩu không lưu plaintext: kiểm response đăng nhập thành công **không** chứa
>   field `password`; và nếu có chứa thì giá trị đó **không** được bằng mật khẩu vừa gửi.
> - **SEC-02** — JWT hợp lệ: giải mã token trả về, kiểm có `exp` (thời điểm hết hạn) và `exp` phải
>   nằm trong tương lai gần, không phải vĩnh viễn.
> - **SEC-05** — parameterized query: gửi payload SQL injection vào `email`
>   (tautology `' OR '1'='1`, comment `admin@eshop.com'--`, UNION, stacked query) và khẳng định
>   **không** đăng nhập được, **không** lộ thông báo lỗi của SQLite, **không** trả 500.
> - **Account lockout dùng như vũ khí (DoS)**: gửi request **thiếu hẳn field `password`** nhiều lần
>   vào email của người khác — kiểm xem có khóa được tài khoản của họ không.
> - **Rò rỉ thông tin**: so sánh response giữa *email không tồn tại* và *email tồn tại, sai mật khẩu* —
>   hai response phải **không phân biệt được** (FR-02).
> - **Trả về thừa dữ liệu**: response không được chứa `login_attempts`, `locked_until`, hay bất kỳ
>   cột nội bộ nào ngoài tập field mà đặc tả định nghĩa.
>
> ID tiếp nối. `Nguồn` = `AI`. Cùng 12 cột.

Kỳ vọng: **8–12 case**.

**Ghi log:** `LOG-005`.

---

### Bước 5 — Sinh case nhóm **Schema validation**

> **Prompt:**
>
> Vẫn `POST /api/login`. Bây giờ **chỉ** viết test case **schema validation**: response shape phải
> khớp **chính xác** với đặc tả.
>
> Bắt buộc phủ:
> - Response 200: có **đủ** `message`, `token`, `user`; `token` là string; `user` là object.
> - Response 200: **không có field thừa** ngoài tập đặc tả định nghĩa.
> - Response lỗi 401/403: đúng shape `{error: string}`, **không** kèm stack trace hay tên bảng.
> - `Content-Type` luôn là `application/json` ở **mọi** nhánh, kể cả nhánh lỗi.
> - Kiểu dữ liệu từng field trong `user` (nếu đặc tả định nghĩa): `id` là number, `email` là string, v.v.
> - Response khi body rỗng `{}`, body **không phải JSON** (gửi text thuần), body là **mảng** thay vì object.
>
> Với mỗi case ghi ở cột `Expected body / schema` một khẳng định cụ thể để viết được thành `pm.test`
> dùng `pm.response.to.have.jsonSchema(...)` hoặc kiểm field trực tiếp.
>
> ID tiếp nối. `Kỹ thuật` = `Schema`. `Nguồn` = `AI`. Cùng 12 cột.

Kỳ vọng: **7–10 case**.

**Ghi log:** `LOG-006`.

---

### Gộp lại

Dán cả 4 bảng vào `test-cases/api-01-login/generated.md` theo khung có sẵn, rồi điền bảng phân bố:

| Kỹ thuật | Số case |
|---|--:|
| Domain | … |
| State | … |
| Security | … |
| Schema | … |
| **Tổng** | **≥35** |

Chưa đủ 35 thì **đừng độn case rác**. Quay lại bước 2, tìm phân vùng còn thiếu (thường là: sai kiểu
dữ liệu, khoảng trắng đầu-cuối, Unicode, và các biến thể của auth).

**Commit:** `test(api-01): sinh test case bang AI theo 5 buoc (§6.1)`

---

## 4. API-02 · `POST /api/apply-coupon` — chỉnh gì so với API-01

Quy trình y hệt 5 bước. Chỉ đổi phần tài liệu dán và các hướng bắt buộc phủ.

**Bước 1** dán: `api_specification.md` mục **5.1**, **4.3**, **4.6**, **6.2** · **FR-08, FR-09, FR-10**
· bảng SEC · `server.js` dòng 363–443 (apply-coupon), 297–310 (checkout), 321–343 (cancel),
525–560 (admin status) · `database.js` dòng 105–111 (seed coupon).

Thêm 3 câu hỏi vào bước 1:

> 7. FR-09 có **5 điều kiện C1…C5**. Với mỗi điều kiện: code kiểm ở dòng nào? Điều kiện nào **không**
>    được kiểm ở đâu cả?
> 8. Công thức tính `discount_amount` theo FR-09 là gì? Công thức trong code là gì? Với coupon `SAVE10`
>    (`type=percent`, `discount_value=10`) và `total_amount = 500000`, hai công thức cho ra số bao nhiêu?
> 9. `user_id` được lấy từ đâu — token hay body? Nếu client **không gửi** `user_id` thì nhánh nào
>    của code chạy, và điều kiện nào bị bỏ qua?

**Bảng phân vùng (bước 2)** phải phủ 3 tham số + 4 mã coupon seed:

| Tham số | Phân vùng bắt buộc có |
|---|---|
| `code` | tồn tại & active (`SAVE10`,`BIGBUY`,`VIP100`) · **hết hạn** (`EXPIRED`) · không tồn tại · rỗng · thiếu hẳn · sai kiểu (số/mảng/object) · khác hoa-thường (`save10`) · có khoảng trắng (` SAVE10 `) · payload SQLi |
| `total_amount` | **đúng bằng** `min_order_amount` (**biên — C3 nói `>=`**) · `min − 1` · `min + 1` · `0` · âm · thiếu hẳn · chuỗi số `"500000"` · số cực lớn · số thập phân |
| `user_id` | của chính mình · **của người khác (IDOR)** · **không gửi (bỏ qua C5)** · không tồn tại · âm · sai kiểu |
| *(auth ẩn)* | không token · token user · token admin · token rác — **C4 đòi phải có token** |

**Bước 4a (State) của API-02 là phần nặng nhất của cả bài** — đây là chỗ phủ FR-10 mà §6 gọi tên:

> **Prompt bước 4a (API-02):**
>
> Bây giờ **chỉ** viết test case **state transition** cho luồng nghiệp vụ:
> `login` → `POST /api/cart` → `POST /api/apply-coupon` → `POST /api/checkout` (đơn hàng sinh ra ở
> trạng thái `pending`) → đổi trạng thái đơn.
>
> Máy trạng thái theo **FR-10**: [dán nguyên sơ đồ FR-10 và mục "Ràng buộc trạng thái kết thúc"]
>
> Bắt buộc phủ, mỗi ý ít nhất 1 case, expected bám **FR-10** chứ không bám code:
> - Chuỗi hợp lệ đầy đủ: `pending → confirmed → shipping → delivered`, mỗi bước 1 case, verify bằng
>   `GET /api/orders/:id` sau mỗi bước.
> - Hủy hợp lệ từ `pending`; hủy hợp lệ từ `confirmed`.
> - **Hủy không hợp lệ từ `shipping`** — FR-10 chỉ cho hủy khi `pending`/`confirmed`.
> - **Chuyển ra khỏi trạng thái kết thúc**: `delivered → shipping`, `canceled → delivered`,
>   `canceled → pending`. FR-10 nói `delivered` và `canceled` **không được chuyển sang trạng thái nào khác**.
> - Nhảy cóc: `pending → shipping`, `pending → delivered`.
> - Trạng thái không tồn tại: `status = "abc"`, `status = ""`, thiếu hẳn `status`.
> - Đổi trạng thái đơn hàng của **người khác** bằng token user thường.
> - **Đổi trạng thái bằng token user thường thay vì admin** (SEC-03).
> - `apply-coupon` **sau khi** đơn đã checkout — coupon còn áp được cho đơn đã chốt không?
> - Mã `VIP100` (`max_uses_per_user = 2`): lượt 1 được · ghi usage · lượt 2 được · ghi usage ·
>   **lượt 3 phải bị chặn** (C5). Mỗi lượt là 1 case, có bước `POST /api/coupon-usage` xen giữa.
>
> Ghi rõ ở cột `Tham số & phân vùng` mỗi case là bước thứ mấy và phụ thuộc case nào.
> `Kỹ thuật` = `State`. Cùng 12 cột.

Kỳ vọng riêng nhóm State của API-02: **12–16 case**.

**Bước 4b (Security) của API-02** thêm các hướng:

> - **SEC-02**: gọi `apply-coupon` **không có token** — FR-09 **C4** đòi phải đăng nhập.
> - **IDOR**: gửi `user_id` của user khác để dò hạn mức của họ.
> - **Bỏ qua C5**: **không gửi** `user_id` → kiểm xem `max_uses_per_user` có còn hiệu lực không.
> - **IDOR đọc đơn hàng**: `GET /api/orders/:id` với đơn của người khác, và **không có token**.
> - **Price tampering**: `POST /api/checkout` với `total_amount` do client tự đặt (ví dụ `1`) trong
>   khi giỏ hàng trị giá 30.000.000 — server có tính lại không?
> - **SEC-03**: `PUT /api/admin/orders/:id/status` bằng token **user thường**.
> - **SEC-05**: SQLi vào `code`.
> - **Giá trị âm**: `total_amount` âm, và kiểm `final_amount` **không bao giờ âm**.

**Bước 5 (Schema) của API-02** phải kiểm: `{success, coupon_id, discount_amount, final_amount, message}`
đủ và đúng kiểu; `discount_amount` là **số không âm**; `final_amount = total_amount − discount_amount`;
`final_amount ≤ total_amount`; nhánh lỗi đúng `{error: string}`.

> **Case then chốt của cả bài:** `SAVE10` + `total_amount = 500000`. FR-09 nói
> `discount_amount = 500000 × 10 / 100 = 50000`, `final_amount = 450000`. Đặt expected **đúng như
> FR-09**. Cứ để nó đỏ — đó là bug nặng nhất bạn tìm được ở API này.

---

## 5. API-03 · `PUT /api/products/:id` — chỉnh gì

**Bước 1** dán: `api_specification.md` mục **3.2**, **3.3** · **FR-15** · bảng SEC ·
`server.js` dòng 159–198 · hàm `authenticateToken`.

Thêm câu hỏi vào bước 1:

> 7. Handler `PUT /api/products/:id` có middleware `authenticateToken` không? So sánh với
>    `POST /api/admin/import-products` (dòng 199) — hai endpoint cùng thuộc quyền admin theo FR-15/FR-16
>    nhưng có được bảo vệ giống nhau không?
> 8. Nếu body **thiếu** trường `description`, câu lệnh `UPDATE` ghi giá trị gì vào cột đó?
> 9. Nếu `:id` không tồn tại, `this.changes` bằng bao nhiêu và handler trả status gì?
> 10. `GET /api/products/:id` xử lý thế nào khi không tìm thấy? Có biến đổi gì trên trường `price` không —
>     chỉ rõ dòng.

**Bảng phân vùng (bước 2)**:

| Tham số | Phân vùng bắt buộc có |
|---|---|
| `:id` (path) | tồn tại (1–5) · không tồn tại (999999) · `0` · âm · chữ (`abc`) · rỗng · số thập phân · số cực lớn · SQLi |
| `name` | hợp lệ · **rỗng** · thiếu hẳn · **255 ký tự (biên trên)** · **256 ký tự (biên trên + 1)** · sai kiểu · Unicode có dấu · khoảng trắng đầu-cuối · payload XSS/HTML |
| `price` | hợp lệ · **`1` (biên dưới, FR-15 đòi > 0)** · **`0` (biên dưới − 1)** · **âm** · chuỗi số · chuỗi chữ · `null` · thiếu hẳn · số cực lớn · thập phân |
| `description` | hợp lệ · rỗng · thiếu hẳn · rất dài |
| `imageUrl` | URL hợp lệ · rỗng · không phải URL · `javascript:` |
| `category_id` | tồn tại (1–3) · **không tồn tại (999)** · `0` · âm · chuỗi · thiếu hẳn |
| *(auth ẩn)* | **không token** · token user thường · token admin · token rác · token sai chữ ký · header sai định dạng (thiếu `Bearer`) |

**Bước 4a (State) của API-03** là **vòng đời sản phẩm**:

> Chuỗi: `POST /api/products` tạo mới → lưu `id` → `GET /api/products/:id` verify vừa tạo →
> `PUT` cập nhật → `GET` verify đã đổi → `PUT` **cập nhật một phần** (chỉ gửi `name`) →
> `GET` verify **các trường khác có bị mất không** (FR-15: *"chỉ sản phẩm đó bị thay đổi"*) →
> `DELETE` → `GET` verify đã xóa (phải 404) → `PUT` lên **sản phẩm đã xóa** (phải 404, không phải 200) →
> `GET /api/products` verify **tổng số sản phẩm** quay về mốc ban đầu.
> Thêm 1 case: sửa sản phẩm `id=2` rồi kiểm sản phẩm `id=3` **không đổi** (FR-15).

**Bước 4b (Security) của API-03**:

> - **SEC-02**: `PUT` **không có header `Authorization`** — FR-15 nói đây là chức năng của admin.
> - **SEC-03**: `PUT` với token **user thường** — phải 403.
> - Token rác / sai chữ ký / thiếu tiền tố `Bearer` / header rỗng — 4 case riêng.
> - **SEC-05**: SQLi vào `:id` và vào `name`.
> - **SEC-04**: `name` chứa `<script>alert(1)</script>` — response phải trả về **dữ liệu**, `Content-Type`
>   là `application/json`, không phải HTML.
> - **Mass assignment**: gửi thêm field không có trong đặc tả (`id`, `role`, `is_admin`) — có bị ghi vào DB không?
> - **Vượt quyền qua id**: user thường sửa sản phẩm bất kỳ.

**Bước 5 (Schema) của API-03** phải kiểm cả `PUT` lẫn `GET` verify:

> - `PUT` thành công: `{message: string}`, `Content-Type` JSON.
> - `PUT` id không tồn tại: expected **404** theo lẽ thường của REST — ghi căn cứ là
>   *"đặc tả im lặng; suy từ `GET /api/products/:id` là thao tác trên **một** tài nguyên"*, và **ghi
>   rõ trong cột Căn cứ rằng đây là suy luận**, không phải câu chữ đặc tả.
> - `GET` sau `PUT`: `price` phải là **number** — kiểm với **cả `id` lẻ lẫn `id` chẵn**
>   (`server.js:162` biến `price` thành chuỗi khi `id` chẵn).
> - `GET` sản phẩm không tồn tại: phải 404 + `{error}`, không phải `200 {}`.

---

## 6. Ba lỗi AI hay mắc ở bước này — soát trước khi sang [04](04-AUDIT.md)

| Lỗi | Dấu hiệu | Cách sửa |
|---|---|---|
| **Bịa expected** | cột `Căn cứ` ghi "hợp lý"/"thông thường"/để trống | hạ expected xuống phần spec bảo đảm (status + schema), ghi căn cứ là "đặc tả im lặng" |
| **Assertion yếu** | `Expected body` chỉ ghi "trả về thành công" | viết lại thành khẳng định kiểm được: field nào, kiểu gì, giá trị bao nhiêu |
| **Expected chép theo code** | expected khớp y hệt hành vi hiện tại của SUT, kể cả chỗ trái FR | expected **luôn** bám FR/SEC; chỗ code lệch FR chính là bug cần bắt |

Lỗi thứ ba là lỗi nguy hiểm nhất và hay xảy ra khi bạn dán `server.js` cho AI ở bước 1. Nhắc lại
trong prompt bước 3–5: *"expected bám FR/SEC, không bám hành vi hiện tại của code"*.
