#!/usr/bin/env python3
"""
Pseudocode cho AI-driven API Test Generator (HW06 §7) — 6 giai đoạn của generator/design.md §3.

ĐÂY LÀ PSEUDOCODE mô tả thiết kế, không phải code chạy được.
Bản "chạy được" của thiết kế này là 4 Agent Skill trong .claude/skills/.

Quy ước đọc:
    # DECIDE:  = chỗ người thiết kế phải quyết định, và đã quyết định thế nào.
                 Đây là phần được chấm ở mức Create (G9.5) — người chấm tìm đúng những dòng này.

SV: Phạm Vũ Ngọc Duy — 23127183
"""

SEC_RULES = ["SEC-01", "SEC-02", "SEC-03", "SEC-04", "SEC-05", "SEC-06", "SEC-07"]

PARTITION_KINDS = [
    "hợp lệ điển hình", "biên dưới", "biên dưới - 1", "biên trên", "biên trên + 1",
    "rỗng", "thiếu hẳn trường", "sai kiểu (số/mảng/object/null)", "quá dài",
    "ký tự đặc biệt", "Unicode có dấu", "khoảng trắng đầu-cuối",
    "ký tự đặc biệt của tầng dưới (% _ ' cho LIKE/SQL)",
]

AUTH_PARTITIONS = [
    "không có header", "header rỗng", "thiếu tiền tố Bearer", "token rác",
    "token sai chữ ký", "token user thường", "token admin", "token đã hết hạn",
]

TECHNIQUES = ["Domain", "State", "Security", "Schema"]


