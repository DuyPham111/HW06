# 13 — §9 AI Audit Report + §10 AI Critique (cả hai **bắt buộc**)

> Output: `ai-audit/ai-audit-report.md` + `.pdf`, `ai-audit/ai-critique.md` + `.pdf`.
> §17: **thiếu tài liệu bắt buộc = 0 điểm.**
> **Commit:** `docs: AI audit report + AI critique (§9, §10)`

---

## 1. §9 đòi gì — 4 trường cho **mỗi lượt** hỏi AI

Lời khai bắt buộc ở đầu file:

> **"I use AI tools for the following tasks."**

Rồi với **mỗi** lượt tương tác:

| Trường | Ghi gì |
|---|---|
| **Name of the AI tool** | `Claude Code (Opus 5)` — ghi cả model |
| **Date and time** | ngày giờ **thật**, ví dụ `30/08/2026 14:22` |
| **Your prompt** | **nguyên văn**, trong code block. Không tóm tắt, không sửa cho đẹp |
| **The AI output** | output nguyên văn hoặc trích đủ dài để hiểu. Dài quá thì tóm tắt + trỏ tới file chứa bản đầy đủ |

**Ba trường thêm cho HW06** (không bắt buộc nhưng là chỗ ăn điểm §6.2 và §10):

| Trường thêm | Ghi gì |
|---|---|
| **AI sai gì** | cụ thể: sai số liệu nào, hiểu sai đặc tả nào |
| **Vì sao sai** | `prompt quality` / `model limitations` / `characteristics of the API` |
| **Human review** | bạn đã sửa gì, ngày nào |

---

## 2. Ghi log **ngay lúc làm**, đừng dựng lại sau

Đây là lỗi phổ biến nhất. Dựng lại log sau 2 tuần thì:

- Prompt không còn nguyên văn → §9 đòi "your prompt", không phải "đại ý prompt".
- Ngày giờ thành bịa → §11 kiểm bằng chứng thật.
- Mục "AI sai gì" trống rỗng, vì bạn đã quên.

**Cách làm rẻ nhất:** mở sẵn `ai-audit/ai-audit-report.md` ở tab bên cạnh. Sau **mỗi** lượt hỏi AI,
copy prompt + output vào ngay, đánh số `LOG-0xx`. Mất 30 giây/lượt.

Bài này có khoảng **20–25 lượt**: 5 lượt sinh case × 3 API = 15, cộng audit, extend, collection,
CI, generator, báo cáo.

---

## 3. Khuôn một mục log

```markdown
### LOG-004 — API-01 bước 4a: sinh test case nhóm State transition

| | |
|---|---|
| **AI tool** | Claude Code (Opus 5) |
| **Ngày giờ** | 02/09/2026 15:40 |
| **Giai đoạn** | §6.1 bước 4a — nhóm State |
| **File bị ảnh hưởng** | `test-cases/api-01-login/generated.md` |

**Prompt (nguyên văn):**

```
Vẫn POST /api/login. Bây giờ chỉ viết test case cho state transition, không viết nhóm khác.
Trạng thái ở đây là trạng thái khóa của tài khoản theo FR-02, đi qua chuỗi: ...
```

**Output của AI:** 6 test case `TC-LOGIN-021` … `TC-LOGIN-026` (bảng đầy đủ trong
`test-cases/api-01-login/generated.md`, nhóm `State`).

**AI sai gì:** `TC-LOGIN-023` đặt expected *"sai mật khẩu lần 2 → 403 tài khoản bị khóa"* và ghi
căn cứ là `FR-02`. **FR-02 nói khóa từ lần thứ 3.** AI đã chép hành vi của code (`login_attempts += 2`,
`server.js:54`) rồi dán nhãn FR-02 lên.

**Vì sao sai:** `model limitations` — nó đọc `if (newAttempts >= 3)` và khớp thẳng với câu chữ
"3 lần" trong FR-02, mà không cộng dồn bước nhảy `+2` qua từng request. Đây là lỗi *không mô phỏng
trạng thái qua nhiều request*.

**Human review (SV 23127183, 02/09/2026):** sửa expected của `TC-LOGIN-023` thành *"lần 2: vẫn 401,
CHƯA khóa"*, thêm `TC-LOGIN-024` *"lần 3 mới khóa"*. Case đã sửa đỏ khi chạy → đó là **BUG-02**.
```

> Mục "AI sai gì" của log này chính là **nguyên liệu của §10 AI Critique**. Viết log tử tế thì
> critique tự có nội dung, không phải nghĩ lại từ đầu.

---

## 4. §10 AI Critique — 200–300 từ, phải trả lời **3 câu hỏi**

Đề: *"Where did the AI get something wrong, biased, or incomplete? Why did it fail to catch the
issue? What principle have you learned about collaborating with AI during this assignment?"*

