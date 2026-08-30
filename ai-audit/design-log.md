# Design log — quyết định thiết kế trong quá trình làm HW06

> Khác `ai-audit-report.md` (ghi **lượt hỏi AI**), file này ghi **quyết định của bạn** và lý do.
> Người chấm đọc nó để thấy bạn suy nghĩ chứ không chỉ thao tác. Không bắt buộc, nhưng rẻ và có ích.

| # | Ngày | Quyết định | Phương án đã cân nhắc | Vì sao chọn |
|---|---|---|---|---|
| D-01 | | Chọn FR-02 / FR-09 / FR-15 (kế thừa HW02/HW04/HW05) | chọn 3 API mới hoàn toàn | đã hiểu sâu nghiệp vụ, có sẵn bug HW02 làm chất liệu §6.3 |
| D-02 | | Đặt state machine FR-10 vào API-02 (Pool B) | đổi API-03 sang `PUT /api/admin/orders/:id/status` | giữ kế thừa FR-15 mà vẫn phủ FR-10; Pool B trong đề liệt kê FR-08/FR-10 là ví dụ hợp lệ |
| D-03 | | CI dùng **hai bộ, hai cổng** | lấy 0 assertion đỏ làm cổng chung | bộ chính cố ý bắt bug nên cổng 0 đỏ sẽ đỏ vĩnh viễn và mất tín hiệu hồi quy |
| D-04 | | Tạo lượt CI đỏ bằng `gate_mode=strict` | cố tình viết một test sai vào repo | không làm bẩn bộ test; và trung thực hơn khi giải thích |
| D-05 | | | | |
