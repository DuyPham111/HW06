#!/usr/bin/env node
// preflight — chay TRUOC moi luot Newman. Chan 4 nguyen nhan lam ca luot chay vo nghia:
//   1. SUT chua len          -> moi request ECONNREFUSED, bao cao toan do vi moi truong
//   2. Tai khoan seed doi    -> 00-setup khong lay duoc token, moi case can auth do theo
//   3. Coupon seed thieu     -> API-02 do vi thieu du lieu, khong phai vi bug
//   4. 3 API khong phan hoi  -> sai base_url / sai port
//
// Chay: npm run preflight
const BASE = process.env.BASE_URL || "http://localhost:3000";
const ok = (m) => console.log("  OK   " + m);
const bad = (m) => { console.error("  FAIL " + m); process.exitCode = 1; };

async function j(path, init) {
  const r = await fetch(BASE + path, init);
  let b = null; try { b = await r.json(); } catch {}
  return { status: r.status, body: b };
}

console.log(`[preflight] SUT = ${BASE}`);

// 1. SUT song?
let products;
try {
  const r = await j("/api/products");
  if (r.status !== 200 || !Array.isArray(r.body)) throw new Error("GET /api/products khong tra mang");
  products = r.body;
  ok(`SUT song - ${products.length} san pham trong DB`);
} catch (e) {
  bad(`SUT khong phan hoi tai ${BASE} (${e.message}). Chay backend truoc: cd eshop-sut/backend && node server.js`);
  process.exit(1);
}

// 2. Tai khoan seed
for (const [label, email, password, role] of [
  ["admin", "admin@eshop.com", "Admin123!", "admin"],
  ["user",  "test@eshop.com",  "Test1234!", "user"],
]) {
  const r = await j("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Student-Id": "23127183" },
    body: JSON.stringify({ email, password }),
  });
  if (r.status === 200 && r.body?.token) ok(`login ${label} (${email}) -> token, role=${r.body.user?.role}`);
  else if (r.status === 403) bad(`tai khoan ${label} DANG BI KHOA (lockout tu luot truoc) - khoi dong lai SUT de reset DB`);
  else bad(`login ${label} that bai: HTTP ${r.status} ${JSON.stringify(r.body)}`);
  if (role === "admin" && r.body?.user?.role !== "admin") bad("tai khoan admin khong co role=admin");
}

// 3. Coupon seed - API-02 phu thuoc 4 ma nay
const need = ["SAVE10", "BIGBUY", "VIP100", "EXPIRED"];
for (const code of need) {
  const r = await j("/api/apply-coupon", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Student-Id": "23127183" },
    body: JSON.stringify({ code, total_amount: 1000000 }),
  });
  if (r.status === 404) bad(`coupon seed thieu: ${code}`);
  else ok(`coupon ${code} ton tai (HTTP ${r.status})`);
}

// 4. Ba API chinh phan hoi
const probes = [
  ["POST /api/login",         () => j("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })],
  ["POST /api/apply-coupon",  () => j("/api/apply-coupon", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })],
  ["PUT  /api/products/:id",  () => j("/api/products/999999", { method: "PUT", headers: { "Content-Type": "application/json" }, body: "{}" })],
];
for (const [name, fn] of probes) {
  try { const r = await fn(); ok(`${name} phan hoi HTTP ${r.status}`); }
  catch (e) { bad(`${name} khong phan hoi: ${e.message}`); }
}

console.log(process.exitCode ? "[preflight] CO LOI - dung lai, dung chay Newman" : "[preflight] San sang.");
