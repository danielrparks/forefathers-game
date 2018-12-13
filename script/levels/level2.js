var level = {
	mission: "Deliver a letter (confidential - no peeking!) to your associate at his home",
	character: "Crispus Attucks",
	map: new GameMap("Boston", "the large, busy city of Boston."),
	init: async function() {
		let letter = new GameObject("letter", "letter");
		letter.inspect = function() {
			return "It appears to be a letter regarding the recent British acquisition of overseas colonies that produce tea. If the author is correct, the British are planning to tax the purchase of tea in the colonies — this would be a disaster!\nYou shouldn't have read that, now should you? Move along, now, and deliver it like nothing ever happened.";
		}
		game.inventory.add(letter);
		let money1 = new GameObject("paper_money", "badmoney");
		let money2 = new GameObject("paper_money", "badmoney");
		let money3 = new GameObject("paper_money", "badmoney");
		let pig = new GameObject("pig", "pig");
		game.inventory.add(money1);
		game.inventory.add(money2);
		game.inventory.add(money3);
		game.inventory.add(pig);
		level.map.contents = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];
		level.map.contents[8][4] = new Area("street", "a street");
		game.player.location = [8, 4];
		game.player.inside = level.map.contents[8][4];
		level.map.contents[7][4] = new Area("street", "a street");
		level.map.contents[7][4].enter = function() {
			game.player.cantgo = "You're trapped in the crowd.";
			window.setTimeout(level.hidden[0], 10000);
			return "You've stumbled into a crowd of men throwing rocks and snow at soldiers. It seemed in jest at first, but the situation seems to be getting pretty heated. You'd best get out of here.";
		}
		level.map.contents[8][5] = new Area("street", "a street");
		level.map.contents[8][6] = new Area("street", "a street");
		level.map.contents[7][6] = new Area("street", "a street");
		let taxCollector = new GenericPerson("a tax_collector", "a tax_collector");
		taxCollector.give = function(objName) {
			if (objName === undefined) {
				return "Give what to tac_collector?";
			}

			let obj = game.inventory.contents.get(game.inventory.getID(objName));
			game.inventory.remove(obj.id);
			if (obj.type == "badmoney") {
				return "The tax_collector will only accept specie as payment.";
			}
			else if (obj.type == "pig") {
				return ["The tax_collector looks at you as if you just handed him a pig.\nThen he arrests you.", function() {completeLevel(false)}];
			}
			else if (obj.goname == "letter") {
				return ["The tax_collector opens the letter and reads it.", function() {completeLevel(false)}];
			}
			else {
				return "The tax_collector demands payment.";
			}
		}
		level.map.contents[8][6].contents.push(taxCollector);
		level.map.contents[8][6].enter = function() {
			game.player.cantgo = "The tax_collector demands payment first.";
			return "";
		}
		level.map.contents[7][5] = new Area("street", "a street");
		level.map.contents[7][5].enter = function() {
			return "Behind you, a carriage drags a tarred-and-feathered tax_collector across the street.";
		}
		let house = new GameObject("your associate's house", "a house");
		house.enter = function() {
			return "It turns out his house is occupied by soldiers stationed in person. You'll have to keep looking for him.";
		}
		level.map.contents[7][5].contents.push(house);
		level.map.contents[6][5] = new Area("street", "a street");
		let associate = new GenericPerson("your associate", "associate");
		associate.give = function(objName) {
			if (objName === undefined) {
				return "Give what to associate?";
			}
			let obj = game.inventory.contents.get(game.inventory.getID(objName));
			game.inventory.remove(obj.id);
			if (obj.goname == "letter") {
				completeLevel(true);
			}
			else {
				return "He doesn't want, or need, that.";
			}
		}
		level.map.contents[6][5].contents.push(associate);
	},
	hidden: [
		function() {
			appendEcho(undefined, "The soldiers have opened fire. You have been shot. You aren't dead yet, but you'll die soon enough.").then(function() {
				completeLevel(false);
			})
		}
	]
}
