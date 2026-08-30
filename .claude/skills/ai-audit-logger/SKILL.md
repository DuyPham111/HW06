---
name: ai-audit-logger
description: Record every AI interaction into HW06's mandatory AI Audit Report. Use after each AI turn while doing HW06 (choosing APIs, generating test cases, auditing them, writing the Postman collection, building the CI pipeline, writing the report). Appends a structured entry (tool, date/time, verbatim prompt, output, what the AI got wrong, why, human review) to ai-audit/ai-audit-report.md.
---

# AI Audit Logger Skill (HW06 §9)

HW06 có **AI Policy: Open** — bắt buộc có lời khai + AI Audit Report đầy đủ (§9).
§17: thiếu bất kỳ tài liệu bắt buộc nào là **0 điểm**. Skill này lo phần ghi log để không sót lượt nào.

## Khi nào dùng

Sau **mỗi** lượt hỏi AI liên quan HW06: chọn API · sinh test case (từng bước) · audit · extend ·
viết collection · dựng CI · thiết kế generator · viết báo cáo · xuất Excel.

Dự kiến **20–25 lượt**: 6 lượt sinh case × 3 API = 18, cộng phần còn lại.

## Ghi gì cho mỗi lượt

**4 trường §9 đòi:**

1. **Tên AI tool** + model — ví dụ `Claude Code (Opus 5)`
2. **Ngày và giờ** thật
3. **Prompt nguyên văn**, trong code block — không tóm tắt, không sửa cho đẹp
4. **Output của AI** — nguyên văn, hoặc trích đủ dài + trỏ tới file chứa bản đầy đủ

**3 trường thêm** (không bắt buộc nhưng là chỗ ăn điểm §6.2 và §10):

5. **AI sai gì** — cụ thể: sai số liệu nào, hiểu sai đặc tả nào
6. **Vì sao sai** — `prompt quality` / `model limitations` / `characteristics of the API`
7. **Human review** — bạn đã sửa gì, **có ngày tháng**

## Khuôn một mục

```markdown
### LOG-0XX — <API nào, bước nào>

| | |
|---|---|
| **AI tool** | Claude Code (Opus 5) |
| **Ngày giờ** | dd/mm/2026 HH:MM |
| **Giai đoạn** | §6.1 bước 4a — nhóm State |
| **File bị ảnh hưởng** | `test-cases/api-01-login/generated.md` |

**Prompt (nguyên văn):**
```
...
```

**Output của AI:** ...

**AI sai gì:** ...

**Vì sao sai:** `model limitations` — ...

**Human review (SV 23127183, dd/mm/2026):** ...
```

## Ba luật

1. **Ghi ngay lúc làm.** Dựng lại sau 2 tuần thì prompt không còn nguyên văn, ngày giờ thành bịa,
   và mục "AI sai gì" trống rỗng vì bạn đã quên. Mở sẵn `ai-audit-report.md` ở tab bên cạnh —
   mất 30 giây/lượt.
2. **Không sửa prompt cho đẹp.** §9 đòi *"your prompt"*, không phải *"đại ý prompt"*. Prompt vụng
   mà thật thì tốt hơn prompt đẹp mà bịa — và chính prompt vụng là chất liệu cho nhóm lý do
   `prompt quality` ở §6.3.
3. **Mục "AI sai gì" là nguyên liệu của §10.** Viết log tử tế thì AI Critique 200–300 từ tự có nội
   dung, không phải nghĩ lại từ đầu.

## Cập nhật bảng tổng hợp

Mỗi lần thêm mục, cập nhật luôn bảng đầu file `ai-audit-report.md`:

| # | Ngày giờ | Giai đoạn | AI tool | AI có sai gì không | Đã review? |
|---|---|---|---|---|---|

Bảng này giúp người chấm thấy ngay bạn đi **nhiều lượt riêng biệt** — bằng chứng cho §2.
