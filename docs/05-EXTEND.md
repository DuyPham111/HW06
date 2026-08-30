# 05 — §6.3 Extend: ≥5 case **của bạn** mà AI bỏ sót + giải thích **vì sao** AI bỏ sót

> Output mỗi API: `test-cases/api-0X-*/extended.md`.
> **Commit:** `test(api-01): 5+ case bo sung va ly do AI bo sot (§6.3)`

---

## 1. Đọc kỹ câu chữ của §6.3 — chỗ này rất dễ mất điểm

Nguyên văn: *"Add at least **five test cases of your own** that the AI missed — especially around
security and state transitions — and explain **why** the AI missed them (prompt quality, model
limitations, or characteristics of the API)."*

Hai vế:

1. **"of your own"** — case do **bạn** chọn phạm vi, không phải do AI sinh ở lượt hai.
2. **"explain why the AI missed them"** — phân loại vào **đúng 3 nhóm lý do** mà đề đặt tên.

> **Cái bẫy:** cách nhanh nhất là hỏi lại AI *"còn thiếu case nào không"* rồi dán kết quả và ghi
> `Nguồn = SV`. Đó là **misattribution**, và §11 phạt đúng loại đó. Bài tham khảo (đã 100đ) thậm chí
> viết hẳn cảnh báo này vào file của họ: case AI sinh ở lượt hai được đánh dấu `AI-2` và **không**
> được tính vào §6.3.
>
> **Cách làm đúng và vẫn nhanh:** *bạn* quyết định **kiểm cái gì, ở đâu, vì sao đáng kiểm**; AI chỉ
> chấp bút thành dòng bảng. Ghi trong `extended.md` đúng như vậy. Đó là sự thật, và nó vẫn thỏa
> "of your own" vì phần **thiết kế** là của bạn.

---

## 2. Ba nhóm lý do — dùng đúng tên của đề

| Nhóm | Nghĩa | Dấu hiệu nhận ra |
|---|---|---|
| **prompt quality** | Prompt của bạn hướng AI đi sai chỗ | Bạn viết *"security: SQL injection"* nên AI sinh toàn payload tấn công, bỏ mất trường hợp **dữ liệu thật** chứa ký tự đặc biệt |
| **model limitations** | AI không mô phỏng được thứ cần nhiều bước / cần suy diễn số học | Không cộng dồn trạng thái qua nhiều request; không tự tính `1 − 10 = −9` để thấy công thức sai; đánh giá test security bằng **status code** thay vì bằng **hệ quả lên dữ liệu** |
| **characteristics of the API** | Hành vi nằm ở tầng dưới, không có trong đặc tả | `LIKE` của SQLite chỉ case-insensitive với ASCII; `price` bị ép thành chuỗi khi `id` chẵn; middleware thiếu ở một route mà có ở route "anh em" |

---

## 3. Cách tìm case AI bỏ sót — 4 cách, làm theo thứ tự

### Cách 1 — Đối chiếu với bug đã biết từ HW02/HW04/HW05

Bạn có sẵn 16 bug ID từ HW02 trên đúng 3 FR này. Mở `HW02/reports/Bug_Report.md`, với mỗi bug hỏi:
*"nhìn từ tầng API thì bug này là request nào?"* Bug ở tầng UI thường có **anh em ở tầng API mạnh
hơn** — vì UI có validate phía client che bớt, còn API thì không.

Ví dụ: HW02 bạn tìm được bug khóa tài khoản sai ngưỡng qua form đăng nhập. Ở tầng API, case mạnh
hơn là: **gửi request thiếu hẳn field `password`** — UI không cho làm việc đó, API thì có. AI bỏ sót
vì nó suy từ đặc tả, mà đặc tả không mô tả trường hợp thiếu trường.

### Cách 2 — Đi từ **hệ quả**, không đi từ status code

AI đánh giá test qua status code. Bạn đánh giá qua **dữ liệu có thật sự đổi không**.

| AI sinh | Bạn thêm |
|---|---|
| `PUT /api/products/3` không token → expected 401 | …**rồi** `GET /api/products/3` kiểm `name` **có bị đổi thật không**. Nếu SUT trả 200 và dữ liệu đã đổi thì đây là bug Critical, không phải "sai status code" |
| SQLi vào `code` → expected không lộ lỗi | …**rồi** `GET /api/coupons` kiểm bảng `coupons` **còn nguyên** |
| `total_amount` âm → expected 400 | …**rồi** kiểm `final_amount` **không âm** ở mọi nhánh trả 200 |

### Cách 3 — Tìm phân vùng "dữ liệu hợp lệ chứa ký tự đặc biệt"

AI gắn ký tự đặc biệt với ngữ cảnh tấn công, nên bỏ mất phân vùng *người dùng thật gõ ký tự đó*.

