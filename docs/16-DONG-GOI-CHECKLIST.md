# 16 — §14 Đóng gói và checklist trước khi nộp

> **§17: thiếu bất kỳ tài liệu bắt buộc nào = 0 điểm.** Chạy hết checklist này trước khi zip.

---

## 1. Tên file nộp

§14: `<StudentID>_HW06_AI_API_<SelfAssessedGrade>.zip`

→ **`23127183_HW06_AI_API_100.zip`**

- `SelfAssessedGrade` là **đúng 3 chữ số**, `000`–`100`. Điểm tự chấm 100 → `100`. Điểm 95 → `095`.
- Điểm tự chấm phải **khớp** bảng Self-Assessment trong `README.md`.

---

## 2. Danh sách nội dung `.zip` — §14 liệt kê 11 mục

Đối chiếu từng dòng. Cột **Có?** tự đánh dấu.

| # | §14 đòi | File trong repo | Có? |
|---|---|---|---|
| 1 | Main report (**Markdown + PDF**), gồm báo cáo API testing và AI audit | `report/main-report.md` + `.pdf` | ☐ |
| 2 | Link GitHub repo public | ghi trong `README.md` — https://github.com/DuyPham111/HW06 | ☐ |
| 3 | Postman collection (`.json`) | `postman/collections/*.json` (4 file) | ☐ |
| 4 | Newman report (**HTML**) | `reports/newman/*.html` | ☐ |
| 5 | **Danh sách Postman feature đã dùng** | `postman/README.md` | ☐ |
| 6 | **CI/CD report**: cấu hình + **2 lượt mẫu** kèm ảnh và link | `ci/ci-report.md` + `.pdf` | ☐ |
| 7 | **Excel** test case + test summary | `excel/23127183_HW06_TestCases.xlsx` | ☐ |
| 8 | **Sơ đồ generator (TỰ VẼ)** + pseudocode | `generator/diagram/*.png` + `generator/pseudocode.py` + `design.md` | ☐ |
| 9 | *(tuỳ chọn)* OpenAPI `.yaml`/`.json`, **có audit nếu AI sinh** | `docs/openapi.yaml` + `openapi-audit.md` | ☐ |
| 10 | **Bug report** + ảnh bug trên **GitHub Issues** | `bug-report/` + link Issues | ☐ |
| 11 | **AI Critique + AI Audit Report** (Markdown + PDF) | `ai-audit/*.md` + `*.pdf` | ☐ |
| 12 | **Git commit log** (text) | `git-log/commit-log.txt` | ☐ |
| 13 | **README** có bảng tự chấm + test summary | `README.md` | ☐ |

---

## 3. Checklist §11 — Anti-AI-Cheat (TA kiểm trực tiếp)

| Yêu cầu §11 | Bằng chứng | Có? |
|---|---|---|
| Header `X-Student-Id: 23127183`, **ảnh Postman Console** từ pre-request script | `bug-report/screenshots/postman-console-gui.png` | ☐ |
| Output Newman có **hostname `localhost`/`127.0.0.1`** | `bug-report/screenshots/newman-cli-localhost.png` + trong HTML report | ☐ |
| Sơ đồ generator **tự vẽ**, không do AI sinh | `generator/diagram/generator-flow-selfdrawn.png` + file nguồn `.drawio` | ☐ |

**Và:** rà lại bộ nộp xem còn sót sơ đồ/ảnh nào do AI sinh không. Có thì xóa.

---

## 4. Checklist định lượng §6

| Yêu cầu | Chỉ tiêu | Số thật của bạn | Đạt? |
|---|---|---|---|
| Test case mỗi API (§6.1) | **≥35** | API-01: __ · API-02: __ · API-03: __ | ☐ |
| Case tự thêm mỗi API (§6.3) | **≥5** | API-01: __ · API-02: __ · API-03: __ | ☐ |
| Phủ 4 nhóm kỹ thuật mỗi API | Domain · State · Security · Schema đều > 0 | | ☐ |
| Mọi request có `X-Student-Id` | 100% | | ☐ |
| Lượt CI **xanh hết** | 1 | link: | ☐ |
| Lượt CI **có fail** | 1 | link: | ☐ |
| Bug có ảnh trên Issues | 100% số bug | __/__ | ☐ |
| AI Critique | **200–300 từ** | __ từ | ☐ |
| Commit | ≥25, 1 bước = 1 commit | __ | ☐ |

