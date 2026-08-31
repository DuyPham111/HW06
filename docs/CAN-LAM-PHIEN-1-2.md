# Phiên 1 (Setup) & Phiên 2 (Chọn API) — ĐÃ XONG

> Giữ file này làm nhật ký — mọi mục ở đây đã hoàn tất và có bằng chứng. Việc còn lại của cả bài
> (từ phiên 3 trở đi) chuyển sang [`CAN-LAM-TIEP-THEO.md`](CAN-LAM-TIEP-THEO.md).

---

## Đã làm — dòng lệnh

| Việc | Kết quả |
|---|---|
| SUT đã dựng và đang chạy | `HW06/eshop-sut/backend`, log `sut.log`. `curl http://localhost:3000/api/products` → `200`, 5 sản phẩm |
| Newman đã cài | `newman@6.2.2` + `newman-reporter-htmlextra` (local, dùng qua `npx`) |
| `npm run preflight` | toàn bộ `OK` |
| `tools/run-newman.sh` | tự dùng `npx newman` khi không có bản global |
| `docs/api-selection.md` §2, §3 | bảng 3 API · lý do chọn · 28 giả thuyết bug rút từ `server.js` |

## Đã làm — Postman GUI (bạn tự làm, đã kiểm ảnh)

| Việc | Ảnh | Đánh giá |
|---|---|---|
| Workspace `HW06-API-Testing-23127183` | `bug-report/screenshots/postman-workspace.png` | ✅ đúng tên |
| Pre-request script + Postman Console | `bug-report/screenshots/postman-console-gui.png` | ✅ log `[HW06] X-Student-Id = "23127183"`, header có trong request, response `200` — đạt chuẩn §11 |
| Báo nhóm chống trùng API (§5) | `bug-report/screenshots/xac-nhan-nhom-chon-api.png` | ✅ đã nhúng vào `docs/api-selection.md` §1, thay cho bảng đối chiếu (nhóm phản hồi chậm) |

**Một điều cần làm khi mở lại Postman:** ảnh workspace đang cho thấy dropdown để **"No environment"**.
Trước khi bắt đầu dựng collection ở phiên 7, vào **Environments** → chọn lại
`HW06-local-23127183` và **để nó luôn được chọn** (ảnh Console cho thấy nó đã hoạt động đúng lúc
test, nên đây chỉ là việc chọn lại, không phải sửa lỗi).

## Đã commit + push

- `chore: setup moi truong HW06 + preflight (phien 1 thuc thi that)`
- (commit tiếp theo cho ảnh + sửa `api-selection.md` — xem `git log`)

---

Sẵn sàng cho phiên 3 trở đi — xem [`CAN-LAM-TIEP-THEO.md`](CAN-LAM-TIEP-THEO.md).
