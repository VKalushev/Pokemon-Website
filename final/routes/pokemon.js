const express = require('express');
const router = express.Router();
const {getDb} = require('../database');

router.get('/', (req, res) => {
    res.render('pokemon', {user: req.session.user || null}); // Render the Pokemon page
});

// Update the user's Pokemon roster
router.post('/', async(req, res) => {
    try {
        const db = getDb();

        const pokemonName = req.body.pokemonName;
        const slotNum = req.body.slotNum;
        const user = req.session.user;

        // Get the user's current roster
        const pokemonRosterQuery = db.collection('roster').find({username: user.username, slotNum: slotNum}).toArray();
        const pokemonRosterResults = await pokemonRosterQuery.then(result => {return result});

        if (pokemonRosterResults.length > 0) {
            // Update record...
            const pokemonRosterUpdateQuery = db.collection('roster').updateOne({username: user.username, slotNum: slotNum}, {$set: {pokemonName: pokemonName}});
            const pokemonRosterUpdateResult = await pokemonRosterUpdateQuery.then(result => {return result});
        } else {
            // Insert new record...
            const pokemonRosterInsertQuery = db.collection('roster').insertOne({username: user.username, pokemonName: pokemonName, slotNum: slotNum});
            const pokemonRosterInsertResult = await pokemonRosterInsertQuery.then(result => {return result});
        }
    } catch(err) {
        console.error(err);
    }
});

module.exports = router;