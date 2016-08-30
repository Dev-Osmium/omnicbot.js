"use strict";

const Command   = require('./../Command.js');

const serverconf = require('../../util/serverconf.js');

const _set = new Command('Set bot configurations per server. Must be used from a server!', '', 2, null, (bot, msg, suffix, conf) => {
  const [_key, _value] = suffix.split(" ").slice(1);
  //console.log(`Attempting to set ${_key} to ${_value}`);
  serverconf.set(msg.server.id, _key, _value)
  .then(() => {
    bot.reply(msg, `Configuration ${_key} was changed to ${_value}`);
    bot.deleteMessage(msg);
  })
  .catch(e => {
    bot.reply(msg, `Error, error: ${e}`);
    bot.deleteMessage(msg);
  });
});

module.exports = _set;