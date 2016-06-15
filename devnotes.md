1. Get node.js
2. install with `node install --save discord.js`
3. When the bot is running, make it join the server. Go to: 
	https://discordapp.com/oauth2/authorize?&client_id=YOURID&scope=bot  (YOURID found in the *My Applications* page of the Developer section of Discord App)
4. It's safe to stop the node.js process without disconnecting/closing the bot first. 


// save JSON string "pretty", \t is tab indentation
JSON.stringify(toStringify, null, "\t")

sheet.getRows(, function( err, rows ){
      console.log('Read '+rows.length+' rows');
    });


function getparams(suffix, num, separator) { 
	var params = [];
	parts = suffix.split(separator);
	for (i=0; i < num; i++) params[i] = parts[i];
	param[num+1] = parts.split(num).join(" ");
	return params;
}


if(newusers.length >= 10) {
    var userlist = [];
    var i = newusers.length;

    while(i--) {
        userlist.push(newusers[i].mention());
        newusers.remove(newusers[i]);
    }
    bot.sendMessage(server.defaultChannel, `Souhaitez la bienvenue à nos plus récents membres!\n ${userlist.join(", ")}`);
}




// Custom Code for streaming users! 
/*

bot.on("presence", (o, n) => (n.game && n.game.name === "Overwatch" && n.game.url ? bot.addMemberToRole : o && o.game === "Overwatch" && o.game.url ? bot.removeRoleFromMember : () => {})(o, JSON.stringify(o.game) !== JSON.stringify(n.game) && "streamer role ID"));
bot.on("presence", (o, n) => bot[n.game && n.game.name === "Overwatch" && n.game.url ? "addMemberToRole" : "removeMemberFromRole"](n, overwatchRole));


bot.on("presence", (o, n) => bot[n.game && n.game.name === "Overwatch" && n.game.url ? "addMemberToRole" : "removeMemberFromRole"](n, bot.servers.find(s => s.members.get("id", n.id) && s.roles.get("name", overwatchServerRoleMap[s.id])).roles.get(overwatchServerRoleMap[s.id])));
where overwatchServerRoleMap is a map where {"serverID": "roleID"}

var streamingusers = [];
bot.on("presence", (userold, usernew) => {
	if(userold.game === usernew.game) return;

	if(usernew.game && usernew.game.type == 1 && usernew.game.name.indexOf("Overwatch") > -1) {
		for(let server of bot.servers) {
			let role = server.roles.get("name", "En Ondes");
			if(role) {
				bot.addMemberToRole(usernew, role, (err) => {
					if (err)
						log.error(`Could not add Streamer to server role on ${server.name} because of:\n${err}`);
				});
			}
		}
		streamingusers.push(usernew.id);
	} else if (streamingusers.indexOf(usernew.id)) {
		for(let server of bot.servers) {
			let role = server.roles.get("name", "En Ondes");
			bot.removeMemberFromRole(usernew, role);
			streamingusers.splice(streamingusers.indexOf(usernew.id), 1);
		}
	}
});*/



/*
		for(let i = 0; newusers.length; i++) {
			userlist.push(user.mention());
			newusers.remove(user);
		}
*/



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

			if(msg.content.startsWith(".prune")) {
				var msgcount = msg.content.split(" ")[1];
                bot.getChannelLogs(msg.channel, msgcount+1, (err, messages) => {
                    bot.deleteMessages(messages);
                    if(err) {
                    	console.log(err);
                    }
                });
			}
