var photoSensitiveEpilepsy = false;

var levels = ["Introduction", "Before", "Boston", "Shays's Rebellion", "Game Complete!"];
var curLevel;

function setLevel(levelNum) {
	window.location.hash = "#level" + levelNum;
	window.location.reload(true);
}

async function completeLevel(won) {
	var h1 = document.createElement("h1");
	if (won) {
		h1.innerText = "Level complete!"
		await appendEcho(undefined, h1);
		await wait(4000);
		setLevel(curLevel + 1);
	}
	else {
		h1.innerText = "Level failed!"
		await appendEcho(undefined, h1);
		await wait(4000);
		setLevel(curLevel);
	}
}

if (window.location.hash.match(/^#level\d+$/) != null) {
	curLevel = parseInt(window.location.hash.match(/^#level(\d+)$/)[1]);
	if (curLevel == 0) {
		alert("Press OK to begin.");
	}
}
else {
	setLevel(0);
}

if (curLevel !== undefined) {
	let levelScript = document.createElement("script");
	levelScript.addEventListener("load", levelInit);
	levelScript.src = "script/levels/level" + curLevel + ".js";
	document.body.appendChild(levelScript);
}

var echoElement = document.querySelector(".command .echo");
async function appendEcho(command, response) {
	let entryElement = document.createElement("div");
	entryElement.classList.add("entry");
	let responseElement = document.createElement("div");
	responseElement.classList.add("response");
	if (command !== undefined) {
		let commandElement = document.createElement("div");
		commandElement.classList.add("command");
		if (typeof(command) != "string") {
			commandElement.innerHTML = command.outerHTML;
		}
		else {
			commandElement.innerHTML = command;
		}
		entryElement.appendChild(commandElement);
	}
	entryElement.appendChild(responseElement);
	let wasScrolledToBottom = isScrolledToBottom(echoElement);
	echoElement.appendChild(entryElement);
	if (wasScrolledToBottom && ! isScrolledToBottom(echoElement)) {
		echoElement.scroll(0, echoElement.scrollHeight - echoElement.offsetHeight);
	}
	await typeHtmlOrText(responseElement, response, echoElement);
	return;
}

var ignoredWords = ["\\bthe\\b", "\\ba\\b", "\\ban\\b", "\\binto\\b", "\\bthrough\\b", "\\n"];
var ignoredWordsRegex = new RegExp(ignoredWords.join("|"), 'g');
var prepositions = ["with", "using", "to", "toward", "towards"];
function isPrep(word) {
	for (let i of prepositions) {
		if (i == word) return true;
	}
	return false;
}

function processCommand(evt) {
	if (evt.key == "Enter" && ! evt.shiftKey) {
		evt.preventDefault();
		let command = evt.srcElement.innerText.toLowerCase().replace("go into", "enter").replace(ignoredWordsRegex, "").split(" ");
		evt.srcElement.innerHTML = "";
		let verb = command[0];
		let arg1 = undefined;
		let arg2 = undefined;
		if (synonyms.get(verb) !== undefined) {
			verb = synonyms.get(verb);
		}
		if (command.length == 1 ){
			// do nothing
		}
		else if (command.length == 2) {
			arg1 = command[1];
		}
		else if (command.length == 3 && isPrep(command[1])) {
			arg1 = command[2];
		}
		else if (command.length == 4 && isPrep(command[2])) {
			arg1 = command[1];
			arg2 = command[3];
		}
		else {
			appendEcho(coloredText("pink", command.join(" ")), "Sorry, I don't understand the structure of that command.");
			return;
		}
		if (verb in non_action_actions && typeof(non_action_actions[verb] == "function")) {
			appendEcho(command.join(" "), non_action_actions[verb]());
		}
		else if (searchObjects(game.inventory.contents.values(), arg1, verb)) {
			appendEcho(command.join(" "), searchObjects(game.inventory.contents.values(), arg1, verb)[verb](arg2));
		}
		else if (verb in game.player) {
			appendEcho(command.join(" "), game.player[verb](arg1, arg2));
		}
		else if (searchObjects(game.player.inside.contents, arg1, verb)) {
			appendEcho(command.join(" "), searchObjects(game.player.inside.contents, arg1, verb)[verb](arg2));
		}
		else if (verb in game.player.inside) {
			appendEcho(command.join(" "), game.player.inside[verb](arg1, arg2));
		}
		else if (arg2 !== undefined && searchObjects(game.player.inside.contents, arg2, verb)) {
			appendEcho(command.join(" "), searchObjects(game.player.inside.contents, arg2, verb)[verb](arg1));
		}
		else {
			suggestCommand(verb, command.join(" "));
		}
	}
}

function searchObjects(objArr, objName, command) {
	if (objArr === undefined) return undefined;
	for (let i of objArr) {
		if ((objName === undefined || i.goname.toLowerCase().indexOf(objName.toLowerCase()) != -1) && (command === undefined || command in i)) {
			return i;
		}
	}
	return undefined;
}

async function suggestCommand(command, orig) { // TODO! BUGGY!
	let result = "Sorry. I have no clue.";
	let res = await fetch("https://api.datamuse.com/words?ml=" + command + "&md=p");
	let words = await res.json();
	if (words.length == 0) {
		result = "That's not a word.";
	}
	for (let i of words) {
		if (i.tags.includes("v") && (searchObjects(game.inventory.contents.values(), undefined, i.word) || searchObjects(game.player.inside.contents, undefined, i.word) || i.word in game.player || i.word in game.player.inside || i.word in non_action_actions)) {
			result = "I don't know that word. Perhaps you meant \"" + i.word + "\"?";
		}
	}
	appendEcho(coloredText("pink", orig), result);
}

var fakeEvt = {
	key: "Enter",
	shiftKey: false,
	preventDefault: function() {return true;}
}

document.querySelector(".game .command.window .line").addEventListener("keydown", processCommand);

var game = {
	setBackground: function(url) {
		document.querySelector(".game").styles.background = "url(" + url + ")";
	},
	inventory: {
		contents: new Map(),
		remove: function(id) {
			this.contents.delete(id);
			let invElement = document.getElementById(id);
			if (invElement.dataset.parent) {
				document.getElementById(invElement.dataset.parent).dataset.quantity--;
			}
			invElement.outerHTML = "";
		},
		add: function(gameObj) {
			if (this.contents.get(gameObj.id) !== undefined) return;
			this.contents.set(gameObj.id, gameObj);
			let invElement = document.createElement("div");
			let parent = document.querySelector(".ff_n_" + gameObj.goname + ":not(.another)");
			if (parent != null) {
				invElement.classList.add("another");
				invElement.dataset.parent = parent.id;
				parent.dataset.quantity++;
			}
			else {
				invElement.dataset.quantity = 1;
			}
			invElement.classList.add("object", "ff_t_" + gameObj.type, "ff_n_" + gameObj.goname);
			invElement.id = gameObj.id;
			invElement.innerText = gameObj.goname;
			document.querySelector(".inventory.window").appendChild(invElement);
		},
		getID: function (string) {
			let node = document.querySelector(".another.ff_n_" + string) || document.querySelector(".another.ff_t_" + string) || document.querySelector(".ff_n_" + string) || document.querySelector(".ff_t_" + string);
			if (node != null) {
				return parseInt(node.id);
			}
			else return null;
		},
		getObj: function(id) {
			return this.contents.get(id);
		}
	},
	player: {
		orientation: 1, // degrees / 90
		location: [0, 0],
		inside: {},
		go: function (direction) {
			if (game.player.cantgo) {
				return game.player.cantgo;
			}
			var successfulMove = false;
			switch (direction) {
				case "forward":
				case "forwards":
				case "north":
				case "up":
					direction = 1;
					break;
				case "backward":
				case "backwards":
				case "south":
				case "down":
					direction = 3;
					break;
				case "left":
				case "west":
					direction = 2;
					break;
				case "east":
				case "right":
					direction = 0;
					break;
			}
			if (direction == 0) {
				if (level.map.contents[game.player.location[0] + 1][game.player.location[1]]) {
					game.player.inside = level.map.contents[game.player.location[0] + 1][game.player.location[1]];
					successfulMove = true;
					game.player.location[0]++;
				}
			}
			else if (direction == 1) {
				if (level.map.contents[game.player.location[0]][game.player.location[1] + 1]) {
					game.player.inside = level.map.contents[game.player.location[0]][game.player.location[1] + 1];
					successfulMove = true;
					game.player.location[1]++;
				}
			}
			else if (direction == 2) {
				if (level.map.contents[game.player.location[0] - 1][game.player.location[1]]) {
					game.player.inside = level.map.contents[game.player.location[0] - 1][game.player.location[1]];
					successfulMove = true;
					game.player.location[0]--;
				}
			}
			else if (direction == 3) {
				if (level.map.contents[game.player.location[0]][game.player.location[1] - 1]) {
					game.player.inside = level.map.contents[game.player.location[0]][game.player.location[1] - 1];
					successfulMove = true;
					game.player.location[1]--;
				}
			}
			else {
				return "That's not a direction.";
			}
			if (successfulMove) {
				let additionalDesc = "";
				if ("enter" in game.player.inside) {
					additionalDesc = game.player.inside.enter();
				}
				return [additionalDesc, "You are now in " + getSurroundingsDescription()];
			}
			else return "You can't go that way.";
		},
		cantgo: ""
	}
}

function getSurroundingsDescription() {
	let additionalDesc = "";
	if ("contents" in game.player.inside && game.player.inside.contents.length > 1) {
		additionalDesc += " Inside is "
		for (let i = 0; i < game.player.inside.contents.length - 1; i++) {
			additionalDesc += (game.player.inside.contents[i].proper ? "a " : "") + game.player.inside.contents[i].goname + ", ";
		}
		additionalDesc += "and " + (game.player.inside.contents[i].proper ? "a " : "") + game.player.inside.contents[i].goname;
	}
	else if ("contents" in game.player.inside && game.player.inside.contents.length == 1) {
		additionalDesc += " Inside is " + (game.player.inside.contents[0].proper ? "a " : "") + game.player.inside.contents[0].goname;
	}
	return game.player.inside.desc + ". " + path() + " " + additionalDesc;
}

function levelDesc() {
	appendEcho(undefined, "You are in " + level.map.desc + " You are currently in " + getSurroundingsDescription());
}

function levelInit() {
	var levelHeader = document.createElement("h3");
	levelHeader.innerText = "Level " + curLevel + ": " + levels[curLevel];
	var levelDesc = [
		document.createTextNode("Mission: " + level.mission),
		document.createElement("br"),
		document.createTextNode("Character: " + level.character)
	];
	appendEcho(undefined, [levelHeader, levelDesc]).then(level.init).then(window.levelDesc);
	// appendEcho(undefined, [levelHeader, levelDesc]).then(level.init).then(function() {window.levelDesc()});
}
