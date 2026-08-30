# 15 — §12 Git commit log: 1 bước = 1 commit

> Output: `git-log/commit-log.txt`.
> **Commit:** `docs: xuat git commit log (§12)`

---

## 1. §12 đòi gì

*"Create a new Git commit for each step of the procedure (for example: generation, audit, extension,
and execution for each API). Provide the Git commit log in a text-based file format."*

Đề gọi tên **4 bước × 3 API = 12 commit tối thiểu**, cộng các commit cho collection, CI, bug report,
generator, báo cáo. Mục tiêu thực tế: **25–35 commit**.

> **Một commit "xong hết bài" là mất điểm §12.** Người chấm mở `commit-log.txt` và nhìn xem lịch sử
> có phản ánh quy trình không. Commit đúng nhịp còn giúp chính bạn: khi Newman đỏ hàng loạt, `git diff`
> giữa 2 commit chỉ ra ngay bạn vừa đổi gì.

---

## 2. Quy ước thông điệp commit

```
<type>(<scope>): <việc đã làm, tiếng Việt không dấu>
```

| `type` | Dùng khi |
|---|---|
| `chore` | môi trường, cấu hình, dọn dẹp |
| `docs` | tài liệu, báo cáo, bug report, audit |
| `test` | test case, collection, lượt chạy |
| `feat` | generator, skill, tool mới |
| `ci` | workflow, baseline |
| `fix` | sửa lỗi trong chính bộ test / tool của mình |

`scope` là `api-01` / `api-02` / `api-03` / để trống.

**Viết thông điệp không dấu** — `git log` trên Windows hay vỡ font tiếng Việt khi xuất ra `.txt`.

---

## 3. Danh sách commit mẫu — bám đúng 12 phiên ở [00](00-ROADMAP.md)

```
chore: khoi tao repo HW06 - cau truc thu muc va tooling
chore: setup moi truong HW06 + preflight
docs: chot 3 API va ly do chon (§5)

test(api-01): sinh test case bang AI theo 5 buoc (§6.1)
test(api-01): audit VALID/INVALID/INCOMPLETE (§6.2)
test(api-01): 5+ case bo sung va ly do AI bo sot (§6.3)

test(api-02): sinh test case bang AI theo 5 buoc (§6.1)
test(api-02): audit VALID/INVALID/INCOMPLETE (§6.2)
test(api-02): 5+ case bo sung va ly do AI bo sot (§6.3)

test(api-03): sinh test case bang AI theo 5 buoc (§6.1)
test(api-03): audit VALID/INVALID/INCOMPLETE (§6.2)
test(api-03): 5+ case bo sung va ly do AI bo sot (§6.3)

test: collection Postman API-01 + prerequest X-Student-Id
test: collection Postman API-02 (chuoi state FR-10)
test: collection Postman API-03
test: file CSV data-driven cho Collection Runner

test: chay Newman 3 collection va xuat bao cao (§6.4)
docs: dien cot Ket qua vao audit va extended tu summary.md
docs: anh bang chung X-Student-Id tu Postman Console (§11)

docs: bug report 20 bug + script verify-bugs (§6.5)
docs: link GitHub Issues vao bug report

test: regression suite - tap con case dang xanh
ci: pipeline Newman GitHub Actions (§6)
ci: cap nhat baseline expected-failures tu luot CI dau tien
ci: bao cao CI 2 luot mau xanh va do (§6)

feat(generator): thiet ke 6 giai doan + pseudocode (§7)
feat(generator): so do tu ve bang draw.io (§7, §11)
feat: 4 Agent Skill cho pipeline HW06 (§7)

docs: danh sach Postman feature da dung (§6)
docs: bao cao chinh main-report (§14)
docs: AI audit report + AI critique (§9, §10)
docs: xuat Excel test case va test summary (§14)
docs: xuat PDF cac tai lieu bat buoc (§14)
docs: xuat git commit log (§12)
```

---

## 4. Xuất `git-log/commit-log.txt`

Chạy **cuối cùng**, sau khi mọi thứ đã commit:

```bash
cd "D:/Nam3/HK3/Kiểm thử phần mềm/HW06/HW06-API-Testing"
{
  echo "HW06 - API Testing - Git commit log"
  echo "SV: Pham Vu Ngoc Duy - 23127183"
  echo "Repo: https://github.com/DuyPham111/HW06"
  echo "Xuat luc: $(date -Iseconds)"
  echo "Tong so commit: $(git rev-list --count HEAD)"
  echo
  git log --date=iso --pretty=format:'%h  %ad  %an  %s'
} > git-log/commit-log.txt
```

Rồi commit chính nó:

```bash
git add git-log/commit-log.txt
git commit -m "docs: xuat git commit log (§12)"
git push
```

> Commit cuối này sẽ **không** có trong file (file xuất trước khi commit). Không sao — nhưng nếu
> muốn đủ, chạy lại lệnh xuất một lần nữa rồi `git commit --amend --no-edit`.

**Kiểm sau khi xuất:** mở `commit-log.txt`, đếm dòng, kiểm không có ký tự lỗi font.

---

## 5. Nếu bạn đã lỡ gộp hết vào 1–2 commit

Đừng viết lại lịch sử bằng `rebase` (dễ hỏng, và ngày tháng vẫn sai). Cách trung thực:

1. Từ giờ trở đi commit đúng nhịp cho phần còn lại.
2. Trong `report/main-report.md` ghi một dòng: *"Giai đoạn đầu (dựng khung, phiên 1–2) được gộp
   trong 2 commit; từ phiên 3 trở đi mỗi bước một commit theo §12."*

Trung thực về chỗ chưa đạt tốt hơn là bịa lịch sử — §11 và §13 (vấn đáp) đều nhắm vào chỗ đó.

---

## 6. Checklist

- [ ] ≥25 commit, mỗi bước §6.1–§6.5 của **mỗi API** có commit riêng
- [ ] Thông điệp commit không dấu, có `type(scope):`
- [ ] `git-log/commit-log.txt` đã xuất, có header thông tin SV + tổng số commit
- [ ] Mở file kiểm không lỗi font
- [ ] Đã `git push` lên https://github.com/DuyPham111/HW06
