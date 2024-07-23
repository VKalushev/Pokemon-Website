const express = require('express');
const router = express.Router();
const {getDb} = require('../database');
const axios = require('axios');

router.get('/user/:username/profile', async(req, res) => {
    try {
        const db = getDb();
        const username = req.params.username;

        // Find the user based on the username in the url
        const findQuery = db.collection('users').findOne({username: username});
        const user = await findQuery.then(result => {return result});

        const description = user.description;

        // Find the user's roster
        const pokemonRosterQuery = db.collection('roster').find({username: username}).toArray();
        const pokemonRosterResults = await pokemonRosterQuery.then(result => {return result});
        let roster = [];

        // Get the Pokemon data from PokeAPI via axios for each pokemon in the roster
        for (let i=0; i < 5; i++) {
            let item = {};
            
            for (let j=0; j < pokemonRosterResults.length; j++) {
                const result = pokemonRosterResults[j];

                if (result.slotNum == i+1) {    
                    const pokemonData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${result.pokemonName.toLowerCase()}`);

                    item = {
                        pokemonName: result.pokemonName,
                        slotNum: result.slotNum,
                        imgSrc: pokemonData.data.sprites.front_default
                    };
                }
            }

            roster.push(item);
        }

        res.render('userProfile', {username: req.params.username, description: description, roster: roster, user: req.session.user});
    } catch(err) {
        console.log(err);
        res.render('userProfile', {username: req.params.username, description: "", roster: [], user: req.session.user});
    }
});

module.exports = router;