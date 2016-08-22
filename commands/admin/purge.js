"use strict"; 

const Constants = require('./../../constants.js'); 

const Command   = require('./../Command.js');
const config    = require(Constants.Util.CONFIG);
const log = require(Constants.Util.LOGGER);

const purge = new Command('Purge Channel up to X messages', '', 2, null, (bot, msg, suffix) => {

	  let messagecount = parseInt(suffix);
    bot.getChannelLogs(msg.channel, messagecount, (err, messages) => {
        if(err) {log(err)}
        bot.deleteMessages(messages).catch(console.error);;
     });

  
});

module.exports = purge;
