"use strict";

const uaStrings = {
	"Default": "",
	"Chrome": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
	"IE 11": "Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0;  rv:11.0) like Gecko",
	"IE 9": "Mozilla/5.0 (MSIE 9.0; Windows NT 6.1; Trident/5.0)",
	"Epiphany": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15",
	"FreeBSD": "Mozilla/5.0 (X11; FreeBSD amd64; rv:142.0) Gecko/20100101 Firefox/142.0",
	"iPhoneChrome": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/83.0.4103.88 Mobile/15E148 Safari/604.1",
	"iPhoneSafari": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/9.1 Mobile/15E148 Safari/605.1.15",
	"AndroidXiaoMi": "Mozilla/5.0 (Linux; U; Android 14; zh-cn; M2012K11C Build/UKQ1.231207.002) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.119 Mobile Safari/537.36 XiaoMi/MiuiBrowser/18.8.71212",
	"iPad": "Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25",
	"QQ": "Mozilla/5.0 (Linux; Android 15; 2211133C Build/AQ3A.240912.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/121.0.6167.71 MQQBrowser/6.2 TBS/047501 Mobile Safari/537.36 V1_AND_SQ_9.1.31_8542_YYB_D QQ/9.1.31.22255 NetType/WIFI WebP/0.3.0 AppId/537262720 Pixel/1080 StatusBarHeight/104 SimpleUISwitch/0 QQTheme/1000 StudyMode/0 CurrentMode/0 CurrentFontScale/1.0 GlobalDensityScale/0.9818182 AllowLandscape/false InMagicWin/0",
	"WeChat": "Mozilla/5.0 (Linux; Android 13; 23049RAD8C Build/TKQ1.221114.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160083 MMWEBSDK/20230303 MMWEBID/4466 MicroMessenger/8.0.34.2340(0x2800225F) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64",
	"VidaaTV": "Dalvik/2.1.0 (Linux; U; Android 5.1.1; VIDAA_TV Build/LVY48C)",
	"BYD": "Dalvik/2.1.0 (Linux; U; Android 10; DiLink3.0 For BYD AUTO Build/QKQ1.210910.001)",
	"Tieba": "UCWEB/2.0 (MIDP-2.0; U; Adr 9.0.0) UCBrowser U2/1.0.0 Gecko/63.0 Firefox/63.0 iPhone/7.1 SearchCraft/2.8.2 BingWeb/9.1 ALiSearchApp/2.4 T7/13.7 SP-engine/2.45.0 baiduboxapp/13.7.0.12 (Baidu; P1 9) NABar/1.0 dumedia/7.35.61.17",
	"easysearch": "Mozilla/5.0 (Linux; Android 7.0; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/48.0.2564.116 Mobile Safari/537.36 T7/10.3 SearchCraft/2.6.2 (Baidu; P1 7.0)",
	"BaiduSpider": "Mozilla/5.0 (compatible; Baiduspider-render/2.0; +http://www.baidu.com/search/spider.html)",
	"GoogleSpider": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
	"BingSpider": "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
	"YahooSpider": "Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)",
	"curl": "curl/8.9.1",
	"censys": "Mozilla/5.0 (compatible; CensysInspect/1.1; +https://about.censys.io/)",
	"UptimeRobot": "Mozilla/5.0 (compatible; UptimeRobot/2.0; http://www.uptimerobot.com/)",
	"Apachehttpclient": "Apache-HttpClient/4.5.14 (Java/21.0.6)",
	"Gohttpclient": "Go-http-client/2.0",
	"AhrefsBot": "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)",
};

let uaMapping = {};

// 修改获取UA的方法，支持自定义UA
function getUAforDomain(domain) {
	const uaReadable = getReadableUAforDomain(domain);
	if (uaReadable && uaReadable.startsWith('custom:')) {
		return uaReadable.slice(7); // 提取自定义UA内容
	}
	return uaStrings[uaReadable] || "";
}

function getReadableUAforAll() {
	return getReadableUAforDomain("all");
}

function getReadableUAforDomain(domain) {
	return uaMapping[domain] || "";
}

function getUAforAll() {
	return getUAforDomain("all");
}

function deleteMapping(domain) {
	delete uaMapping[domain];
	saveMappings();
}

function addMapping(domain, uaReadable) {
	uaMapping[domain] = uaReadable;
	saveMappings();
}

function saveMappings() {
	browser.storage.local.set({ 'mappings': JSON.stringify(uaMapping) });
}

function loadMappings() {
	let storageItem = browser.storage.local.get('mappings');
	storageItem.then((res) => {
		try {
			uaMapping = JSON.parse(res.mappings) || {};
		}
		catch (errTry) {
			uaMapping = {};
		}
	});
}

function getDomainFromUrl(url) {
	try {
		return new URL(url).host;
	} catch (e) {
		return "";
	}
}

function rewriteUserAgentHeader(e) {
	const domain = getDomainFromUrl(e.url);
	const ua_for_all = getUAforAll();
	const ua_for_domain = getUAforDomain(domain);
	const ua_to_use = ua_for_domain || ua_for_all;
	
	if (ua_to_use) {
		for (var header of e.requestHeaders) {
			if (header.name.toLowerCase() === "user-agent") {
				header.value = ua_to_use;
			}
		}
	}
	return { requestHeaders: e.requestHeaders };
}

browser.webRequest.onBeforeSendHeaders.addListener(
	rewriteUserAgentHeader,
	{ urls: ["<all_urls>"] },
	["blocking", "requestHeaders"]
);

loadMappings();
