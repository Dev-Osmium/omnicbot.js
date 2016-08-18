'use strict';

const Command   = require('./../Command.js');

var r = null, conn = null;
require("./../../util/db.js").init( (err, redb, connection) => {
	if(err) console.log(err);
	r = redb;
	conn = connection;
});

const team = new Command('Choose a Pokemon Team', '', 0, null, (bot, msg, suffix, conf, perm) => {
  
  r.table("teams").filter({serverID: msg.server.id}).run(conn, (e, c) => {
    if(e) {
      console.error(e);
      bot.reply(conf.i18n `An internal error has occured.`);
      return;
    }
    c.toArray( (e, teams) =>{
      
      if(!teams || teams.length < 1) {
        //bot.reply(msg, conf.i18n `No teams have been defined on this server. This function has been disabled.`);
        return;
      }


      if(!suffix) {
        bot.reply(msg, conf.i18n `To choose a team, use the \`.team\` command, followed by one of the team names: ${teams.map(t=>`\`${t.code}\``).join(", ")}\nTo see the current team statistics, use \`.team stats\`.`);
        return;
      }
      
      var req_team = teams.find(e=>e.code === suffix);
      
      if (!req_team) {
        
        if(suffix === "reset") {
          bot.removeMemberFromRole(msg.author, teams.map(t=>t.id), (err) => {if(err) console.log(err)});
          bot.reply(msg, conf.i18n `You have been removed from all teams!`);
          return;
        } else if(suffix == "stats") {
          teams.map(t => {
            t.member_count = msg.server.usersWithRole(msg.server.roles.get(t.id)).length;
          });
          teams.sort(function(a, b) {
            return b.member_count - a.member_count;
          });
          bot.sendMessage(msg, conf.i18n `Here are the current team scores:\n${teams.map(t => {return conf.i18n `**${t.name}** with **${t.member_count}** members`}).join(", ")}`);
          bot.deleteMessage(msg);
          return;
        } else {
          bot.reply(msg, conf.i18n `The team name **${suffix}** is invalid... in any case that's what my code tells me, I'm just a bot after all!`);
          return;
        }
        
      }

      
      
      var current_team = teams.filter(t => bot.memberHasRole(msg.author, msg.server.roles.get(t.id)))[0];
      //console.log("Attempting to add to " +req_team.name);

      if(current_team && current_team.id) {
        bot.reply(msg, conf.i18n `You're already a part of ${current_team.name}! Use the \`${conf.prefix}team reset\` command to remove yourself from your current team.`);
        return;
      }
      
      bot.addMemberToRole(msg.author, msg.server.roles.get("id", req_team.id), (err) => {
        if(err) console.log(err);
        bot.reply(msg, conf.i18n `You have been added to team ${req_team.name}!`);
      });
      
    });
  });
});

module.exports = team;
