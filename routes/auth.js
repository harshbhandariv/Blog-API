const express = require('express');
const passport = require('passport');
const route = express.Router();


route.get('/github', (req, res, next) => {
    req.logOut();
    next();
}, passport.authenticate('github', { scope: ['user:email'] }));

route.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/api/auth/fail' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.status(200).send({
            action: "User GitHub Authentication successful"
        });
    }
);

// route.get('/facebook', (req, res, next) => {
//     req.logOut();
//     next();
// }, passport.authenticate('facebook'));

// route.get('/facebook/callback',
//     passport.authenticate('facebook', { failureRedirect: '/api/auth/fail' }),
//     function (req, res) {
//         // Successful authentication, redirect home.
//         res.status(200).send({
//             action: "User Facebook Authentication successful"
//         });
//     });

route.get('/fail', (req, res) => {
    res.status(200).send({
        action: "User Authentication failed"
    });
});

route.get('/logout', (req, res) => {
    req.logOut();
    res.status(200).send({
        action: "User successfully logged out"
    });
});

module.exports = route;