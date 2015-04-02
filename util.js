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
	logTime: function(msg) {
	    console.log("["+this.getFormattedTime()+"] "+msg);
	},
	months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	getFormattedTime: function() {
	    var d = new Date();
	    return this.months[d.getMonth()]+"/"+d.getDay()+"/"+((""+d.getFullYear()).substring(2,4))+", "+this.ensureZero(d.getHours())+":"+this.ensureZero(d.getMinutes())+":"+this.ensureZero(d.getSeconds());
	},
	ensureZero: function(s) {
	    return ""+(s < 10 ? "0"+s : s)
	},
};