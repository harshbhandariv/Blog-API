const FRONTEND_URI = new URL(process.env.FRONTEND_URI);
module.exports = {
    origin: FRONTEND_URI.origin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};