def generate(spec, fr_sec, source_code, api):
    """Sinh bộ test case cho MỘT api. Trả về danh sách TestCase (12 trường)."""

    # ── GĐ 1: parse 3 nguồn, KHÔNG chỉ 1 ────────────────────────────────────
    params = parse_params(spec, api)              # tên · vị trí (body/header/query/path) · kiểu · bắt buộc
    params += [Param("Authorization", where="header", kinds=AUTH_PARTITIONS)]

    silent = find_spec_silence(spec, params)      # spec KHÔNG nói gì về cái gì
    behaviour = read_source(source_code, api)     # hành vi thật + số dòng + middleware có/không
    business = extract_rules(fr_sec, api)         # FR-xx: điều kiện nghiệp vụ · SEC-0x: ràng buộc bảo mật

    # DECIDE: nguồn nào quyết định `expected`?
    #   expected LUÔN bám spec + FR/SEC. `behaviour` chỉ dùng để BIẾT CHỖ NÀO ĐÁNG CHỌC.
    #   Nếu để expected bám code thì sinh ra một bộ test luôn xanh trên một hệ thống đang sai.

    # ── GĐ 2: suy ràng buộc ─────────────────────────────────────────────────
    rules, open_questions = [], []
    for p in params:
        r = infer_rule(p, spec, business)

        # DECIDE: spec im lặng thì làm gì?
        #   KHÔNG bịa expected. Hai lựa chọn hợp lệ:
        #     (a) suy từ FR/SEC, ghi rõ suy từ đâu vào cột `Căn cứ`;
        #     (b) chỉ khẳng định phần spec bảo đảm (status + schema + Content-Type).
        #   Một expected không căn cứ sẽ sinh ra BUG GIẢ — lỗi tệ nhất của bộ test.
        if p in silent and not derivable_from(business, p):
            r = weaken_to_spec_guarantee(r)
            open_questions.append(p)

        rules.append(r)

    # ── GĐ 3: sinh case theo 4 nhóm — 4 LƯỢT RIÊNG, không gộp ───────────────
    # DECIDE: vì sao 4 lượt riêng?
    #   §2 của đề cấm prompt gộp. Và thực nghiệm: gộp một lượt thì AI dồn hết về security
    #   (nó "quen tay" hơn) và chỉ sinh 2-3 case state cho có.
    cases = []
    for technique in TECHNIQUES:                       # 4 lượt AI riêng biệt
        prompt = build_prompt(technique, rules, silent, business, behaviour)
        raw = ask_ai(prompt)                           # ghi log §9 NGAY tại đây
        log_ai_turn(technique, prompt, raw)            # tool · ngày giờ · prompt · output
        cases += parse_table(raw, technique)

    # ── GĐ 4: khử trùng + xếp thứ tự ────────────────────────────────────────
    cases = dedupe(cases, key=lambda c: (c.param, c.partition, c.auth))
    for c in cases:
        c.id = next_id(api.prefix)                     # TC-<PREFIX>-###

    # DECIDE: case State phải chạy đúng thứ tự và truyền biến.
    #   Không dùng postman.setNextRequest (thứ tự chạy khác thứ tự đọc -> người chấm khó đối chiếu).
    #   Thay vào đó: đánh số theo thứ tự thực thi + truyền dữ liệu qua environment variable.
    order_state_chains(cases)
    for c in cases:
        if c.writes_data:
            c.cleanup = plan_cleanup(c)                # hoặc xếp cuối nếu không dọn được

    # ── GĐ 5: xuất artefact — MỘT nguồn, NHIỀU đích ────────────────────────
    # DECIDE: đầu ra là ĐỊNH NGHĨA CASE, không phải file cuối.
    #   Bảng .md, collection .json và CSV đều sinh từ cùng object -> không thể lệch nhau.
    emit_markdown_table(cases)                         # test-cases/<api>/generated.md (12 cột)
    emit_postman_collection(cases)                     # postman/collections/<sid>_<api>.json
    emit_csv_data_files(cases)                         # postman/data/*.csv (data-driven §6)

    # ── GĐ 6: cổng kiểm chất lượng ─────────────────────────────────────────
    # DECIDE: bốn phép kiểm này biến 4 phép soát bằng mắt (§6.2) thành phép kiểm bằng máy.
    problems = []
    for c in cases:
        if not c.basis:                                       # 1. expected không có căn cứ
            problems.append((c, "thiếu cột Căn cứ"))
        if assertion_weaker_than(c.checks, c.expected):       # 2. assertion yếu hơn expected
            problems.append((c, "assertion không kiểm hết expected"))
        if assertion_stricter_than(c.checks, c.expected):     # 3. assertion NGHIÊM HƠN expected
            problems.append((c, "assertion nghiêm hơn bảng -> sẽ báo bug giả"))
    for p in uncovered_partitions(params, cases):             # 4. phân vùng chưa phủ
        problems.append((p, "phân vùng chưa có case nào"))

    if problems:
        report(problems)
        return generate_more(problems)                 # quay lại GĐ3 — vòng lặp phản hồi

    # DECIDE: generator KHÔNG tự kết luận bug.
    #   Nó dừng ở đây. Việc chạy thật, đối chiếu và kết luận "đây là bug" là của NGƯỜI.
    #   Một generator tự gắn nhãn bug sẽ nhân bản lỗi bịa expected lên hàng trăm case.
    return cases, open_questions


# ── Hàm phụ (chỉ chữ ký — chi tiết nằm trong 4 Agent Skill) ─────────────────

def parse_params(spec, api): ...
def find_spec_silence(spec, params): ...
def read_source(code, api): ...
def extract_rules(fr_sec, api): ...
def infer_rule(param, spec, business): ...
def derivable_from(business, param): ...
def weaken_to_spec_guarantee(rule): ...
def build_prompt(technique, rules, silent, business, behaviour): ...
def ask_ai(prompt): ...
def log_ai_turn(stage, prompt, output): ...   # §9 - ghi NGAY, đừng dựng lại sau
def parse_table(raw, technique): ...
def dedupe(cases, key): ...
def next_id(prefix): ...
def order_state_chains(cases): ...
def plan_cleanup(case): ...
def emit_markdown_table(cases): ...
def emit_postman_collection(cases): ...
def emit_csv_data_files(cases): ...
def assertion_weaker_than(checks, expected): ...
def assertion_stricter_than(checks, expected): ...
def uncovered_partitions(params, cases): ...
def report(problems): ...
def generate_more(problems): ...
