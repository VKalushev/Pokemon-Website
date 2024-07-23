const express = require('express');
const app = express();
const path = require('path')
const dotenv = require('dotenv');
const session = require('express-session');
const { MongoClient } = require("mongodb");
const MongoStore = require('connect-mongo');

const {connectDb, getDb} = require("./database");
dotenv.config({ path: './.env' });

const cookie_secret = process.env.COOKIE_SECRET | 'wYQGTDSMtIIo8zXl';
var mdb;

/* App Properties */
const port = 8080;

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

/* Database Setup */
const url = "mongodb+srv://test:test@cluster0.0zhdl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000
    },
    store: new MongoStore({
         mongoUrl: "mongodb+srv://test:test@cluster0.0zhdl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
         dbName: 'pokeprime',
         ttl: 7 * 24 * 60 * 60,
         crypto: {
            secret: cookie_secret
        }
    })
}));

/* Routes */
const homeRouter = require('./routes/home');
const pokemonRouter = require('./routes/pokemon');
const itemRouter = require('./routes/item');
const searchRouter = require('./routes/search');
const signinRouter = require('./routes/signin');
const signupRouter = require('./routes/signup');
const userProfileRouter = require('./routes/userProfile');
const userSettingsRouter = require('./routes/userSettings');
const battleRouter = require("./routes/battle");
const leaderboardRouter = require("./routes/leaderboard");
const error404Router = require("./routes/error404");

// Use all the routers imported
app.use('/', homeRouter);
app.use('/pokemon', pokemonRouter);
app.use('/item', itemRouter);
app.use('/search', searchRouter);
app.use('/signin', signinRouter);
app.use('/signup', signupRouter);
app.use('/', userProfileRouter);
app.use('/', userSettingsRouter);
app.use('/battle', battleRouter);
app.use('/leaderboard', leaderboardRouter);
app.use('/404', error404Router);

// Redirect all pages that don't have a route to the 404 route
app.get('*', async(req, res) => {
    res.redirect('/404');
});

// Connect to MongoDB
MongoClient.connect(url, (err, client) => {
    if (err) throw err;
    console.log("Database connected.");
    mdb = client.db('pokeprime');
    connectDb(mdb);

    // Add in a test collection
    let pikachus = mdb.collection("pokethings").find({ "name": "Pikachu" }).toArray((err, result) => {
        if (result.length == 0) {
            mdb.collection("pokethings").insertOne({ "name": "Pikachu", "hp": 9000 }, (err, res) => {
                if (err) throw err;
                console.log("document inserted into pokethings");
            });
        }
    });

    // Start the app
    app.listen(port, startApp);
});

function startApp() {
    console.log("PokePrime is running at http://localhost:" + port);
}
