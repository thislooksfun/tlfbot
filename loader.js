var fs = require('fs');
var path_module = require('path');

var cmd = require('./cmd');
var beam = require('./beam');

function loadModules(path, load, rl)
{
    var stat = fs.lstatSync(path)
    console.log("Loading "+path);
    if (stat.isDirectory()) {
        // we have a directory: do a tree walk
        var files = fs.readdirSync(path);
        var f, l = files.length;
        for (var i = 0; i < l; i++) {
            f = path_module.join(path, files[i]);
            loadModules(f, load, rl);
        }
    } else {
        // we have a file: load it
        if (rl && require.cache[path]) delete require.cache[path]; //If the module is already loaded, remove it from the cache to force a reload
        try {
            var f = require(path);
            if (f)
            {
                var n = path_module.parse(path).name;
                load(f, n);
            } else
                util.err("Error loading command '"+path+"', module.exports is undefined");
        } catch (e) {
            console.warn("\nCaught error while loading module "+path);
            console.warn(e.stack);
            console.warn();
        }
    }
}

function load(rl) {
    loadModules(path_module.join(__dirname, 'chat_listeners'), function (f) {
        if (typeof f === 'function')
            beam.socket.listeners[beam.socket.listeners.length] = f;
    });
    loadModules(path_module.join(__dirname, 'commands'), function(f, n) {
        var c = {};
        if (typeof f === 'function')
            c = {perm: 0, f: f};
        else if (typeof f.f === 'function')
            c = f;
        else
            return util.err("Error loading command '"+path+"', module.exports not a function, and neither is module.exports.f");
        
        if (!c.perm) c.perm = 0;
        cmd.cmds[n] = c;
    }, rl);
}
function reload() {
    beam.socket.sendMsg("Reloading commands...");
	cmd.cmds = {};
	beam.socket.listeners = [];
	load(true);
    beam.socket.sendMsg("Commands reloaded!");
}


module.exports = {
	load: load,
	reload: reload,
}