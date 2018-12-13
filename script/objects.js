var _GameObjectID = 0;

class GameObject {
	constructor(goname, type = "generic", proper = false) {
		this.type = type;
		this.goname = goname;
		this.id = _GameObjectID++;
		this.proper = proper;
		this.inventoriable = false;
	}
	get desc() {
		return "A " + type + " called " + goname + ".";
	}
}

class Organism extends GameObject {
	constructor(goname, species) {
		super(goname, "organism");
		this.species = species;
	}
	get desc() {
		return "A " + species + " called " + goname + ".";
	}
}

class Person extends Organism {
	constructor(fullname, bio) {
		super(fullname.replace(/^.*\s/, ""), "human", true);
		this.fullname = fullname;
		this.bio = bio;
	}
	get desc() {
		return this.bio;
	}
}

class GenericPerson extends Organism {
	constructor(goname, bio) {
		super(goname, "human", true);
		this.fullname = goname;
		this.bio = bio;
	}
	get desc() {
		return this.bio;
	}
}


class Container extends GameObject {
	constructor(goname, type = "container") {
		super(goname, type);
		this.contents = [];
	}
}

class GameMap extends Container {
	constructor(goname, bio) {
		super(goname, "map");
		this.bio = bio;
	}
	get desc() {
		return this.bio;
	}
}

class Area extends Container {
	constructor(goname, bio) {
		super(goname, "area");
		this.bio = bio;
		this.impasse = "stone wall";
	}
	get desc() {
		return this.bio;
	}
}

class Building extends Container {
	constructor(goname, bio) {
		super(goname, "building");
		this.bio = bio;
	}
	get desc() {
		return this.bio;
	}
}

class Room extends Container {
	constructor(goname, bio, doors) {
		super(goname, "room");
		this.bio = bio;
		this.doors = doors; // array of room objects corresponding to directions
		                    // 0 = exit, undefined = no door
	}
	get desc() {
		return this.bio;
	}
}

class Religion {
	constructor(value) {
		if (["atheist", "irreligious", "deist", "christian", "catholic", "protestant"].includes(value)){
			this.value = value;
		}
		else {
			this.value = "christian"; // sensible default
		}
	}
	get religious() {
		return value != "atheist" && value != "irreligious";
	}
	get superstitious() {
		return this.religious;
	}
}

var non_action_actions = {
	naa_chuckles: ["*chuckle*", "You chuckle.", "You make a sort of amused half-laugh.", "*smirk*", "You smirk."],
	be: function() {
		return ("Good luck.")
	},
	blink: function() {
		// flash screen
	},
	blush: function() {
		// screen turns pink
	},
	breathe: function() {
		return ("You're already doing that. Did you mean \"smell\"?");
	},
	brush: function(obj = {name: "ground"}) {
		return ("You clean off the " + obj.name + ".");
	},
	chuckle: function() {
		return (this.naa_chuckles[Math.floor(Math.random() * this.naa_chuckles.length)]);
	},
	damn: function(obj = {name: "world"}) {
		if (game.player.religious)
			return ("You curse the " + obj.name + ".");
	},
	dance: function() {
		return "Classy moves you've got there.";
	},
	drink: function() {
		return "This sort of thing is handled automatically by the game. You don't have to explicitly command it.";
	},
	badword: function() {
		return "No.";
	},
	gasp: function() {
		return "Gasp!";
	},
	glare: function() {
		return "No one cares."
	},
	pause: function() {
		return "No need. Just leave and come back later. I'll wait.";
	},
	relax: function() {
		game.setBackground("images/Sunset_2007-1.jpg");
	},
	reset: function() {
		localStorage.clear();
		setLevel(0);
	},
	rest: function() {
		return "You're not sleepy.";
	},
	save: function() {
		return "No need! This game saves automatically.";
	},
}

var synonyms = new Map();
synonyms.set("clean", "brush");
synonyms.set("eat", "drink");
synonyms.set("fuck", "badword");
synonyms.set("giggle", "chuckle");
synonyms.set("grin", "glare");
synonyms.set("groan", "glare");
synonyms.set("ignore", "glare");
synonyms.set("laugh", "chuckle");
synonyms.set("mutter", "glare");
synonyms.set("pee", "drink");
synonyms.set("piss", "drink");
synonyms.set("poop", "drink");
synonyms.set("shit", "drink");
synonyms.set("look", "inspect");
synonyms.set("read", "inspect");
synonyms.set("investigate", "inspect");
synonyms.set("trade", "give");
synonyms.set("open", "inspect");

function path() {
	let paths = [];
	if (level.map.contents[game.player.location[0] + 1][game.player.location[1]]) {
		paths.push("right");
	}
	if (level.map.contents[game.player.location[0]][game.player.location[1] + 1]) {
		paths.push("forward");
	}
	if (level.map.contents[game.player.location[0] - 1][game.player.location[1]]) {
		paths.push("left");
	}
	if (level.map.contents[game.player.location[0]][game.player.location[1] - 1]) {
		paths.push("behind you");
	}
	let pathstring = "";
	if (paths.length == 1) {
		pathstring = "A path leads " + paths[0] + "."
	}
	else if (paths.length != 0) {
		pathstring = "Paths lead " + paths.slice(0, paths.length - 1).join(", ") + ", and " + paths[paths.length - 1] + ".";
	}
	return pathstring;
}
