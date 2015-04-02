module.exports = {
	perm: 1,
	f: function(args, sender) {
		require('../botcontrol').restart();
	}
};