var cmds = require('../cmd').cmds;
module.exports = [
	{
		name: "help",
		usage: "!help [command]",
//		aliases: [],
		perm: 0,
		f: function(args, sender)
		{
			if (!sender.perm) sender.perm = 0;
			var list = "";
			for (var k in cmds)
				if (cmds.hasOwnProperty(k) && sender.perm >= (cmds[k].perm ? cmds[k].perm : 0))
					list += (list == "" ? "!" : ", !") + k;
			return "Commands: "+list;
		}
	},
];