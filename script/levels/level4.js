var level = {
	mission: "Nothing. I just didn't feel like removing this from the code because it'd be pretty cumbersome.",
	character: "Also not important.",
	map: new GameMap("End", "the ending screen."),
	init: async function() {
		appendEcho(undefined, ["Thanks for playing my game! I hope you enjoyed it! If you havve any suggestions for me about how I could improve it, I'd love to hear them, since I'd probably do something similar in the future.", document.createElement("br"), document.createElement("br"), "The command \"reset\" will reset the game for the next person."]);
	}
}
