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

var teams = new Discord.Cache();
teams.add({"id": "203960695681843211", "role": msg.server.roles.get("203960695681843211"), "code" : "yellow", "name": "Team <:goInstinct:210091950563393537> Instinct"});
teams.add({"id": "203960649083125760", "role": msg.server.roles.get("203960649083125760"), "code" : "red", "name": "Team <:goValor:210091949586251776> Valor"});
teams.add({"id": "203960561497669633", "role": msg.server.roles.get("203960561497669633"), "code" : "blue", "name": "Team <:goMystic:210091944620195841> Mystic"});
var team_array = ["203960695681843211","203960649083125760","203960561497669633"];

  if(!suffix) {
    bot.reply(msg, `Pour choisir une équipe, veuillez utiliser la command .team suivi de la couleur \`red\`, \`blue\`, \`yellow\`\nPour voir le nombre de membres de chaque équipe, utilisez la commande \`.team stats\``);
    return;
  }

  if(!teams.has("code", suffix)) {
    if(suffix == "reset") {
      bot.removeMemberFromRole(msg.author, team_array, (err) => {if(err) console.log(err)});
      bot.reply(msg, `Tu a été enlevé de toutes les équipes!`);
      return;
    } else if(suffix == "stats") {
      teams.map(t => {
        t.member_count = msg.server.usersWithRole(t.role).length;
      });
      teams.sort(function(a, b) {
        return b.member_count - a.member_count;
      });
      bot.sendMessage(msg, "Voici le score des équipes en ce moment!:\n" + teams.map(t => {return `**${t.name}** avec **${t.member_count}** membres`}).join(", "));
      bot.deleteMessage(msg);
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
