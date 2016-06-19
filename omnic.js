"use strict"; 

const Discord = require('discord.js'),
	  bot     = new Discord.Client({forceFetchUsers: true, autoReconnect: true, guildCreateTimeout: 0});
const winston = require('winston');
const util = require( "util" );
var request = require("request");


// Get DB and logger paths
const Constants = require('./constants.js');
const config = require(Constants.Util.CONFIG);
const log = require(Constants.Util.LOGGER);
const schedule = require("node-schedule");
const knex = require('knex')(config.pgconf);

// For permanent log instead of console: 
winston.add(winston.transports.File, { filename: 'runfiles/winston.log' });
winston.remove(winston.transports.Console);

// Load all the commands + aliases
const commands = require('./commands/index.js').commands,
	  aliases  = require('./commands/index.js').aliases;

// Various variables used within this file, global to it.
var newusers = new Discord.Cache();
global.top_users_online = [];

bot.on("ready", () => {
	log.info("Prêt à servir dans " + bot.channels.length + " canaux sur " + bot.servers.length + " serveur.");
		for(let server in bot.servers) {
		  knex.select("max_online").table('stats').orderBy("max_online", "desc").limit(1)
	    .then( (rows) => {
	      global.top_users_online = rows[0].max_online;
	    });
	  }

});

// Catch discord.js errors
bot.on('error', e => { log.error(e); });
bot.on('warn', e => { log.warn(e); });
bot.on('debug', e => { log.info(e); });


bot.on("serverCreated", (server) => {
	console.log("Joined " + server.name);
});

bot.once('ready', () => {
	var rule = new schedule.RecurrenceRule();
	rule.minute = [0, 15, 30, 45]; // every 15 minutes of the hour.
	//rule.minute = [new schedule.Range(0, 55,5)]; // every 5 minutes!
	for(var server of bot.servers) {
		console.log("Starting logging on " + server.name);
		var stats_scheduler = schedule.scheduleJob(rule, () =>{
		  let query = {"server_id": server.id, "max_users": 0, "playing_ow": 0, "max_online": 0, "partial_groups": 0, "full_groups": 0};
			query.max_users = server.members.length;
			query.playing_ow = server.members.filter(m=> m.game&&m.game.name==="Overwatch").length;
			let max_online = server.members.filter(m => m.status !== "offline").length;
			query.max_online = max_online;
			if(max_online > GLOBAL.top_users_online) GLOBAL.top_users_online = max_online;
			let voiceChans = server.channels.filter(c => c instanceof Discord.VoiceChannel&&c.name!="Absent - AFK");
			query.full_groups = voiceChans.filter(c=>c.members.length > 5).length;
			query.partial_groups = voiceChans.filter(c=>c.members.length<6&&c.members.length>0).length;
			knex.insert(query, 'id').into('stats')
			.catch( (error) => {
				log.error(error);
			})
			.then( (id) => {
			  log.info("Stats Recorded: " + id + ", query: " + JSON.stringify(query));	
			});
		});
	  /*knex.select().table('new_members')
    .then( (rows) => {
    	for(let row of rows) {
    		bot.members.get("id", row["user_id"], (err, u) => {
    			if(!err) newusers.add(u);
    		});
    		
    	}
    });*/
		
	}
});

bot.on('message', msg => {
	//Ignore if msg is from self or bot account
	if(msg.author.id == bot.user.id || msg.author.bot) return;
	
	if(msg.content.startsWith(config.prefix)) {
		var command  = msg.content.substring(config.prefix.length).split(" ")[0].toLowerCase();
		var suffix   = msg.content.substring(command.length + 2).trim();
		var username = msg.server && msg.server.detailsOf(msg.author).nick ? msg.server.detailsOf(msg.author).nick : msg.author.username;
		
		// Set alias to command if there is one
		command = aliases[command] || command;
		
		//If command found
		if(commands[command]) {
			var cData = commands[command];
			
			//Sub commands
			if(commands[command].inheritance && suffix) {
				var inCommand = suffix.split(" ")[0].toLowerCase();
				if(commands[command].inheritance[inCommand]) {
					cData = commands[command].inheritance[inCommand];
				}
			}

			var userPermissionLevel = 0;
			if(msg.server) {
				var perm1 = msg.server.roles.get('name', 'Modérateur');
				var perm2 = msg.server.roles.get('name', 'Administrateur');
				var perm3 = config.ownerId;
				
				//log.warn(perm1 + " ; " + perm2 + " ; " + perm3);

				userPermissionLevel = perm1 && bot.memberHasRole(msg.author, perm1) && userPermissionLevel < 1 ? 1 : userPermissionLevel;
				userPermissionLevel = perm2 && bot.memberHasRole(msg.author, perm2) && userPermissionLevel < 2 ? 2 : userPermissionLevel;
			}
			userPermissionLevel = msg.author.id == perm3 ? 3 : userPermissionLevel;
			
			if(cData.permissionLevel <= userPermissionLevel) {
				cData.handler(bot, msg, suffix);
				log.command(msg.server, (msg.channel.name || msg.channel.id), msg.author.username, command, suffix);
			}
			else
				bot.sendMessage(msg.channel, `**${username}**, vous n'êtes pas authorisé à utiliser la commande \`${command}\``);
		}
	} 
});


bot.on('raw', (event) => {
  if(event.t === "PRESENCE_UPDATE") { 
	  	let server = bot.servers.get("id", event.d.guild_id),
	  		member = server.members.get("id", event.d.user.id),
	  		role = server.roles.get("name", "En Ondes");
	  if(!role) { 
	  	log.error(`Role was not found when attempting to upgrade Streamer user on ${server.name}`);
	  	return;
	  }
  	if(event.d.game && event.d.game.type == 1 && event.d.game.name.indexOf("Overwatch") > -1) {
	  	bot.addMemberToRole(member, role, (err) => {
			if (err)
				log.error(`Could not add Streamer to server role on ${server.name} because of:\n${err}`);
		});
	  	//log.info(`${member.name} has started streaming on ${event.d.game.url}`);
  	} else {
  		bot.removeMemberFromRole(member, role);
  	}
  }
});


bot.on("serverNewMember", (server, user) => {
	log.info("Nouvel Utilisateur! " + user.username);
	
	var message = util.format(config.welcome.message, user.username);
	var messageRecipient = (config.welcome.inPrivate ? user : server.channels.get("name", config.welcome.channel));
	bot.sendMessage(messageRecipient, message);
  user.server = server.id;
	newusers.add(user);
	if(newusers.length >= 25) {
		bot.sendMessage(server.defaultChannel, `Souhaitez la bienvenue à nos plus récents membres!\n ${newusers.join(", ")}`);
		newusers = new Discord.Cache();
	}

	var milestoneStep = config.milestone.step;
	var milestoneMessage = config.milestone.message;
	if(server.members.length % milestoneStep == 0) {
		bot.sendMessage(server.defaultChannel, util.format(milestoneMessage, server.members.length));
	}
});

bot.on("serverMemberRemoved", (server, user) => {
	newusers.remove(user);
	log.info(`${user.username} (${server.detailsOfUser(user).nick}) has left the server`);
});

bot.on("disconnected", () => {
	log.warn('Disconnected'); 
});

bot.loginWithToken(config.discordToken);

process.on('SIGINT', () => {
    setTimeout(() => {
        process.exit(1);
    }, 5000);
    console.log("Logging out.");
    bot.setStatus("offline", null);
    bot.logout(()=> {
        console.log("Bye");
        process.exit(0);
    });
});