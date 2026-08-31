# [BUG-05][Medium][API-01] JWT không có claim `exp` (không bao giờ hết hạn)

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `medium`, `api-01` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-01 |
| **Mức độ** | Medium |
| **Đặc tả bị vi phạm** | SEC-02: *"yêu cầu JWT Token hợp lệ"* |
| **Test case** | TC-LOGIN-030 |
| **Vị trí mã nguồn** | `server.js:50` — `jwt.sign({id, role}, SECRET_KEY)` không có option `expiresIn` |

Token rò rỉ một lần thì **có giá trị vĩnh viễn** — không có cơ chế tự hết hạn để giới hạn thiệt hại.
