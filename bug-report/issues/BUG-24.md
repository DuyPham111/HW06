# [BUG-24][Medium][API-03] `:id` sai định dạng/không hợp lệ vẫn xử lý như thành công

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `medium`, `api-03` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-03 |
| **Mức độ** | Medium |
| **Test case** | TC-PRODUPD-015, TC-PRODUPD-031 |

`:id = "abc"` hoặc chứa payload SQLi-shape (`1 OR 1=1`) đều nhận **200 "Product updated"** thay vì
400 — vì parameterized query chỉ đơn giản không khớp dòng nào (`this.changes = 0`), nhưng handler
không kiểm giá trị này trước khi trả về thành công.
