module.exports = {
	perm: 2,
	f: function(args, sender) {
		require('../botcontrol').stop();
	}
};