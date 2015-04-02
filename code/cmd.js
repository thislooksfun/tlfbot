var cmds = {
  help: function(sender, cmd) { 
      var list = "";
      for (var k in cmds)
        if (cmds.hasOwnProperty(k))
          list += (list == "" ? "!" : ", !") + k;
      return "Commands: "+list;
    },
  hi: function(sender, cmd) { return "Hello" },
  users: function(sender, cmd) { return "There are "+main.data.chatters+" users online" },
  viewers: function(sender, cmd) { return "There are "+main.data.viewers+" people watching right now" },
};

var main = {
  parsecmd: function(cmd, sender, send) {
    var i = cmd.indexOf(" ");
    console.log("Index = "+i);
    var c = cmd.substring(1, (i < 1 ? cmd.length : i));
    var f = this.cmds[c];
    if (!f) return send("Unknown command '"+c+"'"); //Error msg for unknown command
    var res;
    try {
      res = f(sender, c);
    } catch (e) {
      return send("An unknown error occurred running command '"+cmd+"'");
    }
    if (res) send(res); //If there was a reply, send it - this allows for pure backend commands
  },
  cmds: cmds,
  data: {},
};

module.exports = main;