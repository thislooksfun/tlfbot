var util = require('./util');

var cmds = {
    help: {f: function(args, sender) {
        if (!sender.perm) sender.perm = 0;
        var list = "";
        for (var k in cmds)
            if (cmds.hasOwnProperty(k) && sender.perm >= (cmds[k].perm ? cmds[k].perm : 0))
                list += (list == "" ? "!" : ", !") + k;
        return "Commands: "+list;
    }},
    hi:      {f: function() { return "Hello" }},
    users:   {f: function() { return "There are "+main.data.chatters+" users online" }},
    viewers: {f: function() { return "There are "+main.data.viewers+" people watching right now" }},
    restart: {
        perm: 1,
        f: function(args, sender) {
            require('./botcontrol').restart();
        }},
    stop: {
        perm: 2,
        f: function(args, sender) {
            require('./botcontrol').stop();
        }},
    quit: {
        perm: 2,
        f: function(args, sender) {
            require('./botcontrol').quit();
        }},
};

var main = {
    parsecmd: function(cmd, sender, send) {
        var i = cmd.indexOf(" ");
        var c = cmd.substring(1, (i < 1 ? cmd.length : i));
        var f = this.cmds[c];
        if (!f) return send("Unknown command '"+c+"'"); //Error msg for unknown command
        getPerm(sender, function(perm) {
            if (perm < f.perm) return send("You don't have permission to use that command!");
            var res;
            
            try {
                res = f.f(c.split(" "), {user: sender, perm: perm});
            } catch (e) {
                console.log(e.stack);
                return send("An unknown error occurred running command '"+cmd+"'");
            }
            if (res) send(res); //If there was a reply, send it - this allows for pure backend commands
        });
    },
    cmds: cmds,
    data: {},
};

var perms = {user: 0, mod: 1, owner: 2};
var beam;
function getPerm(user, cb)
{
    if (!beam) beam = require('./beam');
    beam.query("chats/"+beam.socket.auth.chanid+"/users", "GET", {}, function(err, data) {
        if (err) {
            err("ERR: "+err);
            cb(0);
        }
        data.forEach(function(d) {
            if (d.user_name === user) {
                var highest = 0;
                for (var i = 0; i < d.user_roles.length; i++) {
                    var p = perms[d.user_roles[i].toLowerCase()];
                    if (p > highest)
                        highest = p
                }
                cb(highest);
            }
        });
    });
}

module.exports = main;