module.exports =  [
	{
		name: "reload",
		usage: "!reload",
//		aliases: [],
		perm: 1,
		f: function(args) {
			require('../loader.js').reload();
		}
	},
	{
		name: "restart",
		usage: "!restart",
//		aliases: [],
		perm: 1,
		f: function(args, sender) {
			require('../botcontrol').restart();
		}
	},
	{
		name: "stop",
		usage: "!stop",
//		aliases: [],
		perm: 3,
		f: function(args, sender) {
			require('../botcontrol').stop();
		}
	}
];