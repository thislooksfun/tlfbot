var cmd = require('../cmd');
var perms = ["User", "Mod", "Owner"];
module.exports = [
	{
		name: "perm",
		usage: "!perm [command]",
//		aliases: [],
		perm: 0,
		f: function(args, sender) {
			if (args.length == 1) return "Your permission level is: "+perms[sender.perm];
			var n = (args[1].indexOf("!") == 0 ? args[1].slice(1) : args[1]);
			var c = cmd.cmds[n];
			if (!c) return "Error getting permission: command not found '"+args[1]+"'";
				return "Permission required for '"+n+"' - "+perms[(c.perm ? c.perm : 0)];
		}
	}
];

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}