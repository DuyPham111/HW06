# 08 — §6 Liệt kê Postman feature đã dùng

> Output: `postman/README.md` + ảnh trong `bug-report/screenshots/`.
> **Commit:** `docs: danh sach Postman feature da dung (§6)`

---

## 1. Đề đòi gì

§6: *"Exercise as many Postman features as you reasonably can — for example: workspaces, collections,
variables, environments, data-driven runs (the Collection Runner with a data file), monitors, and
mock servers. **List the Postman features you used in your report.**"*

§14 nhắc lại: *".json collection và HTML report, **plus the list of Postman features you used**"*.

Hai chữ **"reasonably"** cho phép bạn bỏ feature không hợp lý — nhưng phải **ghi rõ vì sao bỏ**.
Bảng có cột "vì sao không dùng" ăn điểm hơn bảng chỉ liệt kê cái đã dùng.

---

## 2. Bảng feature — mục tiêu 10/13

Điền vào `postman/README.md`. Cột **Bằng chứng** phải trỏ tới file hoặc ảnh có thật.

| # | Feature | Dùng để làm gì trong bài này | Bằng chứng | Độ khó |
|---|---|---|---|---|
| 1 | **Workspace** | `HW06-API-Testing-23127183` chứa cả 4 collection | ảnh `postman-workspace.png` | dễ |
| 2 | **Collections** | 3 collection bug-hunting + 1 regression | `postman/collections/*.json` | dễ |
| 3 | **Folders** | 6 folder/collection theo kỹ thuật → báo cáo Newman tự nhóm | ảnh sidebar | dễ |
| 4 | **Environment** | `HW06-local-23127183` — 16 biến, tách `base_url` khỏi request | `postman/environments/*.json` | dễ |
| 5 | **Variables** (env + collection + dynamic) | `{{base_url}}`, `{{admin_token}}`, `{{order_id}}`; dynamic `{{$randomEmail}}`, `{{$timestamp}}` cho tài khoản mồi | trích script trong `postman/README.md` | dễ |
| 6 | **Secret variable type** | `admin_password`, `user_password`, token đặt type `secret` → không lộ khi share | ảnh màn hình Environment | dễ |
| 7 | **Pre-request script (cấp collection)** | gắn `X-Student-Id` cho mọi request + log Console (§11) | `postman/prerequest-collection.js` | **bắt buộc** |
| 8 | **Post-response script / `pm.test`** | toàn bộ assertion | mọi request | **bắt buộc** |
| 9 | **JSON Schema validation** (`pm.response.to.have.jsonSchema`) | folder `04-schema` — §6.1 đòi *"response shape exactly matches the spec"* | trích script | trung bình |
| 10 | **Collection Runner + data file (CSV)** | chạy data-driven, §6 gọi tên đích danh | `postman/data/*.csv` + ảnh `postman-data-driven.png` | trung bình |
| 11 | **Postman Console** | bằng chứng §11 | ảnh `postman-console-gui.png` | **bắt buộc** |
| 12 | **Newman CLI + htmlextra reporter** | chạy ngoài GUI, xuất HTML + raw JSON | `reports/newman/` | **bắt buộc** |
| 13 | **Newman trong CI (GitHub Actions)** | §6 đòi CI/CD | `.github/workflows/api-tests.yml` | trung bình |
| 14 | **Mock Server** | *(xem §3)* | | khó |
| 15 | **Monitor** | *(xem §3)* | | khó |

---

## 3. Mock Server và Monitor — làm hay bỏ?

Đây là 2 feature đề gọi tên mà nhiều bạn bỏ. Cả hai **làm được trong 15 phút** và đáng làm vì đề
liệt kê đích danh.

### 3.1 Mock Server — 10 phút

**Dùng để làm gì cho có nghĩa:** SUT trả `discount_amount` sai công thức. Mock server dựng một
endpoint trả **response đúng theo FR-09** — dùng nó để chứng minh assertion của bạn **xanh khi API
đúng**, tức là assertion không bị viết sai chiều.

Đây là lập luận đáng viết vào báo cáo: *"assertion đỏ là do SUT sai, không phải do assertion sai —
chạy cùng assertion đó lên mock server trả đúng đặc tả thì nó xanh."*

**Các bước:**

