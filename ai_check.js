/**

- AI 服务解锁检测脚本
- 适用于 QuantumultX
- 
- 检测服务：ChatGPT / Claude / Gemini / Perplexity / Grok / Copilot
- 
- 使用方式：
- 定时任务 cron: 0 9 * * * ai_check.js, tag=AI解锁检测, enabled=true
- 或手动 [rewrite_local] 触发
  */

const SERVICES = [
{
name: “ChatGPT”,
url: “https://chat.openai.com/cdn-cgi/trace”,
check: (status, body) => {
if (status !== 200) return { ok: false, reason: `HTTP ${status}` };
// loc=XX 表示当前出口国家
const loc = (body.match(/loc=(\w+)/) || [])[1];
const blocked = [“CN”, “KP”, “CU”, “IR”, “RU”, “BY”, “UA”].includes(loc);
return blocked
? { ok: false, reason: `地区受限 (${loc})` }
: { ok: true, reason: loc || “未知地区” };
},
},
{
name: “Claude”,
url: “https://claude.ai/api/auth/session”,
check: (status, body) => {
// 403 = 地区封锁, 200/401 = 可访问
if (status === 403) return { ok: false, reason: “地区封锁 (403)” };
if (status === 200 || status === 401) return { ok: true, reason: `HTTP ${status}` };
return { ok: false, reason: `HTTP ${status}` };
},
},
{
name: “Gemini”,
url: “https://gemini.google.com/”,
check: (status, body) => {
if (status === 200) {
// 页面内包含 “not available” 说明地区受限
const blocked = /not available in your (country|region)/i.test(body);
return blocked
? { ok: false, reason: “地区受限” }
: { ok: true, reason: “可访问” };
}
return { ok: false, reason: `HTTP ${status}` };
},
},
{
name: “Perplexity”,
url: “https://www.perplexity.ai/”,
check: (status, body) => {
if (status === 200) return { ok: true, reason: “可访问” };
if (status === 403) return { ok: false, reason: “地区封锁 (403)” };
return { ok: false, reason: `HTTP ${status}` };
},
},
{
name: “Grok (xAI)”,
url: “https://grok.com/”,
check: (status, body) => {
if (status === 200) return { ok: true, reason: “可访问” };
if (status === 403) return { ok: false, reason: “地区封锁 (403)” };
return { ok: false, reason: `HTTP ${status}` };
},
},
{
name: “Copilot”,
url: “https://copilot.microsoft.com/”,
check: (status, body) => {
if (status === 200) {
const blocked = /not available in your (country|region)/i.test(body);
return blocked
? { ok: false, reason: “地区受限” }
: { ok: true, reason: “可访问” };
}
return { ok: false, reason: `HTTP ${status}` };
},
},
];

// ─── 主逻辑 ───────────────────────────────────────────────────────────────────

const results = [];
let pending = SERVICES.length;

function finish() {
const ok = results.filter((r) => r.ok);
const fail = results.filter((r) => !r.ok);

// 通知标题
const title = `🤖 AI 解锁检测 (${ok.length}/${SERVICES.length})`;

// 通知正文
const lines = results.map((r) => {
const icon = r.ok ? “✅” : “❌”;
return `${icon} ${r.name}  ${r.reason}`;
});
const body = lines.join(”\n”);

// 副标题（概览）
const subtitle =
ok.length === SERVICES.length
? “全部解锁 🎉”
: fail.map((r) => r.name).join(” / “) + “ 受限”;

console.log(`[AI Check] ${title}\n${body}`);
$notify(title, subtitle, body);
$done();
}

function fetchService(svc) {
$task
.fetch({
url: svc.url,
method: “GET”,
headers: {
“User-Agent”:
“Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36”,
Accept: “text/html,application/json,*/*”,
},
timeout: 10,
})
.then((resp) => {
const status = resp.statusCode;
const body = resp.body || “”;
const result = svc.check(status, body);
results.push({ name: svc.name, …result });
})
.catch((err) => {
results.push({
name: svc.name,
ok: false,
reason: “连接失败”,
});
})
.finally(() => {
pending -= 1;
if (pending === 0) finish();
});
}

// 并发请求所有服务
SERVICES.forEach(fetchService);
