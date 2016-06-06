const Constants = require('./../constants.js'); 

const   about   = require('./admin/about.js'),
        echo    = require('./admin/echo.js');


exports.aliases = {
    "who"           : "about"
};

exports.commands = { 
    "about"         : about,
    "echo"          : echo
};
