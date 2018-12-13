function setSetting() {
	if (this.type != "checkbox") {
		window[this.id] = this.value;
		localStorage.setItem("forefathers" + this.id, this.value);
	}
	else {
		window[this.id] = this.checked;
		localStorage.setItem("forefathers" + this.id, this.checked);
	}
}

var settings = ["charPerSec", "photoSensitiveEpilepsy"];

for (let i of settings) {
	let node = document.querySelector("input#" + i);
	node.addEventListener("change", setSetting);
	if (node.type != "checkbox") {
		document.querySelector("input#" + i).value = localStorage.getItem("forefathers" + i);
		window[i] = localStorage.getItem("forefathers" + i);
	}
	else {
		document.querySelector("input#" + i).checked = localStorage.getItem("forefathers" + i) == "true";
		window[i] = localStorage.getItem("forefathers" + i) == "true";
	}
}
