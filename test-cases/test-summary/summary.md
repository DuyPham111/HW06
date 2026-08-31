# Test summary — sinh tu dong bang `npm run summary`

> **Dung go tay so nao trong file nay.** Moi con so doc tu `reports/newman/*.json`.
> Sinh luc: 2026-08-31T05:58:33.949Z

| Collection | Request | Assertion | Pass | **Fail** | Raw JSON |
|---|--:|--:|--:|--:|---|
| api-01-login | 53 | 53 | 44 | **9** | `23127183_api-01-login_20260831-124339.json` |
| api-02-apply-coupon | 59 | 59 | 44 | **15** | `23127183_api-02-apply-coupon_20260831-125109.json` |
| api-03-product-update | 51 | 51 | 26 | **25** | `23127183_api-03-product-update_20260831-125812.json` |
| **Tong** | **163** | **163** | **114** | **49** | |

## Assertion do — moi dong phai map toi 1 bug trong bug-report/bug-report.md

| Collection | Request | Assertion that bai |
|---|---|---|
| api-01-login | TC-LOGIN-016 undefined | TC-LOGIN-016: sai content-type - khong duoc crash 500 |
| api-01-login | TC-LOGIN-103 undefined | TC-LOGIN-103 SV: tai khoan dang ky sau phai dang nhap duoc |
| api-01-login | TC-LOGIN-022 undefined | TC-LOGIN-022: dung mat khau o request thu 3 - AI du doan THANH CONG |
| api-01-login | TC-LOGIN-028 undefined | TC-LOGIN-028 SEC-01: khong lo password trong response |
| api-01-login | TC-LOGIN-029 undefined | TC-LOGIN-029 SEC-01: khong lo cot noi bo |
| api-01-login | TC-LOGIN-030 undefined | TC-LOGIN-030 SEC-02: JWT phai co exp |
| api-01-login | TC-LOGIN-036 undefined | TC-LOGIN-036: body khong phai JSON - khong duoc la HTML loi |
| api-01-login | TC-LOGIN-037 undefined | TC-LOGIN-037: khong lo field thua |
| api-01-login | TC-LOGIN-104 undefined | TC-LOGIN-104 SV: khong lo duong dan he thong khi loi parse JSON |
| api-02-apply-coupon | TC-COUPON-001 undefined | TC-COUPON-001: SAVE10 dung cong thuc FR-09 |
| api-02-apply-coupon | TC-COUPON-023 undefined | TC-COUPON-023: huy don dang shipping bi chan |
| api-02-apply-coupon | TC-COUPON-028 undefined | TC-COUPON-028: canceled la trang thai ket thuc |
| api-02-apply-coupon | TC-COUPON-102 undefined | TC-COUPON-102 buoc 1: VIP100 lan 1 hop le |
| api-02-apply-coupon | TC-COUPON-102c undefined | TC-COUPON-102c: VIP100 lan 2 hop le |
| api-02-apply-coupon | TC-COUPON-031 undefined | TC-COUPON-031 SEC-02: khong token phai bi chan |
| api-02-apply-coupon | TC-COUPON-032 undefined | TC-COUPON-032 SEC-03: user thuong khong duoc doi trang thai don |
| api-02-apply-coupon | TC-COUPON-033 undefined | TC-COUPON-033 IDOR: xem don khong token phai bi chan |
| api-02-apply-coupon | TC-COUPON-034 undefined | TC-COUPON-034: khong duoc tin total_amount tu client |
| api-02-apply-coupon | TC-COUPON-036 undefined | TC-COUPON-036 IDOR: user_id tu body la loi thiet ke |
| api-02-apply-coupon | TC-COUPON-037 undefined | TC-COUPON-037: khong gui user_id khong duoc bo qua C5 |
| api-02-apply-coupon | TC-COUPON-039 undefined | TC-COUPON-039 SEC-03: user thuong khong duoc goi endpoint admin (target thu 2) |
| api-02-apply-coupon | TC-COUPON-101 undefined | TC-COUPON-101 SV: checkout gia mao gia phai bi chan |
| api-02-apply-coupon | TC-COUPON-042 undefined | TC-COUPON-042: discount_amount khong am |
| api-02-apply-coupon | TC-COUPON-043 undefined | TC-COUPON-043: final_amount khong duoc lon hon total_amount |
| api-03-product-update | TC-PRODUPD-002 undefined | TC-PRODUPD-002: name rong phai bi tu choi |
| api-03-product-update | TC-PRODUPD-004 undefined | TC-PRODUPD-004: name 256 ky tu phai bi tu choi |
| api-03-product-update | TC-PRODUPD-006 undefined | TC-PRODUPD-006: price = 0 phai bi tu choi |
| api-03-product-update | TC-PRODUPD-007 undefined | TC-PRODUPD-007: price am phai bi tu choi |
| api-03-product-update | TC-PRODUPD-008 undefined | TC-PRODUPD-008: price sai kieu bi tu choi |
| api-03-product-update | TC-PRODUPD-009 undefined | TC-PRODUPD-009: category_id khong ton tai bi tu choi |
| api-03-product-update | TC-PRODUPD-010 undefined | TC-PRODUPD-010: thieu category_id bi tu choi |
| api-03-product-update | TC-PRODUPD-014 undefined | TC-PRODUPD-014: id khong ton tai phai 404 |
| api-03-product-update | TC-PRODUPD-015 undefined | TC-PRODUPD-015: id sai kieu phai 400 |
| api-03-product-update | TC-PRODUPD-022 undefined | TC-PRODUPD-022: cac truong khac KHONG duoc mat sau PUT mot phan |
| api-03-product-update | TC-PRODUPD-024 undefined | TC-PRODUPD-024: sau xoa GET phai 404 |
| api-03-product-update | TC-PRODUPD-025 undefined | TC-PRODUPD-025: PUT len san pham da xoa phai 404 |
| api-03-product-update | TC-PRODUPD-105 undefined | TC-PRODUPD-105 SV: body rong phai bi tu choi, khong duoc xoa sach du lieu |
| api-03-product-update | TC-PRODUPD-027 undefined | TC-PRODUPD-027 SEC-02: PUT khong token phai bi chan |
| api-03-product-update | TC-PRODUPD-028 undefined | TC-PRODUPD-028: du lieu KHONG duoc doi neu SEC-02 dung |
| api-03-product-update | TC-PRODUPD-029 undefined | TC-PRODUPD-029 SEC-03: user thuong khong duoc sua |
| api-03-product-update | TC-PRODUPD-030 undefined | TC-PRODUPD-030: token rac phai bi chan |
| api-03-product-update | TC-PRODUPD-031 undefined | TC-PRODUPD-031 SEC-05: SQLi trong id bi tu choi dung dinh dang |
| api-03-product-update | TC-PRODUPD-102 undefined | TC-PRODUPD-102 SV: DELETE khong token phai bi chan |
| api-03-product-update | TC-PRODUPD-038 undefined | TC-PRODUPD-038: id le - price la number |
| api-03-product-update | TC-PRODUPD-039 undefined | TC-PRODUPD-039: id chan - price VAN PHAI la number |
| api-03-product-update | TC-PRODUPD-040 undefined | TC-PRODUPD-040: schema loi 400 |
| api-03-product-update | TC-PRODUPD-042 undefined | TC-PRODUPD-042: id khong ton tai phai 404 khong phai 200 rong |
| api-03-product-update | TC-PRODUPD-043 undefined | TC-PRODUPD-043: PUT id khong ton tai tra loi dung, khong bao thanh cong gia |
| api-03-product-update | TC-PRODUPD-045 undefined | TC-PRODUPD-045: body loi khong duoc la HTML co stack trace |

> **Assertion do o day la KET QUA MONG DOI.** Expected cua bo test bam theo DAC TA (FR/SEC),
> khong bam theo hanh vi hien tai cua SUT. SUT co bug co y -> do = phat hien duoc bug.
> Sua expected cho khop SUT la cach nhanh nhat de bo test mat het gia tri.