### Dàn ý — 4 đoạn, khoảng 260 từ

| Đoạn | Nội dung | Số từ |
|---|---|---|
| 1 | **Một lỗi cụ thể**, có số liệu: AI sai gì, ở test case nào, hậu quả nếu không phát hiện | ~70 |
| 2 | **Vì sao** nó sai — dùng đúng 1 trong 3 nhóm lý do của đề, giải thích **cơ chế** | ~70 |
| 3 | **Lỗi thứ hai khác loại** — ví dụ chỗ AI *bỏ sót* thay vì *làm sai* | ~60 |
| 4 | **Nguyên tắc rút ra**, phát biểu thành câu dùng được cho bài sau | ~60 |

### Ba chất liệu tốt nhất bạn có ở bài này

1. **AI chép hành vi code rồi dán nhãn đặc tả lên.** Case khóa tài khoản (§3 ở trên). Đây là lỗi
   nguy hiểm nhất vì test **xanh** — bạn mất một phát hiện mà không hề biết. Nếu chỉ đọc kết quả
   Newman thì không bao giờ thấy.
2. **AI không thực hiện phép tính.** Công thức coupon `total × (1 − 10)`. AI đọc được câu lệnh, mô tả
   được nó, nhưng không thay số vào để thấy `discount_amount` ra **âm**. Nó nhận dạng cấu trúc, không
   đánh giá biểu thức.
3. **AI đánh giá test security bằng status code, không bằng hệ quả.** Nó sinh case *"PUT không token
   → expected 401"* mà không sinh bước `GET` kiểm dữ liệu **đã thật sự bị đổi**. Một test SQLi/authz
   chỉ có nghĩa nếu chứng minh được **tác động**.

### Nguyên tắc để kết bài (chọn 1, viết bằng lời của bạn)

- *"AI suy từ tài liệu; con người phải cung cấp **trạng thái** và **phép tính**. Cái gì cần cộng dồn
  qua nhiều request hoặc cần thay số vào công thức thì phải tự làm và tự kiểm."*
- *"Expected không có căn cứ là nợ kỹ thuật, không phải test case. Bắt AI ghi cột `Căn cứ` cho mọi
  dòng là cách rẻ nhất để lộ ra chỗ nó đang đoán."*
- *"Khi đưa mã nguồn cho AI đọc, phải nhắc lại rằng expected bám đặc tả chứ không bám code — nếu
  không, nó sẽ viết một bộ test luôn xanh trên một hệ thống đang sai."*

### Luật viết

- **Đếm từ thật.** 200–300 từ. Dưới 200 hoặc trên 300 là không đạt yêu cầu định lượng.
- **Có số liệu cụ thể** — tên test case, giá trị sai, số bug. Đừng viết chung chung.
- **Đừng ca ngợi AI.** Đề hỏi *"where did the AI get something wrong"*.
- **Đừng chê AI kiểu cảm tính** (*"AI không thông minh"*). Phải chỉ ra **cơ chế**.

---

## 5. Xuất PDF

§14 đòi cả `.md` **và** `.pdf` cho main report và AI audit.

Cách nhanh nhất trên Windows — VS Code + extension **Markdown PDF**:

1. Cài extension `yzane.markdown-pdf`.
2. Mở file `.md` → `Ctrl+Shift+P` → **Markdown PDF: Export (pdf)**.
3. File `.pdf` sinh ra cạnh file `.md`.

**Kiểm sau khi xuất:** mở PDF, xem bảng có bị cắt cột không, ảnh có hiện không, tiếng Việt có dấu
có đúng font không. Bảng 12 cột thường bị tràn — nếu tràn thì trong PDF chỉ giữ bảng rút gọn và ghi
*"bảng đầy đủ trong file `.md` / Excel"*.

Các file cần xuất PDF:

- [ ] `report/main-report.md`
- [ ] `ai-audit/ai-audit-report.md`
- [ ] `ai-audit/ai-critique.md`
- [ ] `bug-report/bug-report.md`
- [ ] `ci/ci-report.md`
- [ ] `generator/design.md`

---

## 6. Checklist

- [ ] `ai-audit-report.md` có lời khai *"I use AI tools for the following tasks."*
- [ ] ≥20 mục log, mỗi mục đủ 4 trường §9
- [ ] ≥5 mục có phần "AI sai gì" + "vì sao" + "human review có ngày"
- [ ] `ai-critique.md` **đếm được 200–300 từ**, trả lời đủ 3 câu hỏi, có số liệu cụ thể
- [ ] Đã xuất PDF cả 6 file, mở kiểm bảng/ảnh/font
- [ ] Commit: `docs: AI audit report + AI critique (§9, §10)`
