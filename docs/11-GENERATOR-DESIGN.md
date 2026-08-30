# 11 — §7 AI-driven API Test Generator: thiết kế + **sơ đồ TỰ VẼ** + pseudocode

> Output: `generator/design.md`, `generator/pseudocode.py`, `generator/diagram/generator-flow-selfdrawn.png`.
> **Đây là 10 điểm của tiêu chí 4.**
> **Commit:** `feat(generator): thiet ke + so do tu ve (§7)`

---

## 1. §7 đòi gì

*"For the Create level (G9.5), design an AI-driven API test generator for the SUT: given the API
specification, it produces test cases automatically. Provide a **self-drawn diagram** and
**pseudocode** of the design. ('Self-drawn' means you make the design decisions; any diagramming tool
is fine, but the diagram itself must not be AI-generated.) You are encouraged to implement it as a
reusable Agent Skill and submit a demonstration video (YouTube link)."*

| Bắt buộc | Khuyến khích |
|---|---|
| Thiết kế generator | Hiện thực thành Agent Skill |
| **Sơ đồ tự vẽ** (§11 nhắc lại: *"must be self-drawn"*) | Video demo YouTube |
| Pseudocode | |

> **§11 nói rõ:** *"The AI test generator diagram, which must be self-drawn — designed by you, not
> generated directly by an AI."* Sơ đồ do AI sinh (Mermaid do AI viết, ảnh do AI vẽ) là **vi phạm
> danh sách chống gian**. Đây là phần dễ mất điểm nhất của §7.

---

## 2. Thiết kế: 6 giai đoạn

Đây là thiết kế của bạn, không phải của AI. Nó là **quy trình 5 bước ở [03](03-GENERATE-AI.md) được
hình thức hóa** — bạn đã chạy nó bằng tay 3 lần, giờ mô tả lại thành máy.

| GĐ | Tên | Vào | Ra | Quyết định thiết kế |
|---|---|---|---|---|
| **1** | **Parse 3 nguồn** | `api_specification.md` · FR/SEC trong `README.md` · `server.js` | danh sách tham số (tên, vị trí, kiểu, bắt buộc) + **danh sách chỗ spec im lặng** + hành vi thật kèm số dòng | **Đọc 3 nguồn, không phải 1.** Spec cho *phải làm gì*; FR/SEC cho *ràng buộc nghiệp vụ*; code cho *đang làm gì*. Chỗ **lệch** giữa 1-2 và 3 chính là bug |
| **2** | **Suy ràng buộc** | GĐ1 | luật cho từng tham số + danh sách **câu hỏi mở** | **Spec im lặng thì không bịa expected.** Hai lựa chọn hợp lệ: (a) suy từ FR/SEC và ghi rõ suy từ đâu; (b) chỉ khẳng định phần spec bảo đảm (status + schema). Một expected không căn cứ sinh ra **bug giả** |
| **3** | **Sinh case theo 4 nhóm — 4 lượt riêng** | GĐ2 | 4 tập case | **Không gộp một lượt.** §2 của đề cấm; và thực tế gộp thì AI dồn hết về security, state chỉ còn 2–3 case cho có |
| **4** | **Khử trùng + xếp thứ tự** | GĐ3 | danh sách case có ID, có thứ tự thực thi | Case state phải chạy đúng thứ tự và truyền biến; case ghi dữ liệu phải có cleanup hoặc đứng cuối |
| **5** | **Xuất artefact** | GĐ4 | bảng Markdown 12 cột · collection Postman `.json` · file CSV data-driven | Một nguồn → nhiều đích. Bảng và collection **sinh từ cùng một định nghĩa** nên không thể lệch nhau |
| **6** | **Cổng kiểm chất lượng** | GĐ5 | báo cáo "case nào chưa đạt" | Chặn 4 lỗi: expected không có căn cứ · assertion yếu hơn expected · assertion **nghiêm hơn** expected · phân vùng chưa phủ |

