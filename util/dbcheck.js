const Constants = require('./../constants.js');

const config = require(Constants.Util.CONFIG);
const log = require(Constants.Util.LOGGER);
const jsonfile = require('jsonfile');
var serverSettings;

// Getting server settings on start
jsonfile.readFile(Constants.Database.SERVER, (err, obj) => {
	if(!err)
		serverSettings = obj;
	else 
		log.error(err);
});

var syncServerSettings = (newServerSettings) => {
    jsonfile.writeFile(Constants.Database.SERVERBAK, serverSettings);
    
	jsonfile.writeFile(Constants.Database.SERVER, newServerSettings, err => {
		if(err) log.error(err);
		else serverSettings = newServerSettings;
	});
};

module.exports = {
	serverSettings: () => {
		return serverSettings;
	},
	syncServerSettings: syncServerSettings,
    createServer: (oServer) => {
    	if(!serverSettings[oServer.id]) {
    		serverSettings[oServer.id] = {
				name: oServer.name,
				tags: {},
				settings: {
					setup: false,
					logBans: false,
					greet: {
						text: "Welcome to our server, {user}",
						activated: false
					}
				}
			};

			syncServerSettings(serverSettings);
    	}
    }
};