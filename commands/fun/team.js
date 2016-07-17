'use strict';

const Command   = require('./../Command.js');
const Discord = require('discord.js');

var r = null, conn = null;
require("./../../util/db.js").init( (err, redb, connection) => {
	if(err) console.log(err);
	r = redb;
	conn = connection;
});

const team = new Command('Choose a Pokemon Team', '', 0, null, (bot, msg, suffix, conf, perm) => {
  if(!suffix) {
    bot.reply(msg, `Pour choisir une équipe, veuillez utiliser la command .team suivi de la couleur \`red\`, \`blue\`, \`yellow\``);
    return;
  }
  var teams = new Discord.Cache();
  teams.add({"id": "204025982997364746", "role": msg.server.roles.get("204025982997364746"), "code" : "yellow", "name": "Team Instinct"});
  teams.add({"id": "204026096520265732", "role": msg.server.roles.get("204026096520265732"), "code" : "red", "name": "Team Valor"});
  teams.add({"id": "204026132545273856", "role": msg.server.roles.get("204026132545273856"), "code" : "blue", "name": "Team Mystic"});

  if(!teams.has("code", suffix)) {
    if(suffix == "reset") {
      teams.map(t=> bot.removeMemberFromRole(msg.author, t.role, (err) => {if(err) console.log(err)}));
      bot.reply(msg, `Tu a été enlevé de toutes les équipes!`);
      return;
    } else {
      bot.reply(msg, `L'équipe **${suffix}** est invalide... en tout cas c'est ce que mon code me dis, je ne suis qu'un robot après tout!`);
      return;
    }
  }
  
  var req_team = teams.get("code", suffix);
  var current_team = teams.filter(t => bot.memberHasRole(msg.author, t.role))[0];
  console.log("Attempting to add to " +req_team.name);
  
  
  if(current_team && current_team.id) {
    bot.reply(msg, `Tu fais déjà partie de ${current_team.name}! Utilise la commande \`.team reset\` pour t'enlever de l'équipe existante.`);
    return;
  }
  
  bot.addMemberToRole(msg.author, req_team.role, (err) => {
    if(err) console.log(err);
    bot.reply(msg, `Tu a été ajouté à ${req_team.name}, woot!`);
  });

});

module.exports = team;
