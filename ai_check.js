/***

- AI 服务解锁检测
- 适用于 QuantumultX
- 参考自 KOP-XIAO/streaming-ui-check.js
- 
- [task_local]
- event-interaction https://raw.githubusercontent.com/mogeng2028/qx-scripts/main/ai_check.js, tag=AI解锁检测, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Global.png, enabled=true
  ***/

const Region_URL_GPT = ‘https://chat.openai.com/cdn-cgi/trace’
const BASE_URL_GPT   = ‘https://chat.openai.com/’
const BASE_URL_CLAUDE  = ‘https://claude.ai/api/auth/session’
const BASE_URL_GEMINI  = ‘https://gemini.google.com/’
const BASE_URL_GROK    = ‘https://grok.com/’

const arrow = “ ➟ “

const UA = ‘Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36’

var opts = { policy: $environment.params }
var opts1 = { policy: $environment.params, redirection: false }

const flags = new Map([[“AC”,“🇦🇨”],[“AE”,“🇦🇪”],[“AF”,“🇦🇫”],[“AL”,“🇦🇱”],[“AM”,“🇦🇲”],[“AR”,“🇦🇷”],[“AT”,“🇦🇹”],[“AU”,“🇦🇺”],[“AZ”,“🇦🇿”],[“BA”,“🇧🇦”],[“BB”,“🇧🇧”],[“BD”,“🇧🇩”],[“BE”,“🇧🇪”],[“BF”,“🇧🇫”],[“BG”,“🇧🇬”],[“BJ”,“🇧🇯”],[“BN”,“🇧🇳”],[“BO”,“🇧🇴”],[“BR”,“🇧🇷”],[“BS”,“🇧🇸”],[“BT”,“🇧🇹”],[“BW”,“🇧🇼”],[“BZ”,“🇧🇿”],[“CA”,“🇨🇦”],[“CH”,“🇨🇭”],[“CL”,“🇨🇱”],[“CM”,“🇨🇲”],[“CN”,“🇨🇳”],[“CO”,“🇨🇴”],[“CR”,“🇨🇷”],[“CV”,“🇨🇻”],[“CY”,“🇨🇾”],[“CZ”,“🇨🇿”],[“DE”,“🇩🇪”],[“DJ”,“🇩🇯”],[“DK”,“🇩🇰”],[“DM”,“🇩🇲”],[“DO”,“🇩🇴”],[“DZ”,“🇩🇿”],[“EC”,“🇪🇨”],[“EE”,“🇪🇪”],[“EG”,“🇪🇬”],[“ES”,“🇪🇸”],[“ET”,“🇪🇹”],[“FI”,“🇫🇮”],[“FJ”,“🇫🇯”],[“FM”,“🇫🇲”],[“FR”,“🇫🇷”],[“GA”,“🇬🇦”],[“GB”,“🇬🇧”],[“GE”,“🇬🇪”],[“GH”,“🇬🇭”],[“GM”,“🇬🇲”],[“GN”,“🇬🇳”],[“GQ”,“🇬🇶”],[“GR”,“🇬🇷”],[“GT”,“🇬🇹”],[“GW”,“🇬🇼”],[“GY”,“🇬🇾”],[“HK”,“🇭🇰”],[“HN”,“🇭🇳”],[“HR”,“🇭🇷”],[“HT”,“🇭🇹”],[“HU”,“🇭🇺”],[“ID”,“🇮🇩”],[“IE”,“🇮🇪”],[“IL”,“🇮🇱”],[“IN”,“🇮🇳”],[“IQ”,“🇮🇶”],[“IS”,“🇮🇸”],[“IT”,“🇮🇹”],[“JM”,“🇯🇲”],[“JO”,“🇯🇴”],[“JP”,“🇯🇵”],[“KE”,“🇰🇪”],[“KG”,“🇰🇬”],[“KI”,“🇰🇮”],[“KM”,“🇰🇲”],[“KR”,“🇰🇷”],[“KW”,“🇰🇼”],[“KZ”,“🇰🇿”],[“LB”,“🇱🇧”],[“LI”,“🇱🇮”],[“LR”,“🇱🇷”],[“LS”,“🇱🇸”],[“LT”,“🇱🇹”],[“LU”,“🇱🇺”],[“LV”,“🇱🇻”],[“MA”,“🇲🇦”],[“MC”,“🇲🇨”],[“MD”,“🇲🇩”],[“ME”,“🇲🇪”],[“MG”,“🇲🇬”],[“MH”,“🇲🇭”],[“MK”,“🇲🇰”],[“ML”,“🇲🇱”],[“MN”,“🇲🇳”],[“MO”,“🇲🇴”],[“MR”,“🇲🇷”],[“MT”,“🇲🇹”],[“MU”,“🇲🇺”],[“MV”,“🇲🇻”],[“MW”,“🇲🇼”],[“MX”,“🇲🇽”],[“MY”,“🇲🇾”],[“MZ”,“🇲🇿”],[“NA”,“🇳🇦”],[“NE”,“🇳🇪”],[“NG”,“🇳🇬”],[“NI”,“🇳🇮”],[“NL”,“🇳🇱”],[“NO”,“🇳🇴”],[“NP”,“🇳🇵”],[“NR”,“🇳🇷”],[“NZ”,“🇳🇿”],[“OM”,“🇴🇲”],[“PA”,“🇵🇦”],[“PE”,“🇵🇪”],[“PG”,“🇵🇬”],[“PH”,“🇵🇭”],[“PK”,“🇵🇰”],[“PL”,“🇵🇱”],[“PS”,“🇵🇸”],[“PT”,“🇵🇹”],[“PW”,“🇵🇼”],[“PY”,“🇵🇾”],[“QA”,“🇶🇦”],[“RO”,“🇷🇴”],[“RS”,“🇷🇸”],[“RU”,“🇷🇺”],[“RW”,“🇷🇼”],[“SA”,“🇸🇦”],[“SB”,“🇸🇧”],[“SC”,“🇸🇨”],[“SE”,“🇸🇪”],[“SG”,“🇸🇬”],[“SI”,“🇸🇮”],[“SK”,“🇸🇰”],[“SL”,“🇸🇱”],[“SM”,“🇸🇲”],[“SN”,“🇸🇳”],[“SR”,“🇸🇷”],[“ST”,“🇸🇹”],[“SV”,“🇸🇻”],[“SZ”,“🇸🇿”],[“TH”,“🇹🇭”],[“TL”,“🇹🇱”],[“TN”,“🇹🇳”],[“TO”,“🇹🇴”],[“TR”,“🇹🇷”],[“TT”,“🇹🇹”],[“TV”,“🇹🇻”],[“TW”,“🇹🇼”],[“TZ”,“🇹🇿”],[“UA”,“🇺🇦”],[“UG”,“🇺🇬”],[“US”,“🇺🇸”],[“UY”,“🇺🇾”],[“UZ”,“🇺🇿”],[“VA”,“🇻🇦”],[“VC”,“🇻🇨”],[“VU”,“🇻🇺”],[“WS”,“🇼🇸”],[“ZA”,“🇿🇦”],[“ZM”,“🇿🇲”]])

