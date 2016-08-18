const Constants = require('./../constants.js'); 

const   about   = require('./admin/about.js'),
        timer   = require('./admin/timer.js'),
        userlist   = require('./admin/userlist.js'),
        _eval   = require('./admin/eval.js'),
        config = require('./config/index.js'),
        echo    = require('./util/echo.js'),
        stats    = require('./util/stats.js'),
        tag    = require('./util/info.js'),
        play    = require('./util/play.js'),
        team    = require('./fun/team.js'),
        //bnet    = require('./util/bnet.js'),
        lastseen   = require('./util/lastseen.js'),
        rename    = require('./admin/rename.js'),
        reload    = require('./admin/reload.js');

exports.aliases = {
    "who"           : "about",
    "youtube"       : "play",
    "nick"          : "rename"
};

exports.commands = { 
    "about"         : about,
    "timer"         : timer,
    "userlist"      : userlist,
    "eval"          : _eval,
    "config"       : config,
    "echo"          : echo,
    "stats"         : stats,
    "tag"           : tag,
    "play"          : play,
    "team"          : team,
    //"bnet"          : bnet,
    "rename"        : rename,
    "lastseen"      : lastseen,
    "reload"        : reload
};
