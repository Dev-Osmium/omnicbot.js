"use strict";

const Command   = require('./../Command.js');

function getparams(suffix, num, separator) { 
	let params = [];
	let parts = suffix.split(separator);
	for (let i=0; i < num; i++) params[i] = parts[i];
	params[num] = parts.slice(num).join(" ");
	return params;
}

const serverconf = require('../../util/serverconf.js');

const _set = new Command('Set bot configurations per server. Must be used from a server!', '', 2, null, (bot, msg, suffix, conf) => {
  
  const params = getparams(suffix, 2, " ");
  serverconf.set(msg.server.id, params[1], params[2], (e) => {
    if(e) bot.reply(msg, `Error, error: ${e}`, (e, message) => {bot.deleteMessage(message, {wait: 3000});});
    else bot.reply(msg, `Looks like that config change worked!`, (e, message) => {bot.deleteMessage(message, {wait: 3000});});
    bot.deleteMessage(msg, {wait: 3000});
  });
});

module.exports = _set;