- `name = "Bàn phím 100% cơ"` — `%` là ký tự hợp lệ trong tên sản phẩm.
- `name = "O'Brien"` — dấu nháy đơn trong tên riêng bình thường.
- `email = "nguyen.van.a+test@domain.com"` — dấu `+` hợp lệ theo RFC 5322.
- `code = " SAVE10 "` — người dùng copy-paste kèm khoảng trắng.

Đây là nhóm **prompt quality**: bạn đã viết "security: SQL injection" nên AI xếp mọi ký tự lạ vào ô
"tấn công". Case này quan trọng vì nó cho thấy lỗi ảnh hưởng **người dùng thật**, không chỉ kẻ tấn công.

### Cách 4 — So sánh route "anh em"

Mở `server.js`, tìm hai route cùng nhóm nghiệp vụ nhưng bảo vệ khác nhau. Chênh lệch đó gần như luôn
là bug, và AI không thấy vì nó đọc từng endpoint riêng lẻ.

| Route | Có `authenticateToken`? |
|---|---|
| `POST /api/admin/import-products` (FR-16) | **có** |
| `PUT /api/products/:id` (FR-15) | **không** |
| `POST /api/products` (FR-15) | **không** |
| `PUT /api/categories/:id` | **có** |

→ Case của bạn: *"`PUT /api/products/:id` không có token — so sánh với `PUT /api/categories/:id` cùng
là thao tác admin trên tài nguyên: một cái được bảo vệ, một cái không."* Lý do AI bỏ sót: **characteristics
of the API** — chênh lệch chỉ thấy khi đọc **nhiều** route cạnh nhau.

---

## 4. Gợi ý cụ thể — ít nhất 5 case cho mỗi API

Đây là **gợi ý để bạn chọn**, không phải danh sách chép. Với mỗi case bạn chọn, tự viết lý do bỏ sót
theo đúng ngữ cảnh prompt của bạn.

### API-01 · `POST /api/login`

| # | Case của bạn | Nhóm lý do |
|---|---|---|
| 1 | Gửi `{email: "test@eshop.com"}` **thiếu hẳn `password`** 3 lần → kiểm tài khoản người khác có bị khóa không. Đây là **DoS bằng cơ chế lockout** | model limitations — cần cộng dồn trạng thái qua 3 request |
| 2 | Sau khi bị khóa, **chờ hết hạn** rồi sai **1 lần nữa** → kiểm `login_attempts` đã reset chưa (FR-02 ngụ ý bộ đếm là "liên tiếp") | model limitations |
| 3 | Giải mã JWT trả về, kiểm có claim `exp` và `exp` trong tương lai gần | characteristics of the API — token không hết hạn chỉ thấy khi **decode**, không thấy qua status |
| 4 | So sánh **byte-by-byte** response của *email không tồn tại* và *email tồn tại + sai mật khẩu* | prompt quality — prompt nói "kiểm bảo mật", không nói "so sánh hai response với nhau" |
| 5 | `email` là **object** `{"$ne": null}` (kiểu NoSQL injection) → kiểm không 500, không lộ lỗi driver | prompt quality — prompt chỉ nói SQL injection |
| 6 | Đăng nhập đúng rồi kiểm response **không** chứa `login_attempts`, `locked_until`, `password` | model limitations — AI kiểm field **có mặt**, ít khi kiểm field **không được có** |

### API-02 · `POST /api/apply-coupon`

| # | Case của bạn | Nhóm lý do |
|---|---|---|
| 1 | `SAVE10` + `total_amount = 300000` (**đúng bằng** `min_order_amount`) → FR-09 C3 nói `>=` nên phải **được chấp nhận** | model limitations — AI đọc `>` trong code rồi coi đó là đúng |
| 2 | Áp `SAVE10` cho `total_amount = 500000` → kiểm **`discount_amount = 50000`** và **`final_amount = 450000`** theo đúng công thức FR-09 | model limitations — phải **tự tính** `1 − 10 = −9` mới thấy công thức sai |
| 3 | `VIP100` lượt 1 → ghi usage → lượt 2 → ghi usage → **lượt 3 phải bị chặn**; rồi lặp lại **không gửi `user_id`** → kiểm C5 có bị bỏ qua không | model limitations — chuỗi 6 request có trạng thái |
| 4 | `apply-coupon` với `user_id` của **admin** (id khác mình) trong khi đăng nhập bằng user thường → **IDOR** | characteristics of the API — `user_id` nằm ở body, chỉ thấy khi đọc kỹ đặc tả §5.1 |
| 5 | `POST /api/checkout` với `total_amount = 1` sau khi giỏ có hàng 30.000.000 → **price tampering**; verify bằng `GET /api/orders/:id` | prompt quality — prompt tập trung vào coupon, không nói tới endpoint kế tiếp trong luồng |
| 6 | Đơn ở `canceled` → `PUT /api/admin/orders/:id/status` sang `delivered` → FR-10 nói `canceled` là **trạng thái kết thúc** | characteristics of the API — code có hẳn một dòng cho phép chuyển này |
| 7 | Đơn ở `shipping` → `PUT /api/orders/:id/cancel` → FR-10 chỉ cho hủy khi `pending`/`confirmed` | model limitations |
| 8 | `PUT /api/admin/orders/:id/status` bằng token **user thường** (SEC-03) | characteristics of the API — route có tiền tố `/admin/` nên AI mặc định là đã kiểm role |

