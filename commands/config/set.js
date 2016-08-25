"use strict";

const Command   = require('./../Command.js');

const serverconf = require('../../util/serverconf.js');

const _set = new Command('Set bot configurations per server. Must be used from a server!', '', 2, null, (bot, msg, suffix, conf) => {
  const [_key, _value] = suffix.split(2);
  serverconf.set(msg.server.id, _key, _value)
  .then(() => bot.reply(msg, `Looks like that config change worked!`)
    .then(message=> bot.deleteMessage(message, {wait: 3000}))
  )
  .catch(e => bot.reply(msg, `Error, error: ${e}`)
    .then(message=> bot.deleteMessage(message, {wait: 3000}))
  );
});

module.exports = _set;