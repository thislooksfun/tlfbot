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
            var data = require(path);
            if (data)
                load(data);
            else
                util.err("Error loading command '"+path+"', module.exports is undefined");
        } catch (e) {
            console.warn("\nCaught error while loading module "+path);
            console.warn(e.stack);
            console.warn();
        }
    }
}

function load(rl) {
    loadModules(path_module.join(__dirname, 'chat_listeners'), function (data) {
        if (typeof data === 'function')
            beam.socket.listeners[beam.socket.listeners.length] = data;
    });
    loadModules(path_module.join(__dirname, 'commands'), function(data) {
        if (Array.isArray(data)) {
            data.forEach(function (f) {
                if (cmd.cmds[f.name]) return util.err("Error loading command '"+f.name+"' - command already registered");
                cmd.cmds[f.name] = f;
            });
        }
        else
            return util.err("Error loading command '"+path+"', module.exports is not an array");
    }, rl);
}
function reload() {
    beam.socket.sendMsg("Reloading...");
	cmd.cmds = {};
	beam.socket.listeners = [];
	load(true);
    beam.socket.sendMsg("Reloaded!");
}


module.exports = {
	load: load,
	reload: reload,
}