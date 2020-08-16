const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../app');
const app = express();
const HttpStatus = require('http-status-codes');


// Register a user
router.post('/register', (req, res) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err)
                return res.status(HttpStatus.EXPECTATION_FAILED).json({ error: err }).end();
            req.body.password = hash;
            req.app.locals.db.collection('users').insertOne(req.body, (error, result) => {
                if (error)
                    return res.status(HttpStatus.EXPECTATION_FAILED).json({ error: error }).end();
                if (result)
                    return res.status(HttpStatus.CREATED).json({ message: 'User Registered' }).end();
            });
        });
    });
    // req.app.locals.db.collection('users').createIndex({ username: 1 }, { unique: true });
});

// Login a user
router.post('/login', (req, res) => {
    req.app.locals.db.collection('users').findOne({ username: req.body.username }, (error, docs) => {
        if (error)
            return res.status(HttpStatus.EXPECTATION_FAILED).json({ error: error }).end();
        if (!docs)
            return res.status(HttpStatus.NOT_FOUND).json({ message: 'User Not found' }).end();
        if (docs) {
            bcrypt.compare(req.body.password, docs.password, (err, result) => {
                if (err)
                    return res.status(HttpStatus.EXPECTATION_FAILED).json({ error: err }).end();
                if (!result) {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Incorrect Password' }).end();
                } else {
                    let userInfo = {
                        username: docs.username,
                        name: docs.username
                    }
                    req.session['userInfo'] = userInfo;
                    return res.status(HttpStatus.ACCEPTED).json({ message: "Login Successful" }).end();
                }
            });
        }
    });
});

// User Logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    return res.status(HttpStatus.ACCEPTED).json({ message: "User logged out" }).end();
});
module.exports = router;