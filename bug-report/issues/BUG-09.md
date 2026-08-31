# [BUG-09][Medium][API-01] Account enumeration qua kênh phụ (so sánh 2 response)

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `medium`, `api-01` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-01 |
| **Mức độ** | Medium |
| **Đặc tả bị vi phạm** | FR-02: *"không để lộ chi tiết nguyên nhân"* |
| **Test case** | TC-LOGIN-102 (đối chứng TC-LOGIN-023c) |

Email **không tồn tại**: luôn 401 dù thử sai bao nhiêu lần. Email **tồn tại**: sau 2 lần sai, request
thứ 3 trả **403**. Kẻ tấn công dò được **chính xác** email nào có tài khoản thật bằng cách gửi 3
request sai liên tiếp và xem status code cuối — vi phạm đúng nguyên tắc FR-02 đã nêu, chỉ là qua kênh
gián tiếp (nhiều request) thay vì lộ trong 1 response.
