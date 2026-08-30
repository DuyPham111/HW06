# Bug Report — HW06 API Testing trên EShop

- **Sinh viên:** Phạm Vũ Ngọc Duy — 23127183
- **GitHub Issues:** https://github.com/DuyPham111/HW06/issues
- **Script tái hiện:** `bash bug-report/verify-bugs.sh` → output lưu ở `verify-bugs-output.txt`

> **Luật:** chưa chạy request thật thì chưa phải bug. Mỗi mục dưới đây phải có: lệnh tái hiện ·
> output thật · trích đặc tả bị vi phạm · ảnh. Giả thuyết chưa kiểm chứng nằm ở §4, không nằm trong
> danh sách bug. Khuôn đầy đủ: [`docs/10-BUG-REPORT-GITHUB-ISSUES.md`](../docs/10-BUG-REPORT-GITHUB-ISSUES.md) §4.

---

## 1. Tổng hợp

| Mức | Số bug |
|---|--:|
| Critical | |
| High | |
| Medium | |
| Low | |
| **Tổng** | |

## 2. Bảng quy đổi assertion đỏ → bug

> Tổng cột "số assertion đỏ" phải **bằng** cột `Fail` trong
> [`test-cases/test-summary/summary.md`](../test-cases/test-summary/summary.md).
> Assertion đỏ không map được về bug nào = **lỗi test của tôi**, đã xử lý và ghi ở
> `report/main-report.md` §11.

| Bug | Mức | API | Test case liên quan | Số assertion đỏ | Issue |
|---|---|---|---|--:|---|
| BUG-01 | | | | | |
| **Tổng** | | | | | |

---

## 3. Chi tiết từng bug

### BUG-01 — _(tiêu đề ngắn, gọi tên đặc tả bị vi phạm)_

| | |
|---|---|
| **API** | |
| **Endpoint** | |
| **Mức độ** | |
| **Đặc tả bị vi phạm** | _(trích nguyên văn FR-xx / SEC-0x / spec §x.y)_ |
| **Test case bắt được** | |
| **Vị trí trong mã nguồn** | `backend/server.js:___` |
| **AI có bắt được không** | _(có/không — nếu có thì bắt ở mức nào: chỉ status hay cả hệ quả)_ |

**Các bước tái hiện**

```bash
bash bug-report/verify-bugs.sh 01
```

**Kết quả thực tế**

```
(dán output thật, không tóm tắt)
```

**Kết quả mong đợi** — _(theo đặc tả)_

**Ảnh** — ![](screenshots/bug-01.png)

**Ảnh hưởng** — _(nói bằng ngôn ngữ nghiệp vụ: ai mất gì, chứ không phải "sai status code")_

---

<!-- Sao chép khối trên cho từng bug. -->

## 4. Giả thuyết đã bị loại sau khi kiểm chứng

> Mục này chứng minh bạn kiểm chứng chứ không nhận vơ — nó ăn điểm.

| # | Giả thuyết | Đã kiểm bằng gì | Vì sao bị loại |
|---|---|---|---|
| | | | |

## 5. Rủi ro / câu hỏi nghiệp vụ (chưa đủ căn cứ gọi là bug)

| # | Quan sát | Vì sao chưa gọi là bug |
|---|---|---|
| | | |