const support_countryCodes = [“AL”,“DZ”,“AD”,“AO”,“AG”,“AR”,“AM”,“AU”,“AT”,“AZ”,“BS”,“BD”,“BB”,“BE”,“BZ”,“BJ”,“BT”,“BA”,“BW”,“BR”,“BN”,“BG”,“BF”,“CV”,“CA”,“CL”,“CO”,“KM”,“CG”,“CR”,“HR”,“CY”,“CZ”,“DK”,“DJ”,“DM”,“DO”,“EC”,“EG”,“SV”,“GQ”,“EE”,“SZ”,“ET”,“FJ”,“FI”,“FR”,“GA”,“GM”,“GE”,“DE”,“GH”,“GR”,“GD”,“GT”,“GN”,“GW”,“GY”,“HT”,“HN”,“HU”,“IS”,“IN”,“ID”,“IQ”,“IE”,“IL”,“IT”,“JM”,“JP”,“JO”,“KZ”,“KE”,“KI”,“KW”,“KG”,“LV”,“LB”,“LS”,“LR”,“LI”,“LT”,“LU”,“MG”,“MW”,“MY”,“MV”,“ML”,“MT”,“MH”,“MR”,“MU”,“MX”,“MC”,“MN”,“ME”,“MA”,“MZ”,“NA”,“NR”,“NP”,“NL”,“NZ”,“NI”,“NE”,“NG”,“MK”,“NO”,“OM”,“PK”,“PW”,“PS”,“PA”,“PG”,“PY”,“PE”,“PH”,“PL”,“PT”,“QA”,“RO”,“RW”,“KN”,“LC”,“VC”,“WS”,“SM”,“ST”,“SN”,“RS”,“SC”,“SL”,“SG”,“SK”,“SI”,“SB”,“ZA”,“ES”,“LK”,“SR”,“SE”,“CH”,“TH”,“TG”,“TO”,“TT”,“TN”,“TR”,“TV”,“UG”,“AE”,“US”,“UY”,“VU”,“ZM”,“BO”,“KR”,“TW”,“TZ”,“TL”,“GB”]