**Giai đoạn 6 là thứ làm thiết kế của bạn khác một prompt dài.** Nó biến 4 phép soát bằng mắt ở
[04](04-AUDIT.md) thành phép kiểm bằng máy.

---

## 3. Hai quyết định thiết kế đáng ghi lại

Viết mục này vào `generator/design.md` — nó cho thấy bạn **quyết định**, không chỉ mô tả.

**Quyết định 1 — Generator không tự kết luận bug.** Nó chỉ sinh case và expected kèm **căn cứ**.
Việc kết luận "đây là bug" là của người, sau khi chạy thật. Lý do: một generator tự gắn nhãn bug sẽ
nhân bản chính lỗi bịa expected của AI lên 100 case.

**Quyết định 2 — Đầu ra là *định nghĩa case*, không phải file cuối.** Mỗi case là một object có đủ
12 trường; bảng Markdown, collection Postman và file CSV đều **sinh ra từ object đó**. Lý do: ở
HW06 bạn phải giữ bảng test case và collection khớp nhau ở hơn 100 case — làm tay là chắc chắn lệch.

---

## 4. Vẽ sơ đồ — **phần bắt buộc tự làm**

### 4.1 Chọn công cụ

Bất kỳ công cụ nào, miễn **bạn** đặt từng hộp và từng mũi tên:

| Công cụ | Ưu | Ghi chú |
|---|---|---|
| **draw.io / diagrams.net** | miễn phí, xuất PNG, có file `.drawio` làm bằng chứng | **khuyên dùng** |
| **Lucidchart** | có Revision history — TA mở xem được lịch sử bạn chỉnh | bài tham khảo dùng cái này |
| Vẽ tay + chụp ảnh | không cãi được là tự vẽ | chữ phải đọc được |
| PowerPoint / Figma | quen tay | xuất PNG |

**Không dùng:** Mermaid do AI viết, ảnh do AI sinh, hay bảo AI "vẽ sơ đồ này giúp".

### 4.2 Nội dung sơ đồ phải có

Vẽ theo bảng §2. Tối thiểu:

- **6 hộp giai đoạn**, đánh số 1–6, theo chiều dọc hoặc trái→phải.
- **3 hộp nguồn đầu vào** ở GĐ1: `api_specification.md`, `FR/SEC (README.md)`, `server.js` — ba mũi
  tên cùng chụm vào GĐ1. (Đây là điểm nhấn của thiết kế, đừng vẽ chỉ 1 nguồn.)
- **≥3 nhánh quyết định (hình thoi)**, ví dụ:
  - GĐ2: *"Spec có nói về tham số này không?"* → **Không** → nhánh *"hạ expected xuống status + schema, ghi căn cứ = spec im lặng"*.
  - GĐ4: *"Case này có phụ thuộc case khác không?"* → **Có** → nhánh *"gán thứ tự + truyền biến môi trường"*.
  - GĐ6: *"Case đạt cả 4 phép kiểm chưa?"* → **Chưa** → mũi tên **quay ngược** về GĐ3.
- **Vòng lặp phản hồi** từ GĐ6 về GĐ3 — vẽ rõ mũi tên đi ngược.
- **4 nhóm kỹ thuật** ở GĐ3 (Domain / State / Security / Schema) là 4 nhánh song song, mỗi nhánh
  ghi *"1 lượt AI riêng"*.
- **3 đầu ra** ở GĐ5: bảng `.md`, collection `.json`, CSV.
- Góc sơ đồ ghi: `HW06 §7 — AI-driven API Test Generator — 23127183 — <ngày vẽ>`.

### 4.3 Lưu và commit

- PNG: `generator/diagram/generator-flow-selfdrawn.png` (rộng ≥1600px cho chữ đọc được).
- File nguồn: `generator/diagram/generator-flow.drawio` — **bằng chứng tự vẽ**, commit luôn.
- Nếu dùng Lucidchart: dán link chia sẻ vào `generator/diagram/README.md`, ghi thêm
  *"mở File → Revision history để xem lịch sử chỉnh"*.
