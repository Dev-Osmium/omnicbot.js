const Constants = require('./../../constants.js'); 

const Command   = require('./../Command.js');
const config    = require(Constants.Util.CONFIG);

const echo = new Command('Echoes any text, as a test!', '', 2, null, (bot, msg, suffix) => {
	bot.reply(msg, msg.content.substr(msg.content.indexOf(' ')+1));
});

module.exports = echo;
