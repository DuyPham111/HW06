# 07 — §6.4 Chạy Newman và thu bằng chứng (§11)

> Output: `reports/newman/*.html` + `*.json`, `test-cases/test-summary/summary.md`,
> ảnh `bug-report/screenshots/postman-console-gui.png`.
> **Commit:** `test: chay Newman va thu bang chung (§6.4, §11)`

---

## 1. Thủ tục chuẩn cho một lượt chạy chính thức

Làm **đúng thứ tự này**, nếu không số liệu sẽ không tái lập được:

```bash
# 1. Restart SUT -> DB bị DROP và seed lại -> trạng thái đầu vào xác định
#    (terminal 1)
cd "D:/Nam3/HK3/Kiểm thử phần mềm/HW06/eshop-sut/backend"
node server.js

# 2. Kiểm môi trường (terminal 2)
cd "D:/Nam3/HK3/Kiểm thử phần mềm/HW06/HW06-API-Testing"
npm run preflight        # phải OK hết

# 3. Chạy
npm run test:api1        # hoặc test:api2 / test:api3 / test:all

# 4. Tính lại số liệu từ raw JSON — ĐỪNG gõ tay số nào
npm run summary
```

`tools/run-newman.sh` tự gọi `preflight` trước, đặt tên file theo
`23127183_<slug>_<YYYYmmdd-HHMMSS>` (không ghi đè lượt cũ) và xuất **cả** HTML lẫn JSON.

> **Restart SUT giữa các collection.** API-03 tạo/xóa sản phẩm, API-02 tạo đơn hàng và ghi
> `coupon_usage`. Chạy liền 3 collection trên cùng một DB thì collection sau nhận trạng thái bẩn từ
> collection trước, và bạn sẽ mất buổi tối để truy nguyên "vì sao lần này khác lần trước".

---

## 2. Đọc kết quả: assertion đỏ là **kết quả mong đợi**

Newman thoát với exit code khác 0 khi có assertion đỏ. **Điều đó là bình thường ở bài này.**

Expected của bạn bám **đặc tả** (FR/SEC), SUT có bug cố ý → đỏ = **phát hiện được bug**.
Ba điều phải nhớ:

1. **Không sửa expected cho khớp SUT.** Sửa là mất hết giá trị của bộ test.
2. **Mỗi assertion đỏ phải map về đúng 1 bug** trong `bug-report/bug-report.md`. Đỏ mà không giải
   thích được là **lỗi test của bạn**, không phải bug của SUT — phải truy tới cùng.
3. **Số assertion đỏ ≠ số bug.** Một bug gây nhiều assertion đỏ ở nhiều case. Bảng quy đổi viết ở
   [10](10-BUG-REPORT-GITHUB-ISSUES.md).

### Ba loại đỏ và cách phân biệt

| Loại đỏ | Dấu hiệu | Xử lý |
|---|---|---|
| **Bug thật của SUT** | tái hiện được bằng `curl` độc lập | → bug report + GitHub Issue |
| **Lỗi test của bạn** | biến rỗng, sai URL, assertion nghiêm hơn expected, chuỗi state chạy sai thứ tự | sửa collection, chạy lại, **ghi lại vào bảng "AI/tôi đã sai gì"** trong main-report |
| **Lỗi môi trường** | tài khoản bị khóa từ lượt trước, SUT chết giữa chừng, DB bẩn | restart SUT, chạy lại. **Không** tính vào số liệu nộp |

> Loại thứ hai **đáng ghi lại**, đừng giấu. Bài tham khảo đã 100đ có hẳn một mục *"11 lỗi của AI đã
> bắt và sửa"*, trong đó 2 lỗi từng suýt bị báo nhầm thành bug của SUT. Mục đó là bằng chứng bạn
> thật sự đã review — nó **cộng điểm**, không trừ.

---

## 3. `npm run summary` — nguồn số liệu duy nhất

Script đọc `reports/newman/*.json` (raw của Newman) và sinh
`test-cases/test-summary/summary.md` gồm: request, assertion, pass, fail cho từng collection,
và bảng liệt kê **từng assertion đỏ** kèm tên request.

**README.md và `report/main-report.md` phải copy số từ file này.** Đừng gõ tay, đừng đọc từ HTML.
Nếu hai chỗ lệch nhau thì người chấm sẽ tin file nào?

Sau khi có `summary.md`:

1. Điền cột `Kết quả` trong `audit.md` và `extended.md` của từng API (`Pass` / `FAIL (n/m đỏ)`).
2. Điền danh sách case đỏ vào đoạn *"Không sửa expected để khớp SUT"* ở cuối mỗi `audit.md`
   ([04](04-AUDIT.md) §5) — **liệt kê đúng từng ID, không gộp khoảng**.
