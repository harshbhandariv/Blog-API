const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../model/user');

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/api/auth/github/callback`
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            console.log(profile);
            User.findOne({ githubId: profile.id }, async function (err, user) {
                if (err) return done(err, user);
                if (user == null) {
                    user = await User({
                        name: profile.displayName,
                        username: profile.username,
                        email: profile.emails[0].value,
                        posts: [],
                        friends: [],
                        profilePhoto: profile.photos[0].value,
                        githubId: profile.id
                    }).save();
                }
                return done(err, user);
            });
        }
        catch (error) {
            done(error, null);
        }
    }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            console.log(profile);
            // User.findOne({ facebookId: profile.id }, async function (err, user) {
            //     if (err) return done(err, user);
            //     if (user == null) {
            //         user = await User({
            //             name: profile.displayName,
            //             username: profile.username,
            //             email: profile.emails[0].value,
            //             posts: [],
            //             friends: [],
            //             profilePhoto: profile.photos[0].value,
            //             githubId: profile.id
            //         }).save();
            //     }
            //     return done(err, user);
            // });
        }
        catch (error) {
            cb(error, null);
        }
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});