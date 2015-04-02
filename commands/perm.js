var cmd = require('../cmd');
var perms = ["User", "Mod", "Owner"];
module.exports = function(args) {
	if (args.length == 1) return "Error getting permission: no command specified"
	var n = (args[1].indexOf("!") == 0 ? args[1].slice(1) : args[1]);
	var c = cmd.cmds[n];
	if (!c) return "Error getting permission: command not found '"+args[1]+"'";
	return "Permission for '"+n+"' - "+perms[(c.perm ? c.perm : 0)];
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}