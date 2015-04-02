module.exports = {
	perm: 1,
	f: function(args) {
		require('../loader.js').reload();
	}
}