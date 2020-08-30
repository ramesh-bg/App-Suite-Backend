const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
require('dotenv').config();
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
// Express settings
const app = express();
const auth = require('./middlewares/auth.middleware');
const routes = require('./routes/route');

let db;


const corsConfig = cors({
    origin: process.env.UI_HOST_URL,
    optionsSuccessStatus: 200
});
app.use(corsConfig);

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
MongoClient.connect(process.env.DBHOST, mongoOptions, (error, client) => {
    if (error) throw error;
    db = client.db(client.s.options.dbName);
    console.log('Connected to database  : ', client.s.options.dbName);
    app.locals.db = db;
    app.listen(process.env.PORT, () => {
        console.log('Port Running : ' + process.env.PORT)
    });
});


app.use(session({
    name: process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        url: process.env.DBHOST
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * Number(process.env.SESSION_LIFETIME),
        sameSite: true,
        secure: process.env.NODE_ENV === 'local' ? false : true
    }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/', routes);

app.get('/', (req, res) => {
    res.send(`
    <h2>Welcome</h2>
    `);
});