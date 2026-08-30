// ============================================================================
// PRE-REQUEST SCRIPT — DÁN Ở CẤP COLLECTION (tab Scripts -> Pre-request) cho CẢ 3 collection.
//
// §6.4 của đề: "Every request must carry the header X-Student-Id: {StudentID}
// (for example, via a pre-request script)".
// §11 (Anti-AI-Cheat) đòi thêm ẢNH CONSOLE chứng minh header này có thật
// -> script chủ động console.log để bạn chụp được trong Postman Console.
//
// Vì sao đặt ở CẤP COLLECTION chứ không gắn tay từng request:
// 35+ request x 3 API = hơn 100 chỗ phải sửa; sót 1 request là mất bằng chứng §11 cho request đó.
// ============================================================================

// 1) Header bắt buộc - thêm cho MỌI request trong collection.
const studentId = pm.environment.get("student_id") || "23127183";
pm.request.headers.upsert({ key: "X-Student-Id", value: studentId });

// 2) Bằng chứng §11: in ra Postman Console (View -> Show Postman Console) để chụp ảnh.
console.log(
  "[HW06] X-Student-Id =", studentId,
  "|", pm.request.method, pm.request.url.getPath(),
  "|", new Date().toISOString()
);

// 3) Thiếu base_url thì mọi request fail với lý do khó đọc -> chặn sớm, báo đúng nguyên nhân.
if (!pm.environment.get("base_url")) {
  throw new Error("Thieu bien moi truong base_url - hay chon environment HW06-local-23127183");
}
