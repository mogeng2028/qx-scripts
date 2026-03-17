/**

- AI 服务解锁检测
- 适用于 QuantumultX [task_local] event-interaction
- 检测：ChatGPT / Gemini / Claude / Grok
- 
- 配置写法：
- event-interaction https://raw.githubusercontent.com/mogeng2028/qx-scripts/main/ai_check.js, tag=AI解锁检测, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Global.png, enabled=true
  */

// 支持 ChatGPT 的地区代码
const GPT_REGIONS = [
“AL”,“DZ”,“AD”,“AO”,“AG”,“AR”,“AM”,“AU”,“AT”,“AZ”,“BS”,“BD”,“BB”,“BE”,“BZ”,
“BJ”,“BT”,“BA”,“BW”,“BR”,“BN”,“BG”,“BF”,“CV”,“CA”,“CL”,“CO”,“KM”,“CG”,“CR”,
“HR”,“CY”,“CZ”,“DK”,“DJ”,“DM”,“DO”,“EC”,“EG”,“SV”,“GQ”,“EE”,“SZ”,“ET”,“FJ”,
“FI”,“FR”,“GA”,“GM”,“GE”,“DE”,“GH”,“GR”,“GD”,“GT”,“GN”,“GW”,“GY”,“HT”,“HN”,
“HU”,“IS”,“IN”,“ID”,“IQ”,“IE”,“IL”,“IT”,“JM”,“JP”,“JO”,“KZ”,“KE”,“KI”,“KW”,
“KG”,“LV”,“LB”,“LS”,“LR”,“LI”,“LT”,“LU”,“MG”,“MW”,“MY”,“MV”,“ML”,“MT”,“MH”,
“MR”,“MU”,“MX”,“MC”,“MN”,“ME”,“MA”,“MZ”,“NA”,“NR”,“NP”,“NL”,“NZ”,“NI”,“NE”,
“NG”,“MK”,“NO”,“OM”,“PK”,“PW”,“PS”,“PA”,“PG”,“PY”,“PE”,“PH”,“PL”,“PT”,“QA”,
“RO”,“RW”,“KN”,“LC”,“VC”,“WS”,“SM”,“ST”,“SN”,“RS”,“SC”,“SL”,“SG”,“SK”,“SI”,
“SB”,“ZA”,“ES”,“LK”,“SR”,“SE”,“CH”,“TH”,“TG”,“TO”,“TT”,“TN”,“TR”,“TV”,“UG”,
“AE”,“US”,“UY”,“VU”,“ZM”,“BO”,“BN”,“CZ”,“VA”,“FM”,“MD”,“PS”,“KR”,“TW”,
“TZ”,“TL”,“GB”
];

const results = {};
let pending = 4;

function checkDone() {
pending–;
if (pending > 0) return;

const ok = “✅”;
const fail = “❌”;
const lines = [
`${results.chatgpt?.ok ? ok : fail} ChatGPT  ${results.chatgpt?.info || ""}`,
`${results.gemini?.ok  ? ok : fail} Gemini   ${results.gemini?.info  || ""}`,
`${results.claude?.ok  ? ok : fail} Claude   ${results.claude?.info  || ""}`,
`${results.grok?.ok    ? ok : fail} Grok     ${results.grok?.info    || ""}`,
];

const okCount = Object.values(results).filter(r => r.ok).length;
const title   = `🤖 AI 解锁检测 (${okCount}/4)`;
const subtitle = okCount === 4
? “全部解锁 🎉”
: Object.entries(results).filter(([, v]) => !v.ok).map(([k]) => k).join(” / “) + “ 受限”;
const body = lines.join(”\n”);

$notify(title, subtitle, body);
$done({ title, subtitle, content: body });
}

// ── ChatGPT ──────────────────────────────────────────────
$task.fetch({
url: “https://chat.openai.com/cdn-cgi/trace”,
method: “GET”,
headers: { “User-Agent”: “Mozilla/5.0” },
timeout: 10,
}).then(resp => {
const loc = (resp.body.match(/loc=(\w+)/) || [])[1] || “”;
const supported = GPT_REGIONS.includes(loc.toUpperCase());
results.chatgpt = supported
? { ok: true,  info: `支持 🌏${loc}` }
: { ok: false, info: `不支持 🚫${loc || "未知"}` };
}).catch(() => {
results.chatgpt = { ok: false, info: “连接失败” };
}).finally(checkDone);

// ── Gemini ───────────────────────────────────────────────
$task.fetch({
url: “https://gemini.google.com/”,
method: “GET”,
headers: { “User-Agent”: “Mozilla/5.0” },
timeout: 10,
}).then(resp => {
const blocked = /not available in your (country|region)/i.test(resp.body || “”);
results.gemini = (resp.statusCode === 200 && !blocked)
? { ok: true,  info: “支持 ✓” }
: { ok: false, info: “不支持 🚫” };
}).catch(() => {
results.gemini = { ok: false, info: “连接失败” };
}).finally(checkDone);

// ── Claude ───────────────────────────────────────────────
$task.fetch({
url: “https://claude.ai/api/auth/session”,
method: “GET”,
headers: { “User-Agent”: “Mozilla/5.0” },
timeout: 10,
}).then(resp => {
const s = resp.statusCode;
results.claude = (s === 200 || s === 401)
? { ok: true,  info: “支持 ✓” }
: { ok: false, info: `不支持 🚫(${s})` };
}).catch(() => {
results.claude = { ok: false, info: “连接失败” };
}).finally(checkDone);

// ── Grok ─────────────────────────────────────────────────
$task.fetch({
url: “https://grok.com/”,
method: “GET”,
headers: { “User-Agent”: “Mozilla/5.0” },
timeout: 10,
}).then(resp => {
const s = resp.statusCode;
results.grok = s === 200
? { ok: true,  info: “支持 ✓” }
: { ok: false, info: `不支持 🚫(${s})` };
}).catch(() => {
results.grok = { ok: false, info: “连接失败” };
}).finally(checkDone);
