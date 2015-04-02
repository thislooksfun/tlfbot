var cmd = require('../cmd');
module.exports = function() {
	return "There are "+cmd.data.chatters+" users online";
};