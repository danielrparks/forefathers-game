var level = {
	mission: "Locate an Indian tribe, trade goods with them, and return to Spain",
	character: "Spanish explorer",
	map: new GameMap("Prairie", "a long, sprawling, American prairie."),
	init: async function() {
		let mapContents = [
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0]
		]
		let goods = new GameObject("goods", "goods");
		game.inventory.add(goods);
		game.player.location = [3, 2];
		mapContents[3][2] = new Area("thicket1", "a thicket");
		game.player.inside = mapContents[3][2];
		mapContents[4][2] = new Area("thicket2", "a thicket");
		mapContents[4][3] = new Area("thicket3", "a thicket");
		mapContents[4][4] = new Area("trade", "trade");
		mapContents[4][6] = new Area("ship", "ship");
		let indian = new GenericPerson("an Indian", "an Indian");
		mapContents[4][4].contents.push(indian);
		indian.talk = function() {
			return "You can't understand one another.";
		}
		indian.give = function(obj) {
			if (obj === undefined) {
				return "Give what to Indian?";
			}
			else {
				game.inventory.remove(game.inventory.getID(obj));
				level.map.contents[4][5] = level.hidden[0];
				return "You must now locate your ship.";
			}
		}
		mapContents[4][6].enter = function() {
			level.map.contents[4][5] = 0;
			game.player.location = [3, 2];
			game.player.inside = level.map.contents[3][2];
			level.map.contents[4][4] = level.hidden[1];
			return [
				"You are now travelling back to Spain.",
				500,
				".",
				500,
				".",
				"The king requests that you pursue a new mission: locate the tribe and attempt to spread Christianity to these savages.",
				"You are now travelling back to America.",
				500,
				".",
				500,
				"."
			];
		}
		level.hidden[1].enter = function() {
			let h = document.createElement("h1");
			h.innerText = "Level Failed!";
			return ["There are no Indians here. They died not too long ago of the Stranger's Cough. The settlement still bears resemblance to its former glory; half-erected teepees remain. But there is no one here except you and the breeze.", h, function() {
				completeLevel(true);
			}];
		}
		level.map.contents = mapContents;
	},
	hidden: [new Area("thicket4", "thicket"), new Area("trade2", "a deserted settlement")]
}
