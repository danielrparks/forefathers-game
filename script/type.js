var charPerSec = 10;

function isScrolledToBottom(element) {
	return element.scrollTop >= (element.scrollHeight - element.offsetHeight)
}

async function typeHtmlOrText(htmlElement, htmlOrText, scrollElement = document.createElement("br")) {
	let node;
	if (typeof(htmlOrText) == "string") {
		node = document.createTextNode(htmlOrText);
	}
	else if (typeof(htmlOrText) == "function") {
		await htmlOrText();
		return;
	}
	else if (typeof(htmlOrText) == "number") {
		// wait time in milliseconds
		await wait(htmlOrText);
		return;
	}
	else if (Array.isArray(htmlOrText)) {
		// special case for arrays
		for (let node of htmlOrText) {
			await typeHtmlOrText(htmlElement, node, scrollElement);
		}
		return;
	}
	else {
		node = htmlOrText;
	}
 	if ("nodeName" in node && node.nodeName == "#text") {
		// plain text
		let nodeText = node.nodeValue;
		node.nodeValue = "";
		let wasScrolledToBottom = isScrolledToBottom(scrollElement);
		htmlElement.appendChild(node);
		if (wasScrolledToBottom && ! isScrolledToBottom(scrollElement)) {
			scrollElement.scroll(0, scrollElement.scrollHeight - scrollElement.offsetHeight);
		}
		for (let i of nodeText) {
			wasScrolledToBottom = isScrolledToBottom(scrollElement);
			node.nodeValue += i;
			if (wasScrolledToBottom && ! isScrolledToBottom(scrollElement)) {
				scrollElement.scroll(0, scrollElement.scrollHeight - scrollElement.offsetHeight);
			}
			await wait(1000 / charPerSec);
		}
		wasScrolledToBottom = isScrolledToBottom(scrollElement);
		htmlElement.appendChild(document.createElement("spacer"));
		if (wasScrolledToBottom && ! isScrolledToBottom(scrollElement)) {
			scrollElement.scroll(0, scrollElement.scrollHeight - scrollElement.offsetHeight);
		}
	}
	else if (node.childNodes.length == 0) {
		// character element, like <br>
		let wasScrolledToBottom = isScrolledToBottom(scrollElement);
		htmlElement.appendChild(node);
		if (wasScrolledToBottom && ! isScrolledToBottom(scrollElement)) {
			scrollElement.scroll(0, scrollElement.scrollHeight - scrollElement.offsetHeight);
		}
		await wait(1000 / charPerSec);
	}
	else {
		// complex element with children
		let stolenChildren = Array.from(node.childNodes);
		node.innerHTML = "";
		let wasScrolledToBottom = isScrolledToBottom(scrollElement);
		htmlElement.appendChild(node);
		if (wasScrolledToBottom && ! isScrolledToBottom(scrollElement)) {
			scrollElement.scroll(0, scrollElement.scrollHeight - scrollElement.offsetHeight);
		}
		for (let i of stolenChildren) {
			await typeHtmlOrText(node, i, scrollElement);
		}
	}
}

function textToArrayOfNodes(text) {
	var converter = document.createElement("div");
	converter.innerHTML = text;
	return Array.from(converter.childNodes);
}

function coloredText(color, text) {
	let result = document.createElement("span");
	result.style.color = color;
	result.innerText = text;
	return result;
}
