var cmd = require('../cmd');
module.exports =  [
	{
		name: "users",
		usage: "!users",
//		aliases: [],
		perm: 0,
		f: function() {
			return "There are "+cmd.data.chatters+" users online";
		}
	},
	{
		name: "viewers",
		usage: "!viewers",
//		aliases: [],
		perm: 0,
		f: function() {
			return "There are "+cmd.data.viewers+" people watching right now";
		}
	}
];