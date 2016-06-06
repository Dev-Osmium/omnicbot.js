"use strict";

const Database = {
    SERVER: __dirname + "/runfiles/servers.json",
    SERVERBAK: __dirname + "/runfiles/servers.json.bak",
    SESSION: __dirname + "/runfiles/session.json"
};

const Util = {
    LOGGER: __dirname + "/util/logger.js",
    CONFIG: __dirname + "/runfiles/config.json"
};


module.exports = {
    Database: Database,
    Util: Util
};