document.addEventListener("DOMContentLoaded", () => {
	// 自定义UA输入框交互
	const customUaRadio = document.getElementById('customUaRadio');
	const customUaInput = document.getElementById('customUaInput');
	
	customUaRadio.addEventListener('change', () => {
		customUaInput.disabled = !customUaRadio.checked;
		if (customUaRadio.checked) {
			customUaInput.focus();
		}
	});
	
	// 所有radio的change事件，用于取消自定义选中状态
	document.querySelectorAll('input[name="ua"]:not(#customUaRadio)').forEach(radio => {
		radio.addEventListener('change', () => {
			customUaInput.disabled = true;
		});
	});
});

document.addEventListener("click", (e) => {
	if (!e.target.classList.contains("save")) {
		return;
	}
	
	const fd = new FormData(document.querySelector('form'));
	let ua = fd.get("ua");
	let domain = "all";
	
	// 处理自定义UA
	if (ua === "custom") {
		const customUa = document.getElementById('customUaInput').value.trim();
		if (!customUa) {
			alert("请输入自定义User-Agent");
			return;
		}
		ua = `custom:${customUa}`; // 使用前缀标识自定义UA
	}
	
	if (["btnResetThisDomain", "btnSaveThisDomain"].includes(e.target.id)) {
		domain = fd.get("current_domain");
	}
	
	if (["btnSaveAll", "btnSaveThisDomain"].includes(e.target.id)) {
		backgroundPage.addMapping(domain, ua);
	} else if (["btnResetAll", "btnResetThisDomain"].includes(e.target.id)) {
		backgroundPage.deleteMapping(domain);
	}
	
	// 保存后刷新显示并关闭弹窗
	displayUIDetails();
	setTimeout(() => window.close(), 500);
});

function getCurrentPage(callback) {
	browser.tabs.query({ active: true, currentWindow: true }).then((tabInfo) => {
		callback(tabInfo[0].url, tabInfo[0]);
	});
}

function displayUIDetails() {
	getCurrentPage((url, tabInfo) => {
		const domain = backgroundPage.getDomainFromUrl(url);
		const ua_domain = backgroundPage.getReadableUAforDomain(domain);
		const ua_all = backgroundPage.getReadableUAforAll();

		// 显示当前UA信息，处理自定义UA
		document.querySelector("#current_ua").innerText = formatUA(ua_all);
		document.querySelector("#current_ua_this_domain").innerText = formatUA(ua_domain);
		
		if (ua_all) document.querySelector(".ua_details.all").classList.remove("hide");
		if (ua_domain) document.querySelector(".ua_details.domain").classList.remove("hide");
		document.querySelector("input.current_domain").value = domain;
		
		// 选中当前生效的UA选项
		setSelectedUA(ua_domain || ua_all);
	});
}

// 格式化UA显示文本
function formatUA(ua) {
	if (!ua) return "未设置";
	if (ua.startsWith('custom:')) {
		return `自定义: ${ua.slice(7).substring(0, 30)}...`;
	}
	return ua;
}

// 设置选中的UA选项
function setSelectedUA(ua) {
	document.querySelectorAll('input[name="ua"]').forEach(radio => {
		radio.checked = false;
	});
	
	if (!ua) {
		document.querySelector('input[name="ua"][value="Default"]').checked = true;
		return;
	}
	
	if (ua.startsWith('custom:')) {
		document.getElementById('customUaRadio').checked = true;
		document.getElementById('customUaInput').value = ua.slice(7);
		document.getElementById('customUaInput').disabled = false;
	} else {
		const radio = document.querySelector(`input[name="ua"][value="${ua}"]`);
		if (radio) radio.checked = true;
	}
}

const backgroundPage = browser.extension.getBackgroundPage();
displayUIDetails();
