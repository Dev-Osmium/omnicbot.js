"use strict"; 

const Discord = require('discord.js');
const uuid = require("node-uuid");
const moment = require("moment");

const Constants = require('../constants.js'); 

const config    = require(Constants.Util.CONFIG);
const log = require(Constants.Util.LOGGER);

const knex = require('knex')(config.pgconf);

var timers = new Discord.Cache();

module.exports = function(bot){
    var module = {};
    
    module.test = function() {
        log.info("Module TIMERS is functional.");
    };

    module.add = function(name, interval, message, channel) {
        
        let timerUUID = uuid.v4();
        
        let tmpTimer = setInterval(function() { 
        	bot.sendMessage(channel, message);
        }, interval * 1000);
        let timertemp = {"id": timerUUID, "name": name, "interval": interval, "channel": channel, "timer" : tmpTimer};
        timers.add(timertemp);
        
        let query = {"name": name, "message": message, "channel": channel, "interval": interval};
		knex.insert(query, 'id').into('timers')
		.catch( (error) => {
			log.error(error);
		})
		.then( (id) => {
		  log.info("Timer Added: " + id + ", query: " + JSON.stringify(query));	
		  return true;
		});

    };

    module.stop = function(name, channel) {
        knex.select("*").table("timers").where({ "name": name, "channel": channel})
        .then( rows => {
            knex('timers').where('id', rows[0].id).del();
            let stopTimer = timers.filter(t => t.name===name&&t.channel===channel);
            clearInterval(stopTimer.timer);
            timers.remove(stopTimer);
        });
    };
    
    module.loadall = function() {
        knex.select("*").table("timers")
	    .then( rows => {
	        rows.map(r => {
    		    bot.sendMessage("189542410622205952", `Timer ${r.name} a été rétabli après un redémarrage du bot.`);
	        });
	    });
    };

    return module;
};