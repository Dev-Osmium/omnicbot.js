"use strict"; 

const Constants = require('./../../constants.js'); 
const Discord = require("discord.js");

const Command   = require('./../Command.js');
const config    = require(Constants.Util.CONFIG);

const sheet = require('google-spreadsheet');
const doc = new sheet('1GKZrnPBK-rRq_tCRZrHrxr8RJ3XNdsU1B2baUPwMuhQ');

var rowdata = new Discord.Cache();
doc.getRows(1, {"offset": 3}, (err, rows) => {
   if(err) console.log(err);
   rows.map(row => rowdata.add(row));
});

const bnet = new Command('Retrieves Battle.net Info + MasterOverwatch Profile Link.', '', 0, null, (bot, msg, suffix) => {
    
    if(!suffix) {
        bot.reply(msg, "Aucun membre spécifié. Utilisez un @mention pour rechercher: `.bnet @LuckyEvie`");
    } else {
        let user = msg.mentions.length === 1 ? msg.mentions[0] : msg.server.members.get(member => msg.server.detailsOfUser(member).nick === suffix),
            bnetTag = null,
            nickname = msg.server.detailsOfUser(user).nick;
        if(!user) {
            bot.sendMessage(msg, `${suffix} n'est pas dans la liste des membres du serveur, d'après ce que je vois... Essayez avec un @Mention!`);
            return;
        }
        if(!nickname) nickname = user.username;
        if(nickname && nickname.indexOf("#") > -1) {
            bnetTag = nickname;
        } else if(nickname) {
           let userresult = rowdata.get("_cpzh4", nickname);
           if(userresult) {
               bnetTag = userresult["_cre1l"];
           }
        }
        
        if(bnetTag) {
            bot.sendMessage(msg, `${nickname} a le tag bnet **${bnetTag}**. Voir son profil: http://masteroverwatch.com/profile/pc/us/${bnetTag.replace("#", "-")}`);
        } else {
            bot.sendMessage(msg, `Aucun résultat trouvé pour ${nickname} dans la liste des membres. Désolée!`);
        }
    }
});

module.exports = bnet;
