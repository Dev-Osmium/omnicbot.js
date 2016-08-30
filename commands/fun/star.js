'use strict';
const Command   = require('./../Command.js');
const moment = require('moment');

const  r = require('rethinkdbdash')({servers: [{db: "omnic"}]});


const star = new Command('Stars a message', '', 0, null, (bot, msg, suffix, conf, perm) => {
  if(!conf.star_channel) {
    bot.reply(msg, conf.i18n `A moderator must set the **${"star_channel"}** config for this command to work.`);
    return;
  }
  
  if(!suffix) {
    bot.reply(msg, conf.i18n `You must specify a ${"message"} ID for this command.`);
    return;
  }
  
  let messageID = suffix.split(" ")[0];
  
  r.table("starred_messages").get(messageID).run().then(cache_object => {
    if(cache_object.author.id === msg.author.id) bot.reply(msg, conf.i18n `You cannot use this action on yourself.`);
    if(!cache_object.id) throw "Fuck off";
    bot.getMessage(conf.star_channel, cache_object.star_message)
    .then( message => {
      if(~cache_object.starred.indexOf(msg.author.id))  return bot.reply(msg, conf.i18n `You cannot use this action more than once`);
      let contents = message.content.replace(/^⭐ \*\*(\d)\*\*/, (match, p1) => `⭐ **${++p1}**`);
      cache_object.starred.push(msg.author.id);
      r.table("starred_messages").get(messageID).update(cache_object).run();
      message.update(contents).catch(console.error);
      msg.delete();
    })
    .catch(e => {
      console.error(`Message ${messageID} was not found on ${cache_object.channelID}\n${e}`);
      bot.reply(msg, conf.i18n `The message was not found`);
    });    
  }).catch(e => {
    bot.getMessage(msg.channel, messageID)
    .then(message => {
      if(message.author.id === msg.author.id) return bot.reply(msg, conf.i18n `You cannot use this action on yourself.`);
      let contents = [];
      contents.push(`⭐ **1** ${moment(msg.timestamp).format("YYYY-MM-DD HH:mm")} by ${message.author.name} on <#${message.channel.id}> (${messageID})` );
      contents.push(message.cleanContent);
      bot.sendMessage(conf.star_channel, contents.join("\n"))
      .then(star_message => {
        let cache_object = message.toObject();
        cache_object.starred = [msg.author.id];
        cache_object.star_message = star_message.id;
        r.table("starred_messages").insert(cache_object).run();
        msg.delete();
      })
      .catch(console.error);
    })
    .catch(e=>{
      console.error(`Message ${messageID} was not found\n${e}`);
      bot.reply(msg, conf.i18n `The message was not found`);
    });
  });
});

module.exports = star;