### API-03 · `PUT /api/products/:id`

| # | Case của bạn | Nhóm lý do |
|---|---|---|
| 1 | `PUT` **chỉ gửi `{name}`** → `GET` kiểm `price`, `description`, `category_id` **có bị xóa thành null không** (FR-15) | model limitations — cần 2 request và so sánh trước/sau |
| 2 | `PUT` **không token** → `GET` kiểm dữ liệu **đã thật sự đổi**, không chỉ kiểm status | model limitations |
| 3 | `PUT` `price = 0` và `price = -1` → `GET` kiểm giá trị **đã bị ghi vào DB** chưa (FR-15: giá phải > 0) | prompt quality |
| 4 | Sửa `id=2`, rồi `GET /api/products/3` kiểm sản phẩm **khác không đổi** (FR-15: *"chỉ sản phẩm đó bị thay đổi"*) | prompt quality — không ai nói với AI rằng phải kiểm **tác dụng phụ** |
| 5 | `GET /api/products/2` (**id chẵn**) kiểm `price` là **number** — so với `GET /api/products/1` (id lẻ) | characteristics of the API — nằm ở `server.js:162`, không có trong đặc tả |
| 6 | `PUT` kèm field lạ `{"id": 999, "role": "admin"}` → **mass assignment**; `GET` kiểm `id` không đổi | prompt quality |
| 7 | `PUT /api/products/999999` → 200 hay 404? Rồi `GET /api/products` kiểm **tổng số sản phẩm không tăng** | model limitations — kiểm hệ quả thay vì status |
| 8 | `name` **256 ký tự** (biên trên + 1 theo FR-15) → `GET` kiểm độ dài đã lưu | prompt quality |

---

## 5. Viết `extended.md`

Khung có sẵn 2 phần:

**Phần 1 — bảng test case** (12 cột, `Nguồn = SV`, ID từ `101` trở đi).

**Phần 2 — bảng lý do bỏ sót** (đây là phần được chấm):

| TC ID | AI bỏ sót gì | Nhóm lý do | Giải thích |
|---|---|---|---|
| TC-…-101 | *cụ thể AI đã sinh gì và thiếu gì* | prompt quality / model limitations / characteristics of the API | *2–4 câu, nói rõ **cơ chế** khiến nó bỏ sót, không nói chung chung "AI chưa đủ thông minh"* |

**Giải thích tốt trông thế nào** (mẫu, cho case API-02 #2):

> Prompt bước 5 của tôi yêu cầu *"kiểm response shape khớp đặc tả"*, và AI hiểu "shape" là **có đủ
> field và đúng kiểu**. Nó sinh case kiểm `discount_amount` là number, nhưng không sinh case kiểm
> **giá trị** của nó. Muốn thấy sai thì phải tự thay số vào công thức trong code:
> `Math.floor(500000 × (1 − 10))` = `−4500000`, trong khi FR-09 cho `50000`. AI đọc code nhưng không
> thực hiện phép tính đó — đây là **model limitations**: nó nhận dạng cấu trúc câu lệnh chứ không
> đánh giá biểu thức số học. Case này quan trọng vì `final_amount` **lớn hơn** `total_amount`, tức là
> khách được "giảm giá" thành mất thêm tiền.

**Giải thích kém** (đừng viết thế này): *"AI bỏ sót vì nó không đủ thông minh và không hiểu nghiệp vụ."*

---

## 6. Checklist mỗi API

- [ ] ≥5 case, `Nguồn = SV`, ID từ 101
- [ ] Mỗi case có ≥1 case thuộc nhóm **security** và ≥1 thuộc nhóm **state transition** (đề nhấn *"especially"*)
- [ ] Bảng lý do bỏ sót đủ 5 dòng, mỗi dòng thuộc **đúng 1 trong 3 nhóm** đề đặt tên
- [ ] Có câu ghi rõ **bạn** chọn phạm vi case, AI chỉ chấp bút (nếu đúng như vậy)
- [ ] Commit: `test(api-0X): 5+ case bo sung va ly do AI bo sot (§6.3)`
