"use strict"; 

const Discord = require('discord.js'),
	  bot     = new Discord.Client({forceFetchUsers: true, autoReconnect: true, guildCreateTimeout: 1000});
const util = require( "util" );
var request = require("request");


// Get DB and logger paths
const Constants = require('./constants.js');
const config = require(Constants.Util.CONFIG);
const log = require(Constants.Util.LOGGER);
const schedule = require("node-schedule");

const r = require('rethinkdb');

var connection = null;
r.connect( {host: 'localhost', port: 28015, db: "omnic"}, function(err, conn) {
    if (err) throw err;
    connection = conn;
});

// Load all the commands + aliases
const commands = require('./commands/index.js').commands,
	  aliases  = require('./commands/index.js').aliases;

// Various variables used within this file, global to it.
var serverconf = new Discord.Cache();
global.top_users_online = [];

bot.on("ready", () => {
	log.info("Prêt à servir dans " + bot.channels.length + " canaux sur " + bot.servers.length + " serveur.");
		for(let server of bot.servers) {
    r.table("stats").filter({server_id: server.id}).orderBy(r.desc("max_online")).limit(1).run(connection, (e, results) => {
        results.toArray( (e, stats) => {
          if(stats[0] && stats[0].max_online) {
            global.top_users_online = stats[0].max_online;
          }
        });

    });
	  }
});

// Catch discord.js errors
bot.on('error', e => { log.error(e); });
bot.on('warn', e => { log.warn(e); });
//bot.on('debug', e => { log.info(e); });


bot.on("serverCreated", (server) => {
	r.table("servers").insert({id: server.id, prefix: "|", lang: "en", stats: false, welcome_count: false}).run(connection, (e, resp) => {
		if(e) log.error(e);
	});
	log.join("Joined " + server.name);
});

bot.once('ready', () => {
	for(let server of bot.servers) {
		let rule = new schedule.RecurrenceRule();
		rule.minute = [0, 15, 30, 45]; // every 15 minutes of the hour.
		schedule.scheduleJob(rule, () =>{
		  let query = {ts_stat:  r.now(), "server_id": server.id, "max_users": 0, "playing_ow": 0, "max_online": 0, "partial_groups": 0, "full_groups": 0};
			query.max_users = server.members.length;
			query.playing_ow = server.members.filter(m=> m.game&&m.game.name==="Overwatch").length;
			let max_online = server.members.filter(m => m.status !== "offline").length;
			query.max_online = max_online;
			if(max_online > global.top_users_online) global.top_users_online = max_online;
			let voiceChans = server.channels.filter(c => c instanceof Discord.VoiceChannel&&c.name!="Absent - AFK");
			query.full_groups = voiceChans.filter(c=>c.members.length > 5).length;
			query.partial_groups = voiceChans.filter(c=>c.members.length<6&&c.members.length>0).length;
      r.table("stats").insert(query).run(connection, (e, c) => {
	      if(e) log.error(e);
      });
		});
		try {
    r.table("servers").get(server.id).run(connection, (e, resp) => {
      if(e) log.error(`Une erreur s'est produite. Oops... \n${e}`);
      serverconf.add(resp);
    });
		} catch (e) {
			log.error(e);
			r.table("servers").insert({id: server.id, prefix: "|", lang: "en", stats: false, welcome_count: false}).run(connection, (e, resp) => {
				if(e) log.error(e);
			});
		}
	}
});

bot.on('message', msg => {
	//Ignore if msg is from self or bot account
	if(msg.author.id == bot.user.id || msg.author.bot) return;
	
	if(!msg.server) {
		log.info(`Private Message: ${msg.content}`);
		bot.reply(msg, `Hey! I'm not that sorta bot, buddy! You wanna talk to me, use the proper channels!`);
		return;
	}

/*
	var matches = ["groupe [0-9]{1,2}", "[0-9] place"];

	if ( matches.some(function(item){ 
		return (new RegExp(item, "gi")).test(msg.content);
	}) ) {
	 console.log('match');
	} else {
		console.log('no match');
	}
*/

	var conf = serverconf.get(msg.server.id);

	var prefix = conf.prefix;
	
	if(msg.content.startsWith(prefix)) {
		var command  = msg.content.substring(prefix.length).split(" ")[0].toLowerCase();
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
				var perm1 = msg.server.roles.get(conf.mod_role);
				var perm2 = msg.server.roles.get(conf.admin_role);
				var perm3 = config.ownerId;
				userPermissionLevel = perm1 && bot.memberHasRole(msg.author, perm1) && userPermissionLevel < 1 ? 1 : userPermissionLevel;
				userPermissionLevel = perm2 && bot.memberHasRole(msg.author, perm2) && userPermissionLevel < 2 ? 2 : userPermissionLevel;
			}
			userPermissionLevel = msg.author.id == perm3 ? 3 : userPermissionLevel;
			
			if(cData.permissionLevel <= userPermissionLevel) {
				cData.handler(bot, msg, suffix, conf, userPermissionLevel);
				log.command(msg.server, (msg.channel.name || msg.channel.id), msg.author.username, command, suffix);
			}
			else
				bot.sendMessage(msg.channel, `**${username}**, vous n'êtes pas authorisé à utiliser la commande \`${command}\``);
		}
	} 
});