1. Trong collection `23127183_api-02-apply-coupon`, chọn request `TC-COUPON-0xx SAVE10 500000`.
2. Tab **Examples** (cạnh nút Send) → **Add Example** → đặt tên `FR-09 dung dac ta`.
3. Trong example, đặt Status `200`, Body:
   ```json
   { "success": true, "coupon_id": 1, "discount_amount": 50000, "final_amount": 450000, "message": "Áp dụng thành công! Giảm 10%" }
   ```
   **Save**.
4. Sidebar → `…` cạnh collection → **Mock collection** → tên `HW06-mock-FR09` → **Create Mock Server**.
5. Copy URL mock (dạng `https://<id>.mock.pstmn.io`).
6. Tạo environment thứ hai `HW06-mock-23127183`, đặt `base_url` = URL mock, `student_id` = `23127183`.
7. Chạy request đó với environment mock → assertion **xanh**. Chụp ảnh lưu `postman-mock-server.png`.

Viết vào `postman/README.md`: mục đích, URL mock, kết quả, và kết luận về chiều của assertion.

### 3.2 Monitor — 5 phút

**Vấn đề:** Monitor chạy trên cloud của Postman, mà SUT của bạn ở `localhost` → monitor không gọi tới
được. Đó là lý do chính đáng để **không** monitor bộ test chính.

**Cách làm có nghĩa:** tạo monitor cho **collection mock** (§3.1) — nó ở trên cloud nên monitor gọi
được. Monitor này chốt rằng bộ assertion FR-09 của bạn vẫn xanh trên một API đúng đặc tả.

1. `…` cạnh collection mock → **Monitor collection**.
2. Tên `HW06-monitor-FR09-23127183`, chọn environment `HW06-mock-23127183`, tần suất **hàng tuần**
   (đừng để hàng giờ, tốn quota).
3. **Create** → bấm **Run** một lần ngay để có kết quả.
4. Chụp ảnh trang kết quả monitor, lưu `postman-monitor.png`.

**Nếu bạn quyết định không làm monitor**, viết đúng lý do này vào `postman/README.md`:

> Monitor chạy trên hạ tầng cloud của Postman, không truy cập được `http://localhost:3000` nơi SUT
> triển khai (§11 cũng đòi hostname phải là localhost/127.0.0.1). Vì vậy monitor không áp dụng được
> cho bộ test chính. Đã dùng **GitHub Actions** (`.github/workflows/api-tests.yml`) làm cơ chế chạy
> định kỳ/tự động tương đương, vì runner tự dựng SUT trong job.

Lý do này hợp lệ và cho thấy bạn hiểu feature, không phải bỏ vì không biết làm.

---

## 4. Viết `postman/README.md`

Khung file đã có sẵn. Bốn phần:

1. **Bảng feature** (§2) — điền cột Bằng chứng, xóa dòng nào không làm.
2. **Trích script tiêu biểu** — pre-request `X-Student-Id`, 1 assertion JSON Schema, 1 assertion
   data-driven. Dán code thật, không mô tả suông.
3. **Mock server + Monitor** — mục đích, link, ảnh, kết luận (hoặc lý do không dùng).
4. **Feature cân nhắc nhưng không dùng** — mỗi dòng 1 câu lý do. Ví dụ:

   | Feature | Vì sao không dùng |
   |---|---|
   | Postman Flows | bộ test này tuyến tính, Flows không thêm khả năng kiểm nào mà lại làm collection khó xuất ra `.json` để CI chạy |
   | Public workspace | collection chứa mật khẩu tài khoản seed; để Personal |
   | Postman API (quản lý collection bằng API) | không cần: chỉ 4 collection, export tay là đủ |

---

## 5. Checklist

- [ ] `postman/README.md` có bảng feature, mỗi dòng đã dùng đều có bằng chứng trỏ tới file/ảnh có thật
- [ ] ≥10 feature đã dùng
- [ ] Mock server đã tạo, có ảnh, có kết luận về chiều của assertion
- [ ] Monitor đã tạo **hoặc** có lý do không dùng viết rõ
- [ ] Mục "cân nhắc nhưng không dùng" có ≥2 dòng
- [ ] Commit: `docs: danh sach Postman feature da dung (§6)`
