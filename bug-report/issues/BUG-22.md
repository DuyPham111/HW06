# [BUG-22][Critical][API-03] `PUT /api/products/:id` không kiểm role admin (SEC-03)

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `critical`, `api-03` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-03 |
| **Mức độ** | **Critical** |
| **Test case** | TC-PRODUPD-029 |

(Về lý thuyết đây là lớp bảo vệ thứ 2 sau BUG-21; vì BUG-21 đã bỏ hẳn xác thực nên lớp role-check
càng không tồn tại — ghi riêng vì đây là 2 lớp phòng thủ độc lập theo đúng SEC-02/SEC-03.)
