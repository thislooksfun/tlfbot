module.exports = {
	log: function(msg, newline) {
		process.stdout.write("[MSG]: ");
		if (typeof msg != 'string')
			process.stdout.write("\n"+msg);
		else
			process.stdout.write(msg);
		process.stdout.write(newline?"\n\n":"\n");
	},
	err: function(msg, newline) {
		process.stdout.write("[ERR]: ");
		if (typeof msg != 'string')
			process.stdout.write("\n");
		process.stdout.write(msg);
		process.stdout.write(newline?"\n\n":"\n");
	},
};