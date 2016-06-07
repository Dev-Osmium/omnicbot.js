const Constants = require('./../../constants.js'); 

const Command   = require('./../Command.js');
const config    = require(Constants.Util.CONFIG);
const log = require(Constants.Util.LOGGER);

const reload = new Command('Reloads a specific module or command. Use `reload path/command.js` to initiate', '', 2, null, (bot, msg, suffix) => {

    log.info(suffix);

    bot.sendMessage(msg.channel, "Reloading requested module");     
});

module.exports = reload;
