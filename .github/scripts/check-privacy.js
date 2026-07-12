const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../..");

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function main() {
  const privacyUrl = "https://riverye.com/privacy.html";
  const dashboardUrl = "https://appliance.riverye.com/";
  const adsTxt = "google.com, pub-4799252410303973, DIRECT, f08c47fec0942fa0";

  assert(fs.existsSync(path.join(root, "privacy.html")), "privacy.html is missing");
  const privacy = read("privacy.html");
  const index = read("index.html");
  const sitemap = read("sitemap.xml");

  for (const snippet of [
    "<title>隱私權政策｜River-Ye</title>",
    "riverye.com 及其所屬子網域",
    "廣告 Cookie",
    "裝置識別資訊",
    "個人化廣告",
    "非個人化廣告",
    "受限廣告",
    "Google 與其廣告合作夥伴",
    "撤回或調整同意",
    "部分 Blog 頁面仍含既有 Google Analytics",
    "家電推薦比較工作台不使用 Google Analytics",
    'href="https://policies.google.com/privacy?hl=zh-TW"',
    'href="https://business.safety.google/privacy/"',
    'href="https://myadcenter.google.com/"',
    'href="mailto:river@riverye.com"',
    `href="${dashboardUrl}"`,
  ]) {
    assert(privacy.includes(snippet), `privacy.html is missing: ${snippet}`);
  }

  assert(index.includes('<a href="/privacy.html">隱私權政策</a>'), "homepage privacy link is missing");
  assert(sitemap.includes(`<loc>${privacyUrl}</loc>`), "sitemap privacy URL is missing");
  assert(read("ads.txt").trim() === adsTxt, "ads.txt should remain unchanged and authorized");

  console.log("privacy contract check passed");
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