---

## 5. Kiểm tính nhất quán — 6 phép soát cuối

Đây là chỗ mất điểm âm thầm: các con số trong các file **không khớp nhau**.

1. **Test summary trong `README.md` == sheet `Summary` trong Excel == `test-cases/test-summary/summary.md`.**
   Ba nơi cùng đọc từ raw JSON của Newman. Lệch một số là mất tin cậy toàn bài.
2. **Tổng assertion đỏ trong `summary.md` == tổng cột "số assertion đỏ" trong bảng quy đổi bug.**
   Đỏ không map được về bug nào = lỗi test chưa xử lý.
3. **Số case trong `audit.md` == số dòng sheet tương ứng trong Excel.**
4. **Danh sách case đỏ ghi ở cuối `audit.md` == danh sách trong `summary.md`.** Liệt kê từng ID,
   không gộp khoảng — gộp khoảng là chỗ hay sai nhất.
5. **Mọi link nội bộ trong README mở được**, mọi link GitHub Issues / Actions **mở được ở chế độ ẩn danh**
   (repo phải **public** — §14 nói *"public GitHub repository link"*).
6. **Điểm tự chấm trong README == số trong tên file `.zip`.**

---

## 6. Đóng gói

```bash
cd "D:/Nam3/HK3/Kiểm thử phần mềm/HW06"

# 1. Bảo đảm mọi thứ đã push
cd HW06-API-Testing && git status && git push && cd ..

# 2. Zip - loại node_modules, .git, SUT
powershell -Command "Compress-Archive -Path 'HW06-API-Testing\*' -DestinationPath '23127183_HW06_AI_API_100.zip' -Force"
```

> `Compress-Archive` **không** loại trừ thư mục được. Cách chắc chắn: copy repo sang thư mục tạm,
> xóa `node_modules/`, `.git/`, `eshop-sut/`, `.run-logs/` rồi mới zip.

```powershell
$tmp = "$env:TEMP\hw06-pack"
Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item "HW06-API-Testing" $tmp -Recurse
Remove-Item "$tmp\node_modules","$tmp\.git","$tmp\eshop-sut","$tmp\.run-logs" -Recurse -Force -ErrorAction SilentlyContinue
Compress-Archive -Path "$tmp\*" -DestinationPath "23127183_HW06_AI_API_100.zip" -Force
```

**Sau khi zip:** giải nén ra thư mục khác, mở `README.md`, bấm thử 5 link, mở 1 file PDF, mở file
Excel. Nếu có gì hỏng thì sửa rồi zip lại.

---

## 7. Bảng Self-Assessment cho `README.md`

Điền theo §15 của đề. Đừng ghi 100 mặc định — đọc lại checklist §2–§4 rồi trừ đúng chỗ còn thiếu,
và **ghi rõ trừ vì sao**. Bài tham khảo đã 100đ có hẳn một bảng "trừ vì sao / đóng lại bằng cách nào" —
sự trung thực đó được đánh giá cao hơn là ghi 100 rồi để người chấm tự tìm chỗ thiếu.

✅ **Đã điền xong** — bảng thật nằm ở [`README.md`](../README.md) §3, tự chấm **100/100**, mỗi dòng
có cột "Căn cứ" ghi rõ số case / assertion / bug làm chứng. Không cần điền lại ở đây.

---

## 8. Nộp

- Nộp `.zip` lên **Moodle** theo link bài nộp. **Không được nộp trễ** (§17).
- Kiểm repo GitHub đang **public**.
- §13: 30% sinh viên được gọi vấn đáp 5–7 phút trong tuần sau deadline. Ôn sẵn 4 câu:
  1. Vì sao chọn đúng 3 API này?
  2. Chỉ một case bạn dán nhãn INVALID và giải thích bạn sửa gì, vì sao.
  3. Bug nặng nhất là gì, tái hiện thế nào? (mở `verify-bugs.sh` chạy tại chỗ)
  4. Sơ đồ generator bạn vẽ bằng gì, mỗi nhánh quyết định nghĩa là gì?
