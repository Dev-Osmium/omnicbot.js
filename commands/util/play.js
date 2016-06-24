'use strict';

const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const Constants = require('./../../constants.js'); 

const Command   = require('./../Command.js');
const config    = require(Constants.Util.CONFIG);

function getparams(suffix, num, separator) { 
	let params = [];
	let parts = suffix.split(separator);
	for (let i=0; i < num; i++) params[i] = parts[i];
	params[num] = parts.slice(num).join(" ");
	return params;
}

const echo = new Command('Plays YouTube Video', '', 1, null, (bot, msg, suffix) => {
  if(!suffix) {
    bot.reply("Aucun URL de vidéo spécifié");
  } else {
    var parts = getparams(suffix, 3, " ");
    let id = parts[1],
        channel = parts[2],
        url = false,
        stream = false;
    
    console.log(`ID: ${id} will play in ${channel}`);
    
    switch(parts[0]) {
      case "yt":
        url = "https://www.youtube.com/watch?v=" + id;
        stream = ytdl(url, { audioonly: true });
        break;
      default: 
        stream = false;
        break;
    }
    
    if(stream) {
      let channel = msg.server.channels.get("name", channel);
      if (channel instanceof Discord.VoiceChannel) {
        bot.joinVoiceChannel(channel).then(connection => {
          connection.playRawStream(stream)
          .then(intent => {
            intent.on("end", () => {
              console.log("Playback ended");
              bot.leaveVoiceChannel(channel);
            });
          });
        })
        .catch(err => {
          bot.leaveVoiceChannel(channel);
          console.log('Playback Error: ' + err);
        });
      } else {
        bot.sendMessage(msg, "Apparement le salon " + parts[2] + " n'est pas vocal... ché pas quoi faire là, boss.");
      }
    }
  }
});

module.exports = echo;
