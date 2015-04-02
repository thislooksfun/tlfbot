var bot = require('./bot');
var promptly = require('promptly');

bot.start();
function initConsoleInput() { promptly.prompt("", onInput); }

function onInput(err, val) {
  if (val === 'stop' && bot.running) bot.stop();
  if (val === 'start' && !bot.running) bot.start();
  if (val === 'restart') { bot.stop(); bot.start(); }
  if (val === 'quit') { bot.stop(); process.exit() }
  initConsoleInput();
}
initConsoleInput();