'use strict';
const HttpStatus = require('http-status-codes');
require('dotenv').config();

module.exports.sessionAuth = (req, res, next) => {
    if (req.session.userInfo && req.cookies[process.env.SESSION_NAME])
        return next();
    else {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' }).end();
    }
};