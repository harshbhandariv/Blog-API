// API for Blogz app
require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const corsOptions = require('./config/cors');
if (process.env.NODE_ENV == 'DEV')
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

//passport and session configuration
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
require('./config/passport');
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection, ttl: 1 * 60 * 60 * 12 })
}));
app.use(passport.initialize());
app.use(passport.session());

//Api Middleware
app.use('/api', api);

if (process.env.NODE_ENV == 'DEV') {
    const path = require('path');
    app.get('/', (req, res) => res.send("Expressed based Blog - API"));
}

if (process.env.NODE_ENV == 'PROD') {
    const path = require('path');
    app.use(express.static('blog/build'));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'blog', 'build', 'index.html')));
}

//Setting up port
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    console.log(`Jump to http://localhost:${PORT}`);
});