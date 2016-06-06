1. Get node.js
2. install with `node install --save discord.js`
3. When the bot is running, make it join the server. Go to: 
	https://discordapp.com/oauth2/authorize?&client_id=YOURID&scope=bot  (YOURID found in the *My Applications* page of the Developer section of Discord App)
4. It's safe to stop the node.js process without disconnecting/closing the bot first. 
5. 


	"welcome": { 
		"message": "Salut %s , et Bienvenue sur le serveur Overwatch.Quebec! On t'invite à passer sur notre page web http://www.overwatch.quebec/ . Sur cette page tu trouvera des informations et règles, des nouvelles, une liste des membres et leur Battle.Net ID, et finalement un formulaire pour inscrire vos infos!\n\nSi vous avez des questions, utilisez #aide-et-soutien , cherchez un groupe avec #pc-looking-for-group  !",
		"inPrivate": false,
		"channel": "general"
	},
	"milestone": {
		"message": "C'est donc ben débile, on est rendu à **%s** utilisateurs! Célébrations pis balounes pis toute la patente! WOOHOO!",
		"step": 2
	},
	"loop": {
		"message": "Attention à tous, ceci est un message répété aux 2 minutes parce que ça me tente pis fuck you that's why. - OMNIC",
		"minutes": 2
	}






	/*
    var acceptedcommands = [".echo", ".invite", ".serverinfo", ".logout", ".fakeuser", ".newname", ".setowner", ".setmod", ".prune", ".addTimer", ".removeTimer", ".tts"];
    var thiscommand = msg.content.split(" ")[0];
	if(msg.content.startsWith(".") && acceptedcommands.indexOf(thiscommand) >= 0) {

		var returnChannel = msg.server.defaultChannel;
		console.log("Message received: " + msg.content);
		if( (ownerUser && msg.author.id !== ownerUser.id) && ( modUser && msg.author.id !== modUser.id) )  {
			bot.reply(msg, "Vous n'êtes pas authorisé à utiliser cette commande.");
	        console.log(msg.author.name + " a tenté d'utiliser la commande: " + msg.content);
		} else {
		
			if( msg.content.startsWith(".invite")) {
				bot.reply( msg, "Le lien permanent pour se joindre à Overwatch.Quebec est http://discord.overwatch.quebec/ ! \n Si vous utilisez l'application mobile Discord et désirez joindre le serveur, utilisez le code d'invitation : `0116E9FlHOMq6dIgF`");
			}

			if( msg.content.startsWith(".echo")) {
				bot.reply( msg, msg.content.substr(msg.content.indexOf(' ')+1));
			}

			if( msg.content.startsWith(".tts")) {
				bot.replyTTS( msg, msg.content.substr(msg.content.indexOf(' ')+1));
			}


			if( msg.content.startsWith(".serverinfo")) {
				var command = msg.content.split(" ")[1];
				var reply = "";

				var serverinfo = msg.server;

				if(serverinfo[command] !== null) {
					reply = serverinfo[command];
				}

				if(command === "usercount") {
					reply = "Il y a " + msg.server.members.length + " members on this server.";
				}

				bot.reply(msg, reply);
			}

			if( msg.content.startsWith(".logout")) {
				console.log("Logging Out");
				bot.sendMessage(returnChannel, "Bon c'est chill, je m'en vais on veut pas de moi!");
				bot.logout(()=> {
					console.log("Bye");
					process.exit(0);
				});
			}

			if ( msg.content.startsWith(".fakeuser")) {
				bot.emit('serverNewMember', bot.servers[0], bot.user);
			}

			if (msg.content.startsWith(".newname")) {
				var newname = msg.content.split(" ")[1];
				bot.setNickname(msg.channel.server, newname);
				console.log ("Surnom changé pour : " + newname);
			}

			if(msg.content.startsWith(".setowner")) {
				var ownername = msg.content.split(" ")[1];
				bot.sendMessage(returnChannel, "Le propriétaire de ce bot est maintenant : " + bot.users.get("username", ownername).mention());
				ownerUser = bot.users.get("username", ownername);
			}

			if(msg.content.startsWith(".setmod")) {
				var modname = msg.content.split(" ")[1];
				bot.sendMessage(returnChannel, "Le Modérateur de ce bot est maintenant : " + bot.users.get("username", modname).mention());
				ownerUser = bot.users.get("username", modname);
			}

			if(msg.content.startsWith(".prune")) {
				var msgcount = msg.content.split(" ")[1];
                bot.getChannelLogs(msg.channel, msgcount+1, (err, messages) => {
                    bot.deleteMessages(messages);
                    if(err) {
                    	console.log(err);
                    }
                });
			}
			
			if(msg.content.startsWith(".addTimer")) {
				let parts = msg.content.split(" "),
					timerName = parts[1],
					seconds = parts[2],
					channelName = msg.server.channels.get("name", parts[3]),
					message = parts.slice(4).join(" ");
				globaltimers[timerName] = setInterval(function() { 
					bot.sendMessage(channelName, message);
				}, seconds * 1000);
				bot.sendMessage(channelName, "Timer **" + timerName + "** has been added. Use `.removeTimer " + timerName + "` to cancel it.");
			}
			
			if(msg.content.startsWith(".removeTimer")) {
				let timerName = msg.content.split(" ")[1];
				clearInterval(globaltimers[timerName]);
				bot.reply("Timer " + timerName + " has been canceled.");
				console.log("Cleared Timer: " + timerName);
			}

			bot.deleteMessage(msg);

		}
	}
	*/