'use strict';

const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const Constants = require('./../../constants.js'); 
const moment = require("moment");

const Command   = require('./../Command.js');
const config    = require(Constants.Util.CONFIG);

const echo = new Command('Display Stats', '', 1, null, (bot, msg, suffix) => {
  let knex = require('knex')(config.pgconf);
/*  if(!suffix) {
    bot.reply("Aucun URL de vidéo spécifié");
  } else if (suffix === "latest") {
*/
    knex.select().table('stats').orderBy("ts", "desc").limit(1)
    .then( (rows) => {
      let r = rows[0];
      bot.reply(msg, `Il y a eu un maximum de ${global.top_users_online} utilisateurs en ligne. Présentement:\nEn ligne: ${r.max_online} ; Sur Overwatch: ${r.playing_ow} ; Groupes: ${r.partial_groups}/${r.full_groups} (Partiel/Complet)`);
    });


});

module.exports = echo;

