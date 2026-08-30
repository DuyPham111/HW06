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

### 3.1 Kịch bản 8–12 phút

| Phút | Nội dung | Nhớ show gì trên màn hình |
|---|---|---|
| 0:00–0:45 | Giới thiệu: họ tên, MSSV, bài HW06, 3 API đã chọn | mở `README.md` |
| 0:45–2:00 | Vấn đề: §2 cấm prompt gộp → thiết kế 5 bước | mở `generator/design.md` + **sơ đồ tự vẽ** |
| 2:00–6:00 | **Demo skill chạy thật trên API-02** — gọi `/api-test-design`, đi từng bước 1→5, dừng lại chỉ ra chỗ AI trả sai | terminal/IDE, thấy rõ từng lượt hỏi riêng biệt |
| 6:00–8:00 | Kết quả: mở `generated.md` vừa sinh, chỉ bảng phân bố 4 nhóm | file `.md` |
| 8:00–10:00 | Chạy `/api-test-audit` — chỉ 1 case bị dán INVALID và **vì sao** | file `audit.md` |
| 10:00–11:30 | Chạy Newman, mở báo cáo HTML, chỉ 1 assertion đỏ và bug tương ứng | terminal + HTML report + Postman Console |
| 11:30–12:00 | Kết: skill dùng lại được cho API khác | |

**Ba điều bắt buộc lọt vào khung hình** (để video có giá trị làm bằng chứng):

1. **Postman Console** in `[HW06] X-Student-Id = 23127183`.
2. Terminal Newman với hostname `http://localhost:3000`.
3. **Sơ đồ tự vẽ** — nói rõ bạn vẽ bằng công cụ gì, ngày nào.

### 3.2 Quay và đăng

- Quay bằng OBS hoặc Xbox Game Bar (`Win+G`). 1080p, thu cả **giọng nói tiếng Việt**.
- Đừng quay lại nhiều lần cho hoàn hảo — đoạn AI trả sai và bạn sửa **là phần đáng giá nhất**.
- YouTube → Upload → **Unlisted** (không phải Private — TA sẽ không xem được).
- Dán link vào `README.md` mục *Liên kết* và vào `.claude/skills/demo-video-link.md`.

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
