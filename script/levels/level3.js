var level = {
	mission: "A violent rebellion against debt is being lead by Daniel Shays in Massachusetts. As general, it is your responsibility to put down the rebellion.",
	character: "James Bowdoin",
	map: new GameMap("massachusetts", "rural Massachusetts."),
	init: async function() {
		let musket = new GameObject("musket", "musket");
		
		game.inventory.add(musket);
		let horse = new GameObject("horse", "horse");
		horse.ride = function () {
			return "... You already are ...";
		}
		game.inventory.add(horse);
		level.map.contents = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0]
		];
		level.map.contents[1][1] = new Area("dirt path", "a dirt path");
		game.player.location = [1, 1];
		game.player.inside = level.map.contents[1][1];
		level.map.contents[1][2] = new Area("dirt path", "a dirt path");
		let jefferson = new Person("Thomas Jefferson", "Thomas Jefferson");
		jefferson.talk = function() {
			return "\"A little rebellion now and then is a good thing. The tree of liberty must be refreshed from time to time with the blood of patriots and tyrants.\"";
		}
		level.map.contents[1][2].contents.push(jefferson);
		level.map.contents[1][3] = new Area("dirt path", "a dirt path");
		level.map.contents[1][3].enter = function() {
			return "There is a crowd of men around a \"liberty pole\" (not the original Liberty Tree; it was in Boston and has been cut down)."
		}
		let crowd = new GameObject("crowd", "crowd");
		crowd.shoot = function(objName) {
			if (objName === undefined) {
				return "Shoot with what?";
			}
			let obj = game.inventory.contents.get(game.inventory.getID(objName));
			if (obj.goname == "musket") {
				return "You miss, but succeed in causing a riot.";
			}
			else return "What?";
		}
		level.map.contents[1][3].contents.push(crowd);
		level.map.contents[1][4] = new Area("Springfield Armory", "the Springfield Armory");
		level.map.contents[1][4].enter = function() {
			return "Your army fires grape shot into Shays's men, wounding several.";
		}
		let shay = new Person("Daniel Shay", "Daniel Shay");
		shay.shoot = function(objName) {
			if (objName === undefined) {
				return "Shoot with what?";
			}
			let obj = game.inventory.contents.get(game.inventory.getID(objName));
			if (obj.goname == "musket") {
				return ["What? You're supposed to arrest him, not kill him! Shoddy work, General!", function() {completeLevel(false)}];
			}
			else return "What?";
		}
		shay.arrest = function() {
			return ["You have successfully ended Shay's Rebellion (simplified version). The violence incited by Shay will be one of the principal reasons for the creation of the constitutional government that we have today, with more power than the Articles.",  "Without it, we may never have been able to recruit enough Federalists.", function() {completeLevel(true)}];
		}
		level.map.contents[1][4].contents.push(shay);
	}
}