bot.on('presence', (o, n) => {
	var query = {id: n.id};
	
	if(n.status === "offline"){
		query.last_seen = r.now();
	  r.table("users").insert(query, {conflict:"update"}).run(connection, (e, c) => {
	    if(e) log.error(e);
	  });
	}
	
	bot.servers.map(s => {
		var conf = serverconf.get(s.id);
		if(conf.streaming_role) {
			var role = s.roles.get(conf.streaming_role);
			
			if(n.game && s.members.has("id", n.id) && n.game.type === 1) {

				var twitchUser = n.game.url.split("/").slice(-1)[0];
				//log.info(`Awww yeah, gonna twitch it up with ${n.username} on ${s.name} (${twitchUser})!`);
				request("https://api.twitch.tv/kraken/streams/"+twitchUser, (err, response, body) => {
					if(err) log.error(err);
					let game_played = JSON.parse(body).stream.game;
				  if(game_played === "Overwatch") {
				  	bot.addMemberToRole(n, role, (err) => {
							if (err) log.error(`Could not add Streamer to server role on ${s.name} because of:\n${err}`);
							query.last_streamed = r.now();
							query.twitch_user = twitchUser;
						  r.table("users").insert(query, {conflict:"update"}).run(connection, (e, c) => {
						    if(e) log.error(e);
						  });
						});
				  } else {
				  	//log.info(`Awww, damn. User is not playing Overwatch, he's playing ${game_played}!`);
				  }
				});
				
			} else if(bot.memberHasRole(n, role)) {
				//console.log(`Awww, ${n.username} stopped streaming!`);
				bot.removeMemberFromRole(n, "190497505010515968");
			}
		}
	});
});

bot.on("serverNewMember", (server, user) => {

	log.info(`${user.username} has joined ${server.name}`);


	var conf = serverconf.get(server.id);
	
	if(conf.welcome_count) {
		//console.log(`${user.username} has joined ${server.name}`);
	
	  r.table("new_users").insert({id: user.id, mention: user.mention(), server: server.id, joined: r.now()}).run(connection, (e, c) => {
	    if(e) console.log(e);
	  });
	
		r.table("new_users").filter({server: server.id}).run(connection, (e, results) => {
			return results;
		})
		.then( (results) => {
	    results.toArray( (e, users) => {
	      //console.log("There are " + users.length + " users in queue to be welcomed on " + server.name);
	      if(users.length >= conf.welcome_count) {
					bot.sendMessage(server.defaultChannel, `Souhaitez la bienvenue à nos plus récents membres!\n ${users.map(user => user.mention).join(", ")}`);
	        r.table("new_users").filter({server: server.id}).delete().run(connection);
	      }
	    });
		});

	}
		
	if(server.id === "182203318670458880"){
			
		var message = util.format(config.welcome.message, user.username);
		var messageRecipient = (config.welcome.inPrivate ? user : server.channels.get("name", config.welcome.channel));
		bot.sendMessage(messageRecipient, message);

		var milestoneStep = config.milestone.step;
		var milestoneMessage = config.milestone.message;
		if(server.members.length % milestoneStep == 0) {
			bot.sendMessage(server.defaultChannel, util.format(milestoneMessage, server.members.length));
		}
	}
});

bot.on("serverMemberRemoved", (server, user) => {
	log.leave(`${user.username} (${server.detailsOfUser(user).nick}) has left ${server.name}`);
	var conf = serverconf.get(server.id);
	if(conf.welcome_count) {
		r.table("new_users").filter({id: user.id, server: server.id}).delete().run(connection);
	}
});

bot.on("disconnected", () => {
	log.warn('Disconnected'); 
});

bot.loginWithToken(config.discordToken);

process.on('SIGINT', () => {
    setTimeout(() => {
        process.exit(1);
    }, 5000);
    log.info("Logging out.");
    bot.logout(()=> {
        process.exit(0);
    });
});