3. Cập nhật `ci/expected-failures.json` bằng số ở cột **Fail** ([09](09-CI-CD.md) §4).

---

## 4. Bằng chứng §11 — ba ảnh bắt buộc

§11 nói TA sẽ kiểm đúng ba thứ. Chụp ngay, đừng để đến hôm nộp.

### 4.1 Ảnh Postman Console (quan trọng nhất)

1. Mở Postman **desktop** (bản web không có Console).
2. **View → Show Postman Console** (`Ctrl+Alt+C`).
3. Chọn environment `HW06-local-23127183`.
4. Chạy collection bằng **Runner** (không phải Send từng cái) để có nhiều dòng.
5. Trong Console, chụp màn hình sao cho thấy **đồng thời**:
   - nhiều dòng `[HW06] X-Student-Id = 23127183 | POST /api/login | 2026-…`
   - ít nhất một request bung ra thấy `http://localhost:3000` và mã trả về `200`
6. Lưu `bug-report/screenshots/postman-console-gui.png`.

> Bung một request trong Console (click vào dòng request) → mục **Request Headers** sẽ thấy
> `X-Student-Id: 23127183`. Chụp thêm ảnh này lưu `x-student-id-request-header.png` cho chắc.

### 4.2 Ảnh header trong báo cáo Newman HTML

Mở `reports/newman/23127183_api-01-login_*.html` → click một request → tab **Request Headers**
→ thấy `X-Student-Id`. Chụp, lưu `bug-report/screenshots/newman-request-header.png`.

### 4.3 Hostname trong output Newman

§11: *"The Newman run output, whose hostname matches your deployment (localhost / 127.0.0.1 is
accepted)."* Chụp terminal lúc chạy `npm run test:all`, thấy rõ các dòng `POST http://localhost:3000/api/…`.
Lưu `bug-report/screenshots/newman-cli-localhost.png`.

---

## 5. Regression suite — cần cho CI

[09](09-CI-CD.md) đòi một lượt CI **xanh hoàn toàn**. Bộ test chính luôn có assertion đỏ (cố ý), nên
cần thêm một collection thứ tư: **regression suite** = tập con các case **đang xanh**.

Cách làm nhanh trong Postman:

1. Mở `summary.md`, lấy danh sách request **không có** assertion đỏ.
2. Tạo collection mới `23127183_regression`, gắn cùng pre-request script.
3. Copy các request đó sang (chuột phải request → **Duplicate** → kéo sang collection mới), **giữ
   nguyên assertion** — không nới lỏng.
4. Giữ nguyên folder `00-setup` (regression cũng cần token).
5. Export ra `postman/collections/23127183_regression.postman_collection.json`.

> **Giữ nguyên expected.** Nếu bạn nới assertion cho nó xanh thì regression suite thành vô nghĩa:
> nó không còn chốt được hành vi nào cả.

---

## 6. Sự cố hay gặp

| Triệu chứng | Nguyên nhân | Xử lý |
|---|---|---|
| Mọi request `ECONNREFUSED` | SUT chưa chạy | `node server.js` |
| Toàn bộ đỏ với `Thieu bien moi truong base_url` | quên chọn environment (GUI) hoặc thiếu `-e` (Newman) | chọn env / thêm `-e postman/environments/HW06-local.postman_environment.json` |
| `00-setup` đỏ với 403 | tài khoản seed đang bị khóa từ lượt trước | **restart SUT** (DB seed lại) |
| Chuỗi state đỏ hàng loạt từ giữa | một bước trong chuỗi hỏng, các bước sau mất `order_id` | chạy riêng `--folder 02-state`, đọc từ request đỏ đầu tiên |
| Số liệu lượt này khác lượt trước | không restart SUT giữa các collection | làm lại đúng thủ tục §1 |
| SUT chết giữa lượt chạy | có payload làm backend crash | **đây là bug Critical** — tách payload đó ra khỏi collection, tái hiện riêng bằng `curl`, ghi log crash vào bug report (xem [10](10-BUG-REPORT-GITHUB-ISSUES.md) §6) |

---

## 7. Checklist

- [ ] Đã chạy đủ 3 collection theo đúng thủ tục §1 (restart SUT trước mỗi cái)
- [ ] `reports/newman/` có **cả** `.html` và `.json` cho mỗi collection
- [ ] `npm run summary` chạy được, `summary.md` có số
- [ ] Cột `Kết quả` trong `audit.md` / `extended.md` đã điền
- [ ] Mỗi assertion đỏ đã truy được về 1 trong 3 loại ở §2
- [ ] 3 ảnh bằng chứng §11 đã có trong `bug-report/screenshots/`
- [ ] `23127183_regression.postman_collection.json` đã tạo và **0 đỏ**
- [ ] Commit: `test: chay Newman va thu bang chung (§6.4, §11)`
