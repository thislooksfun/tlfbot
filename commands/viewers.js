var cmd = require('../cmd');
module.exports = function() {
	return "There are "+cmd.data.viewers+" people watching right now";
};