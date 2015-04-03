var fs = require('fs');
var path_module = require('path');
var util = require('./util');

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
                load(data, path);
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
    loadModules(path_module.join(__dirname, 'commands'), function(data, path) {
        if (Array.isArray(data)) {
            data.forEach(function (f, i) {
                if (typeof f.name !== 'string') return util.err("Error reading command file '"+path+"' - name not specified for element #"+i);
                if (typeof f.usage !== 'string') return util.err("Error loading command '"+f.name+"' - usage not specified");
                if (typeof f.perm !== 'number') return util.err("Error loading command '"+f.name+"' - permission level not specified");
                if (typeof f.f !== 'function') return util.err("Error loading command '"+f.name+"' - command function not specified");
                if (cmd.cmds[f.name]) return util.err("Error loading command '"+f.name+"' - command already registered");
                cmd.cmds[f.name] = f;
                if (f.aliases)
                    f.aliases.forEach(function(al) {
                        if (cmd.cmds[al]) return util.err("Error loading alias '"+al+"' of '"+f.name+"' - command already registered");
                        cmd.cmds[al] = f;
                    });
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