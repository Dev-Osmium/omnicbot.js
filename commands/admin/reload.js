const Constants = require('./../../constants.js'); 
const reqreload = require("require-reload");
const util = require('util');

const Command   = require('./../Command.js');
const config    = require(Constants.Util.CONFIG);
const log = require(Constants.Util.LOGGER);

const reload = new Command('Reloads a specific module or command. Use `reload path/command.js` to initiate', '', 3, null, (bot, msg, suffix, conf, perms, commands) => {

    log.info(suffix);
    if(commands[suffix]) {
        bot.sendMessage(msg.channel, "Reloading requested module");
        log.info(util.inspect(commands[suffix]));
//delete require.cache[require.resolve(`commands/${suffix}.js`)];
//eval = require(`commands/${suffix}.js`);
    } else {
        log.error("Command was not found");
    }
});

module.exports = reload;
