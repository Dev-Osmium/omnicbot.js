const Constants = require('./../constants.js'); 

const   about   = require('./admin/about.js'),
        timer   = require('./admin/timer.js'),
        userlist   = require('./admin/userlist.js'),
        echo    = require('./util/echo.js'),
        info    = require('./util/info.js'),
        play    = require('./util/play.js'),
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
    "rename"        : rename,
    "userlist"      : userlist,
    "timer"         : timer
};
