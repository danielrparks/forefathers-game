var level = {
	mission: "Learn how to play this game.",
	character: "You",
	map: new Room("Intro room", "the room where you learn how to play.", [undefined, undefined, undefined, undefined]),
	init: async function() {
		game.player.inside = level.map;
		let intro = [];
		intro.push(document.createElement("span"));
		intro[0].style = "display:block; text-align:right; width:100%;";
		intro[0].innerHTML = "-->";
		intro.push(document.createTextNode("This is your inventory. It functions as a list of all items that you have."));
		intro.push(document.createTextNode("The objective of this game is to complete the mission with as much historical accuracy as possible. If you break history, you will have to restart the level."));
		intro.push(document.createElement("span"));
		intro[intro.length - 1].style = "display:block; text-align:right; width:100%;";
		intro[intro.length - 1].innerHTML = "-->";
		intro.push(document.createTextNode("Below the inventory are the settings for this game. You must check the \"Disable Flashing\" box if you have or might have photosensitive epilepsy."));
		intro.push(document.createTextNode("I will now give you a scroll. Type \"read scroll\" to learn how to use commands in this game."));
		await appendEcho("intro", intro);
		let scroll = new GameObject("scroll", "scroll");
		scroll.inspect = () => {return [
			document.createTextNode("This game is controlled by text-based commands. Many natural phrases will work, such as \"Hit Hamiltion with the hammer\", but words like \"the\" will be removed by the game engine. It's possible you'll find it easiest to just type short phrases like \"hit Hamilton with hammer\". Items in your inventory are automatically considered for commands, so if you have a hammer (and Hamilton is within sight), this command will work."),
			document.createElement("br"),
			document.createTextNode("Commands usually follow the form <verb> <subject> (optional <preposition> <object>)."),
			document.createElement("br"),
			document.createTextNode("This scroll has a special command, known as use. Use this scroll to move on to level 1.")
		]};
		scroll.use = () => {
			completeLevel(true);
		}
		game.inventory.add(scroll);
		return true;
	}
}
