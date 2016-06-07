const Constants = require('./../../constants.js'); 

const Command   = require('./../Command.js');
const config    = require(Constants.Util.CONFIG);

const echo = new Command('Displays specific text messages.', '', 0, null, (bot, msg, suffix) => {
    if(!suffix) {
        bot.reply(msg, "Aide pour cette commande à venir");
    } else {
        if(config.info[suffix]) {
        	bot.reply(msg, config.info[suffix]);
        } else {
            bot.reply(msg, "Commande d'info introuvable.");
        }
    }
});

module.exports = echo;
