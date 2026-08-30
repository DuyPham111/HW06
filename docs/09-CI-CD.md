# 09 — §6 CI/CD: pipeline Newman + **2 lượt mẫu** (1 xanh hết, 1 có fail)

> Output: `.github/workflows/api-tests.yml` (đã có sẵn) + `ci/ci-report.md` + 2 ảnh + 2 link.
> **Commit:** `ci: pipeline Newman + 2 luot mau (§6)`

---

## 1. Đề đòi gì — đọc kỹ, chỗ này hay bị làm sai

§6: *"Integrate into CI/CD. Add your API test cases to a CI/CD pipeline for the SUT (for example,
run Newman in GitHub Actions in your repository), and write a short CI/CD report describing the
pipeline configuration and the two runs below, with screenshots and links. **Provide two sample
commits: one whose pipeline run shows all API test cases passing, and another whose pipeline run
shows one test case failing.**"*

Bốn thứ phải nộp:

1. File workflow (đã có).
2. `ci/ci-report.md` mô tả **cấu hình** pipeline.
3. **Lượt XANH** — mọi test case pass, kèm **ảnh + link**.
4. **Lượt ĐỎ** — có test case fail, kèm **ảnh + link**.

---

## 2. Vấn đề thiết kế: bộ test của bạn **luôn có** assertion đỏ

Expected bám đặc tả, SUT có bug cố ý → 3 collection chính không bao giờ xanh hết. Nếu lấy "0 đỏ" làm
cổng thì pipeline đỏ vĩnh viễn, và bạn mất luôn tín hiệu **hồi quy** (thứ mà CI sinh ra để làm).

**Giải pháp đã dựng sẵn trong `.github/workflows/api-tests.yml`: hai bộ test, hai cổng.**

| Bộ | Là gì | Cổng | Vai trò |
|---|---|---|---|
| **regression suite** (`23127183_regression`) | tập con các case **đang xanh**, giữ nguyên expected | **0 đỏ** (`--strict`) | chốt phần hành vi đã đúng. Đây chính là **lượt XANH** mà §6 đòi |
| **3 collection bug-hunting** | bộ chính, cố ý bắt bug | so với `ci/expected-failures.json` | đỏ **tăng** = hồi quy mới · đỏ **giảm** = SUT đã sửa **hoặc test yếu đi** — cả hai đều cần người xem |

Regression chạy **trước** (trên SUT vừa seed sạch), rồi mới tới bộ bug-hunting — vì bộ sau cố tình
ghi dữ liệu sai vào CSDL.

**Đây là lập luận đáng viết vào `ci/ci-report.md`.** Nó cho thấy bạn hiểu CI dùng để làm gì, chứ
không chỉ chạy được lệnh.

---

## 3. Workflow đã dựng sẵn làm gì

Đọc `.github/workflows/api-tests.yml` — phần comment đầu file giải thích 3 quyết định thiết kế.
Tóm tắt:

| Bước | Việc | Vì sao |
|---|---|---|
| Checkout bài làm | | |
| **Checkout SUT** `ttbhanh/eshop-sut` vào `eshop-sut/` | dựng SUT **trong job** | runner của GitHub không có SUT. Pipeline chỉ chạy được trên máy bạn thì không phải pipeline |
| `npm i -g newman newman-reporter-htmlextra` | | |
| Khởi động SUT + chờ tới 40s | poll `GET /api/products` | tránh race: Newman chạy trước khi SUT lên |
| Ghi điều kiện lượt chạy vào Step Summary | runner, Node, Newman version, chế độ cổng | khi số liệu CI lệch với lượt local thì biết vì sao |
| `node tools/preflight.mjs` | | chặn sớm |
| Chạy regression → `ci-gate --strict` | **cổng 0 đỏ** | lượt XANH |
| Chạy 3 collection | | |
| `ci-gate` so baseline (hoặc `--strict` nếu chọn) | | lượt ĐỎ |
| Upload artifact `if: always()` | HTML + JSON + `sut.log` | lúc đỏ mới là lúc cần bằng chứng nhất |

`concurrency: group: api-tests` — hai lượt song song sẽ tranh cổng 3000 và cùng file
`database.sqlite`, kết quả lẫn nhau.

---

## 4. Cập nhật baseline trước khi chạy CI

`ci/expected-failures.json` đang để `0` cho cả 3 collection. Sau khi có `summary.md`
([07](07-CHAY-NEWMAN-BANG-CHUNG.md)), điền số **Fail** thật vào:

```json
{
  "api-01-login": 14,
  "api-02-apply-coupon": 21,
  "api-03-product-update": 18
}
```

