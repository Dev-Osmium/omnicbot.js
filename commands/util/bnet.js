"use strict"; 

const Constants = require('./../../constants.js'); 

const Command   = require('./../Command.js');
const config    = require(Constants.Util.CONFIG);

const sheet = require('google-spreadsheet');
const doc = new sheet('1GKZrnPBK-rRq_tCRZrHrxr8RJ3XNdsU1B2baUPwMuhQ');

const bnet = new Command('Retrieves Battle.net Info + MasterOverwatch Profile Link.', '', 0, null, (bot, msg, suffix) => {
    doc.getInfo( (err, info) => {
        if(err) console.log(err);
        //console.log(info.title);
    });
    
    if(!suffix) {
        bot.reply(msg, "Aucun membre spécifié. Utilisez un @mention pour rechercher: `.bnet @LuckyEvie`");
    } else {
        let user = msg.mentions.length === 1 ? msg.mentions[0] : msg.server.members.get(member => msg.server.detailsOfUser(member).nick === suffix),
            bnetTag = null,
            nickname = msg.server.detailsOfUser(user).nick;
        if(!user) {
            bot.sendMessage(msg, `Aucun résultat trouvé pour ${suffix}. Recherche sur la liste des membres à venir!`);
            return;
        }
        if(!nickname) nickname = user.username;
        if(nickname && nickname.indexOf("#") > -1) {
            bnetTag = nickname;
        } else {
        }
        
        if(bnetTag) {
            bot.sendMessage(msg, `${nickname} a le tag bnet **${bnetTag}**. Voir son profil: http://masteroverwatch.com/profile/pc/us/${bnetTag.replace("#", "-")}`);
        } else {
            bot.sendMessage(msg, `Aucun résultat trouvé pour ${nickname}. Recherche sur la liste des membres à venir!`);
        }
    }
});

module.exports = bnet;
