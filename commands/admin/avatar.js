const Constants = require('./../../constants.js'); 
const request = require("request");

const Command   = require('./../Command.js');
const config    = require(Constants.Util.CONFIG);
const log = require(Constants.Util.LOGGER);

const rename = new Command('Change bot avatar: `.avatar URL`', '', 3, null, (bot, msg, suffix) => {

    if(suffix) {
        request({ url: suffix, encoding: null }, (err, res, image) => {
          bot.setAvatar(image);
          if(err) {
              log.error(err);
          } else {
            bot.sendMessage(msg, "Nouvel avatar! Comment vous aimez mon nouveau look?");
          }
        });
    } else {
        bot.sendMessage(msg, "Utilisation: `.avatar URL`");
    }
});

module.exports = rename;
