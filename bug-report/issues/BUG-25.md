# [BUG-25][Medium][API-03] `:id` không tồn tại vẫn báo thành công/trả `200 {}` thay vì 404

> Copy TOÀN BỘ nội dung dưới đây dán vào GitHub New Issue → title lấy đúng dòng H1 ở trên (bỏ dấu #)
> → gắn label `bug`, `medium`, `api-03` → **kéo-thả ảnh minh hoạ vào cuối** trước khi Submit.

| | |
|---|---|
| **API** | API-03 |
| **Mức độ** | Medium |
| **Test case** | TC-PRODUPD-014, 024, 025, 042, 043 |

`PUT`/`GET` trên sản phẩm không tồn tại (kể cả sau khi `DELETE`) đều không trả 404 — `GET` trả
`200 {}`, `PUT` trả `200 {"message":"Product updated"}` dù không có dòng nào bị ảnh hưởng.
