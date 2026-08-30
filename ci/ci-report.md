# CI/CD Report — HW06 (§6)

- **Sinh viên:** Phạm Vũ Ngọc Duy — 23127183
- **Workflow:** [`.github/workflows/api-tests.yml`](../.github/workflows/api-tests.yml)
- **Actions:** https://github.com/DuyPham111/HW06/actions

> §6 đòi: mô tả **cấu hình pipeline** + **hai lượt mẫu** (một lượt tất cả pass, một lượt có fail),
> kèm **ảnh và link**. Hướng dẫn tạo 2 lượt: [`docs/09-CI-CD.md`](../docs/09-CI-CD.md) §5–§6.

---

## 1. Cấu hình pipeline

| Bước | Việc | Vì sao |
|---|---|---|
| Checkout bài làm | | |
| **Checkout SUT** `ttbhanh/eshop-sut` vào job | dựng SUT ngay trong runner | runner của GitHub không có SUT; pipeline chỉ chạy được trên máy sinh viên thì không phải pipeline |
| Cài Newman + `newman-reporter-htmlextra` | | |
| Khởi động SUT, poll `GET /api/products` tối đa 40s | | tránh race: Newman chạy trước khi SUT lên |
| Ghi điều kiện lượt chạy vào Step Summary | runner, Node, Newman version, chế độ cổng | khi số liệu CI lệch số local thì biết vì sao |
| `node tools/preflight.mjs` | | chặn sớm |
| Chạy **regression suite** → cổng **0 đỏ** | | đây là lượt "all API test cases passing" mà §6 đòi |
| Chạy **3 collection bug-hunting** → cổng **baseline** | | bộ này cố ý bắt bug nên luôn có đỏ |
| Upload artifact `if: always()` | HTML + JSON + `sut.log` | lúc đỏ mới là lúc cần bằng chứng nhất |

### Ba quyết định thiết kế

**1. SUT dựng trong job**, không dùng service ngoài — xem bảng trên.

**2. Hai bộ test, hai cổng.**

| Bộ | Cổng | Vai trò |
|---|---|---|
| `23127183_regression` — tập con case **đang xanh**, giữ nguyên expected | **0 đỏ** (`--strict`) | chốt phần hành vi đã đúng |
| 3 collection bug-hunting | so với `ci/expected-failures.json` | đỏ **tăng** = hồi quy mới · đỏ **giảm** = SUT đã sửa **hoặc test yếu đi** |

Lấy "0 đỏ" làm cổng cho bộ chính thì pipeline đỏ vĩnh viễn và mất hết tín hiệu hồi quy.
Regression chạy **trước** (SUT vừa seed sạch) rồi mới tới bộ bug-hunting, vì bộ sau cố tình ghi dữ
liệu sai vào CSDL.

**3. Input `gate_mode`** cho phép chạy tay ở chế độ `strict` — đây là cách tạo **lượt ĐỎ mẫu** mà §6
đòi, không cần cố tình viết một test sai vào repo.

### Baseline

`ci/expected-failures.json` — số assertion đỏ đã **ký nhận** cho từng collection. Lấy từ lượt CI đầu
tiên, không lấy số local (DB trên runner luôn sạch, DB local đã seed nhiều lần).

| Collection | Baseline | Nguồn |
|---|--:|---|
| `api-01-login` | | run #__ |
| `api-02-apply-coupon` | | run #__ |
| `api-03-product-update` | | run #__ |

---

## 2. Lượt mẫu 1 — **XANH** (tất cả test case pass)

| | |
|---|---|
| **Link** | https://github.com/DuyPham111/HW06/actions/runs/______ |
| **Commit** | `______` — _(thông điệp commit)_ |
| **Bộ chạy** | `23127183_regression` |
| **Cổng** | `tools/ci-gate.mjs --strict` (0 đỏ) |
| **Kết quả** | __ request · __ assertion · **0 đỏ** |

![CI xanh](../bug-report/screenshots/ci-xanh.png)

Regression suite là **tập con các case đang xanh** của bộ chính, **giữ nguyên expected** — không nới
assertion cho nó xanh. Nếu nới thì nó không còn chốt được hành vi nào cả.

---

## 3. Lượt mẫu 2 — **ĐỎ** (có test case fail)

| | |
|---|---|
| **Link** | https://github.com/DuyPham111/HW06/actions/runs/______ |
| **Cách tạo** | Actions → `api-tests` → Run workflow → `gate_mode` = `strict` |
| **Bộ chạy** | 3 collection bug-hunting |
| **Kết quả** | __ request · __ assertion · **__ đỏ** → cổng chặn, build đỏ |

![CI đỏ](../bug-report/screenshots/ci-do.png)

**Các assertion đỏ và bug tương ứng:**

| Assertion đỏ | Test case | Bug |
|---|---|---|
| | | |

> Lượt đỏ được tạo bằng cách **đổi cổng**, không phải bằng cách làm hỏng một test. Ghi rõ như vậy vì
> đó là sự thật: cùng một bộ test, cùng một SUT, chỉ đổi ngưỡng chấp nhận.

---

## 4. So sánh số liệu local vs CI

| Chỉ số | Local | CI | Chênh | Giải thích |
|---|--:|--:|--:|---|
| Request | | | | |
| Assertion | | | | |
| Đỏ | | | | |

_(Chênh lệch thường do: DB trên runner luôn sạch · phiên bản Node khác · thứ tự chạy collection.)_
