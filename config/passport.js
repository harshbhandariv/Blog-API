const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../model/user');

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/api/auth/github/callback`
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            User.findOne({ githubId: profile.id }, async function (err, user) {
                if (err) return done(err, null);
                if (user == null) {
                    user = await new User({
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

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});