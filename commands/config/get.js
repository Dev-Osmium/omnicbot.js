"use strict";

const Command   = require('./../Command.js');

function getparams(suffix, num, separator) { 
	let params = [];
	let parts = suffix.split(separator);
	for (let i=0; i < num; i++) params[i] = parts[i];
	params[num] = parts.slice(num).join(" ");
	return params;
}

const get = new Command('Set bot configurations per server. Must be used from a server!', '', 2, null, (bot, msg, suffix, conf) => {
  
  console.log(JSON.stringify(conf));
  console.log(suffix.split(" ")[1]);
  if(!suffix.split(" ")[1]) {
    //bot.sendMessage(msg, JSON.stringify(conf));
    bot.sendMessage(msg, "So... yeah this should return your current server configuration. I guess. Maybe. Something like that.\nRemind me to format the whole thing in `xl` will you?");
  } else {
    let key = suffix.split(" ")[1];
    console.log("Value: " + conf[key]);
    bot.reply(msg, `The current configuration for ${key} is the following (use \`.config set ${key} newvalue\` to change it):\n${conf[key]}`);
  }
});

module.exports = get;