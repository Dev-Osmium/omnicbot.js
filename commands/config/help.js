"use strict";

const Command   = require('./../Command.js');

const help = new Command('Set bot configurations per server. Must be used from a server!', '', 2, null, (bot, msg, suffix, conf) => {
  
  bot.sendMessage(msg, "This should be a help message. ¯\\_(ツ)_/¯");
  
});

module.exports = help;