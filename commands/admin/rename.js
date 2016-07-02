"use strict"; 

const Constants = require('./../../constants.js'); 

const Command   = require('./../Command.js');
const config    = require(Constants.Util.CONFIG);
const log = require(Constants.Util.LOGGER);

const nick = new Command('Rename the bot. Use `nick NewName` to initiate', '', 2, null, (bot, msg, suffix) => {

	let newname = suffix;
	bot.setNickname(msg.channel.server, newname);
    bot.sendMessage(msg.channel, "Mon nom a été changé! Je m'appelle maintenant " + newname + ". Tournée sur mon bras!");
});

module.exports = nick;
