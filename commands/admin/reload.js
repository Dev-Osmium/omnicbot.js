const Constants = require('./../../constants.js'); 

const Command   = require('./../Command.js');
const config    = require(Constants.Util.CONFIG);

const about = new Command('Gives you information about the bot', '', 0, null, (bot, msg, suffix) => {
    var msgArr = [];
    
    msgArr.push('```xl\n[Author]           LuckyEvie#0354');
    msgArr.push('[Version]          0.0.1');
    msgArr.push('[Library]          Discord.js (indev)');
//    msgArr.push('[Command]         ' + config.prefix + 'help');
//    msgArr.push('[GitHub]           gexoXYZ/GeBot\n```');
    
    bot.sendMessage(msg.channel, msgArr);     
});

module.exports = about;
