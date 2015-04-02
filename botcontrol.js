var bot = require('./bot');
var promptly = require('promptly');

module.exports = {
    restart: function() {
        bot.stop();
        bot.start();
    },
    stop: function() {
        bot.stop();
    },
    quit: function() {
        bot.stop();
        process.exit();
    }
};

bot.start();
function initConsoleInput() { promptly.prompt("", onInput); }

function onInput(err, val) {
    if (val === 'stop' && bot.running) bot.stop();
    else if (val === 'start' && !bot.running) bot.start();
    else if (val === 'restart') { bot.stop(); bot.start(); }
    else if (val === 'quit') { bot.stop(); process.exit() }
    else bot.send(val);
    initConsoleInput();
}

initConsoleInput();