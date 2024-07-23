const e = require("express");
const express = require("express");
const router = express.Router();
const { getDb } = require("../database");
const axios = require("axios");

//Pushing some variables for the leaderboard.ejs so we can generate the actual leaderboard
router.get("/", async (req, res) => {
    try {
        if (req.session.user) {
            const db = getDb(); // Get an instance of the connected database
            const user = req.session.user.username;

            const usersCollection = db
            .collection("leaderboard")
            .find({})
            .sort({ rankpoints: -1 })
            .toArray();

            const users = await usersCollection.then((result) => {
            return result;
            });

            const userScore = db.collection("leaderboard").findOne({ username: user });
            const usercScoreResults = await userScore.then((result) => {
            return result;
            });

            res.render("leaderboard", { user: req.session.user, leaderboard: users, result: usercScoreResults });
        } else {
            res.redirect('/signup');
        }
    } catch(err) {
        console.error(err);
        res.redirect('/');
    }
});

module.exports = router;
