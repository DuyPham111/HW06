// postman-builder.mjs — dung chung: nhan mang "case" (dinh nghia 1 lan) -> sinh
// (a) bang Markdown 12 cot  (b) item Postman that trong collection v2.1.
// Day la phan "GD5: xuat artefact" cua generator/design.md - MOT nguon, NHIEU dich.

export function mdRow(c) {
  const q = (c.bodyDesc ?? (c.body ? JSON.stringify(c.body) : "–"));
  const secLabel = c.technique === "Security" ? `Security ${c.sec}` : c.technique;
  return `| ${c.id} | ${secLabel} | ${c.partition} | \`${c.method} ${c.pathDesc ?? c.path}\` | ${c.auth} | ${q} | ${c.expectedStatus} | ${c.expectedBody} | ${c.basis} | ${c.source} | ${c.audit ?? ""} | ${c.result ?? ""} |`;
}

export function mdTable(cases) {
  const header = "| TC ID | Kỹ thuật | Tham số & phân vùng | Request | Auth | Query / Body | Expected status | Expected body / schema | Căn cứ | Nguồn | Audit | Kết quả |\n|---|---|---|---|---|---|---|---|---|---|---|---|";
  return header + "\n" + cases.map(mdRow).join("\n");
}

// Postman item tu 1 case. c.test = chuoi JS (script pm.test...) - viet tay tung case.
export function pmItem(c) {
  const header = [];
  const overridesContentType = c.extraHeaders && Object.keys(c.extraHeaders).some((k) => k.toLowerCase() === "content-type");
  if (c.body && !overridesContentType) header.push({ key: "Content-Type", value: "application/json" });
  if (c.authHeader) header.push({ key: "Authorization", value: c.authHeader });
  if (c.extraHeaders) for (const [k, v] of Object.entries(c.extraHeaders)) header.push({ key: k, value: v });

  const url = c.path.startsWith("{{") || c.path.startsWith("/")
    ? `{{base_url}}${c.path}`
    : c.path;

  const item = {
    name: c.id,
    event: [],
    request: {
      method: c.method,
      header,
      url: { raw: url, host: ["{{base_url}}"], path: url.replace("{{base_url}}", "").split("/").filter(Boolean) },
    },
    response: [],
  };
  if (c.body !== undefined && c.body !== null) {
    item.request.body = { mode: "raw", raw: typeof c.body === "string" ? c.body : JSON.stringify(c.body, null, 2), options: { raw: { language: "json" } } };
  }
  if (c.preRequest) {
    item.event.push({ listen: "prerequest", script: { type: "text/javascript", exec: c.preRequest.split("\n") } });
  }
  if (c.test) {
    item.event.push({ listen: "test", script: { type: "text/javascript", exec: c.test.split("\n") } });
  }
  return item;
}

export function folder(name, items) {
  return { name, item: items.map(pmItem) };
}

export function collection(name, folders, preRequestCollectionScript) {
  return {
    info: {
      name,
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
      _postman_id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    },
    event: [
      { listen: "prerequest", script: { type: "text/javascript", exec: preRequestCollectionScript.split("\n") } },
    ],
    item: folders,
  };
}