let result = {
“title”: “    🤖  AI 服务解锁查询”,
“ChatGPT”: “<b>ChatGPT: </b>检测中… ⏳”,
“Claude”:  “<b>Claude: </b>检测中… ⏳”,
“Gemini”:  “<b>Gemini: </b>检测中… ⏳”,
“Grok”:    “<b>Grok: </b>检测中… ⏳”,
}

const message = {
action: “get_policy_state”,
content: $environment.params
}

function testChatGPT() {
return new Promise((resolve, reject) => {
let option = { url: BASE_URL_GPT, opts, timeout: 2800 }
$task.fetch(option).then(response => {
let resp = JSON.stringify(response)
let jdg = resp.indexOf(“text/plain”)
if (jdg == -1) {
let option1 = { url: Region_URL_GPT, opts1, timeout: 2800 }
$task.fetch(option1).then(response => {
let region = response.body.split(“loc=”)[1].split(”\n”)[0]
let res = support_countryCodes.indexOf(region)
if (res != -1) {
result[“ChatGPT”] = “<b>ChatGPT: </b>支持” + arrow + “⟦” + flags.get(region.toUpperCase()) + “⟧ 🎉”
} else {
result[“ChatGPT”] = “<b>ChatGPT: </b>不支持 🚫”
}
resolve()
}, reason => {
result[“ChatGPT”] = “<b>ChatGPT: </b>检测超时 🚦”
resolve()
})
} else {
result[“ChatGPT”] = “<b>ChatGPT: </b>不支持 🚫”
resolve()
}
}, reason => {
result[“ChatGPT”] = “<b>ChatGPT: </b>检测失败，请重试 ❗️”
resolve()
})
})
}

function testClaude() {
return new Promise((resolve, reject) => {
let option = { url: BASE_URL_CLAUDE, opts1, timeout: 2800 }
$task.fetch(option).then(response => {
let s = response.statusCode
if (s === 200 || s === 401) {
result[“Claude”] = “<b>Claude: </b>支持 🎉”
} else if (s === 403) {
result[“Claude”] = “<b>Claude: </b>不支持 🚫”
} else {
result[“Claude”] = “<b>Claude: </b>不支持 🚫”
}
resolve()
}, reason => {
result[“Claude”] = “<b>Claude: </b>检测失败，请重试 ❗️”
resolve()
})
})
}

function testGemini() {
return new Promise((resolve, reject) => {
let option = { url: BASE_URL_GEMINI, opts1, timeout: 2800 }
$task.fetch(option).then(response => {
let body = response.body || “”
let s = response.statusCode
let blocked = /not available in your (country|region)/i.test(body)
if (s === 200 && !blocked) {
result[“Gemini”] = “<b>Gemini: </b>支持 🎉”
} else {
result[“Gemini”] = “<b>Gemini: </b>不支持 🚫”
}
resolve()
}, reason => {
result[“Gemini”] = “<b>Gemini: </b>检测失败，请重试 ❗️”
resolve()
})
})
}

function testGrok() {
return new Promise((resolve, reject) => {
let option = { url: BASE_URL_GROK, opts1, timeout: 2800 }
$task.fetch(option).then(response => {
let s = response.statusCode
if (s === 200) {
result[“Grok”] = “<b>Grok: </b>支持 🎉”
} else {
result[“Grok”] = “<b>Grok: </b>不支持 🚫”
}
resolve()
}, reason => {
result[“Grok”] = “<b>Grok: </b>检测失败，请重试 ❗️”
resolve()
})
})
}

;(async () => {
await Promise.all([testChatGPT(), testClaude(), testGemini(), testGrok()])

$configuration.sendMessage(message).then(resolve => {
if (resolve.error) {
console.log(resolve.error)
$done()
}
if (resolve.ret) {
let output = JSON.stringify(resolve.ret[message.content])
? JSON.stringify(resolve.ret[message.content]).replace(/"|[|]/g, “”).replace(/,/g, “ ➟ “)
: $environment.params
let content = “–––––––––––––––––––</br>”
+ ([result[“ChatGPT”], result[“Claude”], result[“Gemini”], result[“Grok”]]).join(”</br></br>”)
+ “</br>–––––––––––––––––––</br>”
+ “<font color=#CD5C5C><b>节点</b> ➟ “ + output + “</font>”
content = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + content + `</p>`
$done({ “title”: result[“title”], “htmlMessage”: content })
}
}, reject => {
$done()
})
})()
