'use strict';

const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const Constants = require('./../../constants.js'); 

const Command   = require('./../Command.js');
const config    = require(Constants.Util.CONFIG);

const echo = new Command('Plays YouTube Video', '', 1, null, (bot, msg, suffix) => {
    
    if(!suffix) {
        bot.reply("Aucun URL de vidéo spécifié");
    } else {
        let parts = suffix.split(" "),
            channel = msg.server.channels.get(parts[0]);
        if (channel instanceof Discord.VoiceChannel) {
            bot.joinVoiceChannel(channel).then(connection => {
              let url = parts[1];
              let stream = ytdl(url, { audioonly: true });
              connection.playRawStream(stream)
              .then(intent => {
                  intent.on("end", () => {
                      console.log("Playback ended");
                  });
              });
            })
            .catch(err => {
              console.log('Playback Error: ' + err);
            });
        }
    }
});

module.exports = echo;
