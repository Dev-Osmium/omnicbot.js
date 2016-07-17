'use strict';

const Command   = require('./../Command.js');

var r = null, conn = null;
require("./../../util/db.js").init( (err, redb, connection) => {
	if(err) console.log(err);
	r = redb;
	conn = connection;
});

const channel = new Command('Displays specific text messages.', '', 0, null, (bot, msg, suffix, conf, perm) => {
  if(!suffix) {
    bot.sendMessage(msg, "Help is upcoming, please stand by.");
    return;
  }
  
  let params = suffix.split(" ");
  
  if(params[0] === "text") {
    //create voice channel
    bot.sendMessage(msg, "Creating text channel");
    return;
  }
  
  if(params[0] === "voice") {
    var everyone_role = msg.server.roles.get("name", "@everyone").id;
    bot.createChannel(msg.server, params.slice(1).join(" "), "voice", (err, channel) => {
      if(err) console.log(err);
    bot.overwritePermissions(channel, everyone_role, {"readMessages": false}, (e)=>{
      if(e)console.log(e);
    bot.overwritePermissions(channel, msg.author, {"readMessages": true}, (e) => {
      if(e) {
        console.log(e);
        bot.sendMessage(msg, "Error creating voice channel", (e)=>{if(e)console.log(e)});
      } else {
        bot.sendMessage(msg, `Voice Channel Created, you may now join it.`, (e)=>{if(e)console.log(e);
        bot.deleteMessage(msg, {wait: 2000});
        //bot.sendMessage(channel, `Use this channel to discuss privately about ticket ${id}. Once you are done, please use the \`.close\` command to delete this room.`, (e, m) => {
        //  if(e) console.log(e);
        //  bot.deleteMessage(m, {wait: 15000});
        //});
        });
      }
    });
    });
    });
    return;
  }
  
  if(params[0] === "del") {
    //delete channel
    bot.sendMessage(msg, `Deleting Channel: ${params[1]}`);
  }
  
});

module.exports = channel;