> Số local và số CI có thể **lệch nhẹ** (DB trên runner luôn sạch, DB local đã seed nhiều lần).
> Chạy CI một lượt trước, lấy số của **runner** làm baseline, và ghi vào `ci-report.md` rằng bạn
> lấy số từ đâu.

Baseline là thứ **bạn ký nhận**. Chỉ cập nhật khi giải thích được vì sao số đổi.

---

## 5. Tạo **lượt XANH** — từng bước

Điều kiện: `postman/collections/23127183_regression.postman_collection.json` đã có và 0 đỏ ở local.

1. Commit + push regression suite:
   ```bash
   git add postman/collections/23127183_regression.postman_collection.json ci/expected-failures.json
   git commit -m "ci: them regression suite lam cong 0 do (luot XANH §6)"
   git push
   ```
   Push chạm `postman/**` nên workflow **tự chạy**.
2. Mở GitHub → tab **Actions** → `api-tests` → lượt vừa chạy.
3. Đợi xanh. Nếu đỏ: mở step **Chạy regression suite** đọc assertion nào đỏ, sửa collection, push lại.
4. **Chụp ảnh** trang lượt chạy — thấy rõ dấu ✓ xanh, tên workflow, số run, và bảng
   **Summary** có dòng "Điều kiện lượt chạy CI". Lưu `bug-report/screenshots/ci-xanh.png`.
5. **Copy link** lượt chạy (dạng `https://github.com/DuyPham111/HW06/actions/runs/<id>`).
6. Ghi lại **hash commit** đã kích hoạt lượt này — §6 đòi *"two sample commits"*:
   ```bash
   git log -1 --format="%H %s"
   ```

---

## 6. Tạo **lượt ĐỎ** — từng bước

**Không** cố tình viết một test sai vào repo (làm bẩn bộ test và khó giải thích). Dùng `gate_mode=strict`:
cùng bộ test, chỉ đổi **cổng** thành "đỏ nếu có bất kỳ assertion đỏ" — và bộ bug-hunting thì luôn có.

1. GitHub → **Actions** → `api-tests` → nút **Run workflow** (góc phải).
2. `gate_mode` → chọn **`strict`** → **Run workflow**.
3. Đợi lượt chạy **đỏ** ở step **Cổng đỏ/xanh**.
4. Mở step đó, chụp ảnh thấy rõ dòng `::error::` và tên collection + số assertion đỏ.
   Lưu `bug-report/screenshots/ci-do.png`.
5. Copy link lượt chạy.

**Nếu bạn muốn lượt đỏ gắn với một commit thật** (đề dùng chữ *"two sample commits"*), cách sạch nhất:

```bash
# commit chỉ hạ baseline xuống 0 -> cổng baseline lập tức bắt "hồi quy"
git checkout -b ci/demo-red
# sửa ci/expected-failures.json: đặt api-01-login về 0
git commit -am "ci: ha baseline ve 0 de demo luot CI DO (§6)"
git push -u origin ci/demo-red
```

Nhưng workflow chỉ tự chạy trên `main`. Hai lựa chọn: merge nhánh đó vào `main` rồi revert ngay sau
khi có ảnh, **hoặc** dùng cách `gate_mode=strict` ở trên và ghi rõ trong `ci-report.md` rằng lượt đỏ
được tạo bằng cách đổi cổng chứ không phải bằng cách làm hỏng test. **Cách thứ hai trung thực hơn** —
cứ ghi đúng như vậy.

---

## 7. Viết `ci/ci-report.md`

Khung có sẵn. Bốn mục:

1. **Cấu hình pipeline** — bảng ở §3, kèm 3 quyết định thiết kế (SUT dựng trong job · hai bộ hai cổng ·
   `gate_mode` để tạo lượt đỏ). Trích vài dòng YAML tiêu biểu.
2. **Lượt XANH** — link, hash commit, ảnh, số request/assertion, giải thích *"regression suite là tập
   con các case đang xanh, giữ nguyên expected"*.
3. **Lượt ĐỎ** — link, cách tạo, ảnh, danh sách assertion đỏ và mỗi cái map về bug nào.
4. **Bảng đối chiếu số liệu local vs CI** — nếu lệch thì giải thích (DB sạch, phiên bản Node, thứ tự chạy).

---

## 8. Checklist

- [ ] `ci/expected-failures.json` đã điền số thật (lấy từ lượt CI đầu tiên)
- [ ] Regression suite đã push, workflow chạy tự động
- [ ] **Lượt XANH**: có link + ảnh + hash commit
- [ ] **Lượt ĐỎ**: có link + ảnh + giải thích cách tạo
- [ ] `ci/ci-report.md` đủ 4 mục
- [ ] Hai ảnh nằm trong `bug-report/screenshots/` và được nhúng vào `ci-report.md`
- [ ] Commit: `ci: pipeline Newman + 2 luot mau (§6)`
