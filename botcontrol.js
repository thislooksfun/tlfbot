var bot = require('./bot');
var promptly = require('promptly');

var loader = require('./loader');
loader.load();

module.exports = {
    stop: stop,
    restart: restart,
};

function stop() { if (bot.running) bot.stop(); else console.log("Bot is already stopped!"); }
function start() { if (!bot.running) bot.start(); else console.log("Bot is already running!"); }
function restart() { bot.restart(); }
function quit() { bot.stop(); process.exit(); }

bot.start();
function initConsoleInput() { promptly.prompt("", onInput); }

function onInput(err, val) {
    if (val === 'stop') stop();
    else if (val === 'start') start();
    else if (val === 'restart') restart();
    else if (val === 'quit') quit();
    else if (val === 'reload') loader.reload();
    else if (val === 'help') console.log("\nCommands:\nstop - stops the bot\nstart - starts the bot\nrestart - restarts the bot\nquit - quits the bot with exit message\nreload - reloads all commands and chat listeners\nsend [msg] - sends the message [msg] to the chat room\n");
    else if (val.startsWith("send ") && val.length > 5) bot.send(val.slice(5));
    else console.log("Unknown command '"+val+"' - type 'help' for a list of commands");
    initConsoleInput();
}

initConsoleInput();

String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix) === 0;
}