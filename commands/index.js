const Constants = require('./../constants.js'); 

const   about   = require('./admin/about.js'),
        timer   = require('./admin/timer.js'),
        userlist   = require('./admin/userlist.js'),
        _eval   = require('./admin/eval.js'),
        echo    = require('./util/echo.js'),
        stats    = require('./util/stats.js'),
        info    = require('./util/info.js'),
        play    = require('./util/play.js'),
        bnet    = require('./util/bnet.js'),
        rename    = require('./admin/rename.js'),
        reload    = require('./admin/reload.js');


exports.aliases = {
    "who"           : "about",
    "youtube"       : "play",
    "nick"          : "rename"
};

exports.commands = { 
    "about"         : about,
    "echo"          : echo,
    "reload"        : reload,
    "info"          : info,
    "play"          : play,
    "bnet"          : bnet,
    "rename"        : rename,
    "stats"        : stats,
    "eval"         : _eval,
    "userlist"      : userlist,
    "timer"         : timer
};
