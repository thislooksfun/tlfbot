var util = require('./util');

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
                res = f.f(cmd.split(" "), {user: sender, perm: perm});
            } catch (e) {
                console.log(e.stack);
                return send("An unknown error occurred running command '"+cmd+"'");
            }
            if (res)
                if (typeof res == 'string')
                    send(res); //If there was a reply, send it - this allows for pure backend commands
                else
                    util.err("Command response is not a string! [cmd: "+cmd+", type: "+(typeof res)+"]");
        });
    },
    cmds: {},
    data: {},
};


var beam;
var perms = {user: 0, mod: 1, owner: 2};
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
                d.user_roles.forEach(function (perm) {
                    var p = perms[perm.toLowerCase()];
                    if (p > highest) highest = p
                });
                cb(highest);
            }
        });
    });
}

module.exports = main;