# [BUG-19][Critical][API-03] DoS: cập nhật thiếu trường rồi xem chi tiết làm SẬP TOÀN BỘ BACKEND

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `critical`, `api-03` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-03 · `PUT /api/products/:id` + `GET /api/products/:id` |
| **Mức độ** | **Critical — nặng nhất trong cả bài** |
| **Test case** | TC-PRODUPD-101 (chỉ trong `verify-bugs.sh`, **không** trong collection Postman — xem lý do ở `docs/10-BUG-REPORT-GITHUB-ISSUES.md` §6) |
| **Vị trí mã nguồn** | `server.js:162` — `if (row.id % 2 === 0) row.price = row.price.toString();` |

**Các bước tái hiện**

```bash
bash bug-report/verify-bugs.sh 19
```

**Kết quả thực tế** — log thật từ terminal chạy `node server.js`:
```
D:\...\eshop-sut\backend\server.js:162
    if (row.id % 2 === 0) row.price = row.price.toString();
                                                ^
TypeError: Cannot read properties of null (reading 'toString')
    at Statement.<anonymous> (D:\...\server.js:162:49)
    ...
Node.js v22.16.0
```
Toàn bộ tiến trình Node.js **thoát hẳn** — mọi request khác (kể cả của người dùng không liên quan)
nhận `ECONNREFUSED` cho tới khi ai đó khởi động lại server thủ công.

**Nguyên nhân:** `PUT /api/products/:id` với body thiếu `price` khiến câu lệnh `UPDATE` ghi `NULL`
vào cột `price` (không validate, xem BUG-20). Với sản phẩm có `id` **chẵn**, lần `GET` kế tiếp gọi
`row.price.toString()` trên `null` → ném lỗi **không được bắt (uncaught)** → crash tiến trình.

**Kết quả mong đợi** — `PUT` thiếu trường phải bị từ chối (400) trước khi chạm DB; và dù có xảy ra
dữ liệu `NULL`, `GET` không được để một lỗi kiểu dữ liệu làm sập cả tiến trình.

**Ảnh hưởng** — DoS toàn hệ thống chỉ với **2 request tuần tự, không cần quyền admin thật** (route
này cũng không yêu cầu xác thực — xem BUG-21). Đây là bug bị phát hiện **ngoài ý muốn** trong lúc dò
lỗi khác — xem ghi chú đầy đủ ở `test-cases/api-03-product-update/audit.md`.
