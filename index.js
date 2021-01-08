// API for Blogz app
require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

let corsOptions = {
    origin: process.env.FRONTEND_URI,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

//Setting up mongoose connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected to mongodb");
}).catch((err) => {
    console.log("Error connecting to MongoDB", err);
});

//Setting up morgan
if (process.env.NODE_ENV == "DEV")
    app.use(morgan(process.env.MORGAN_LOGGING_TYPE_DEV));
else if (process.env.NODE_ENV == "PROD")
    app.use(morgan(process.env.MORGAN_LOGGING_TYPE_PROD));
const api = require('./api');

//Setting up middleware to parse req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//passport configuration
const passport = require('passport');
const session = require('express-session');
const { response } = require('express');
const MongoStore = require('connect-mongo')(session);
require('./config/passport');
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection, ttl: 14 * 60 * 60 * 12 })
}));
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV == 'DEV') {
    app.get('/', (req, res) => {
        if (req.user) {
            res.send({
                user: req.user
            })
        } else {
            res.send({
                message: "Express - based API for a Blog App"
            })
        }
    })
}

// API middleware
app.use('/api', api);
const path = require('path');
if (process.env.NODE_ENV == 'PROD') {
    app.get('*', express.static('bloggz/build'));
    app.get('/*', (req, res) => res.sendFile(path.join(__dirname, 'bloggz', 'build', 'index.html')));
}

//Setting up port
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    console.log(`Jump to http://localhost:${PORT}`);
});