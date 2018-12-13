function unsupportedDialog(html) {
	if (window.stop !== undefined) {
		window.stop();
	}
	document.body.innerHTML = "";
	let modal = document.createElement("div");
	let modal2 = document.createElement("div");
	modal.classList.add("modal", "outer");
	modal2.classList.add("modal", "inner");
	modal2.innerHTML = html;
	modal.appendChild(modal2);
	document.body.appendChild(modal);
}

// bowser = bowser.detect("Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1");

if (bowser.mobile || bowser.tablet) {
	unsupportedDialog("Sorry, mobile devices are not supported!");
}
else if (bowser.isUnsupportedBrowser(
	{"chrome": "55", "firefox": "52"}, true, window.navigator.userAgent
)) {
	unsupportedDialog("Sorry, only the following browsers are supported:<br><ul><li>Google Chrome 55+</li><li>Mozilla Firefox 52+</li></ul>");
}