- Trong `generator/design.md`, mục **§4 Sơ đồ**: nhúng ảnh + ghi *"Sơ đồ do sinh viên tự dựng trên
  \<công cụ\>, ngày dd/mm/2026. File nguồn: …"*.

> **Đừng để việc này đến hôm nộp.** Vẽ mất khoảng 30–45 phút, nhưng nó là điều kiện của 10 điểm
> tiêu chí 4 và nằm trong danh sách §11.

---

## 5. Pseudocode

File `generator/pseudocode.py` đã có khung. Ba luật khi viết:

1. **Là pseudocode mô tả thiết kế**, không phải code chạy được. Nếu bạn có bản chạy được thì ghi rõ
   nó ở đâu, và giữ pseudocode ngắn.
2. **Đánh dấu chỗ quyết định** bằng `# DECIDE:` — và **ghi luôn bạn đã quyết định thế nào**.
   Người chấm tìm đúng những dòng này, vì đó là phần *Create* (G9.5).
3. **Khớp 1-1 với 6 giai đoạn** ở §2 và với 6 hộp trong sơ đồ. Ba tài liệu phải nói cùng một điều.

---

## 6. Có nên hiện thực thật không?

§7 nói *"encouraged"*, không bắt buộc. Cân nhắc:

| | Chi phí | Lợi |
|---|---|---|
| **Chỉ thiết kế + sơ đồ + pseudocode** | ~2h | đủ điều kiện §7 |
| **Thêm 4 Agent Skill** (`.claude/skills/`) | +1h | Skill là "hiện thực" nhẹ nhất; khung đã dựng sẵn, xem [12](12-AGENT-SKILLS-VIDEO.md) |
| **Thêm script sinh thật** (`tools/gen-artifacts.mjs`) | +4–6h | mạnh nhất: chứng minh generator **đã chạy thật** và sinh ra chính bộ test bạn nộp |

**Khuyến nghị:** làm thiết kế + sơ đồ + pseudocode + 4 Agent Skill. Script sinh thật chỉ làm nếu còn
thời gian sau khi 3 API đã xong pipeline — nó không mang thêm điểm tiêu chí nào mà tốn nhiều giờ nhất.

Nếu **không** hiện thực script, ghi rõ trong `design.md` §8:

> Generator được hiện thực dưới dạng **Agent Skill** (`.claude/skills/api-test-design`,
> `api-test-audit`, `postman-newman`, `ai-audit-logger`) chứ không phải script độc lập. Lựa chọn này
> có chủ ý: 4 giai đoạn đầu của thiết kế cần **suy luận trên ngôn ngữ tự nhiên** (đọc spec, nhận ra
> chỗ spec im lặng), là việc mà LLM làm được còn parser tĩnh thì không. Giai đoạn 5–6 (xuất artefact
> và cổng kiểm) mới là phần thuần cơ khí và đã được mô tả trong pseudocode.

---

## 7. Checklist

- [ ] `generator/design.md`: 6 giai đoạn · 2 quyết định thiết kế · giới hạn đã biết
- [ ] `generator/pseudocode.py`: khớp 6 giai đoạn, có ≥4 dòng `# DECIDE:` kèm quyết định
- [ ] **Sơ đồ tự vẽ** PNG ≥1600px, có 6 hộp + 3 nguồn + ≥3 nhánh quyết định + vòng lặp GĐ6→GĐ3
- [ ] File nguồn sơ đồ (`.drawio` / link Lucidchart) đã commit
- [ ] `design.md` ghi rõ công cụ và ngày vẽ
- [ ] Không có bất kỳ sơ đồ AI sinh nào còn trong bộ nộp
- [ ] Commit: `feat(generator): thiet ke + so do tu ve (§7)`
