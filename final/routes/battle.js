const e = require('express');
const express = require('express');
const router = express.Router();
const {getDb} = require('../database');
const axios = require('axios');

// Function that returns the roster of a specific user with pokemonName,slotNum and imgSrc
async function getRosterForPlayer(user) {
    const db = getDb();
    const userMainPokemon = db.collection('roster').find({username: user}).toArray();
    const userMainPokemonResult = await userMainPokemon.then(result => {return result});
    let userRoster = [];
    
    for (let i=0; i < 5; i++) {
        let item = {};
        
        for (let j=0; j < userMainPokemonResult.length; j++) {
            const result = userMainPokemonResult[j];
            if (result.pokemonName !== null && result.slotNum == i+1) {    
                const pokemonData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${result.pokemonName.toLowerCase()}`);

                item = {
                    pokemonName: result.pokemonName,
                    slotNum: result.slotNum,
                    imgSrc: pokemonData.data.sprites.front_default
                };
            }
        }
        userRoster.push(item);
    }

    return userRoster;
}

//On Load of the page we the the user information, his roster and his Ranking information
router.get('/', async(req, res) => {
    try {
        if (req.session.user) {
            const db = getDb();
            const user = req.session.user.username;

            let usercScoreResults = await db.collection('leaderboard').findOne({username: user}).then(result => {return result});
            let userRoster = await getRosterForPlayer(user).then(result => {return result});
            
            let opponentRoster = null;
            let opponentScoreResults = null;
            
            res.render('battle', {user: req.session.user || null,userRoster: userRoster,usercScoreResults: usercScoreResults, 
                                    opponentRoster: opponentRoster, opponentScoreResults: opponentScoreResults});
        } else {
            res.redirect('/signup');
        }
    } catch(err) {
        console.error(err);
        res.redirect('/');
    }
});

router.post('/', async(req, res) => {
    try {
        const db = getDb(); 
        const user = req.session.user.username;
        
        const pokemonRosterQuery = db.collection('roster').find({}).toArray();
        const pokemonRosterResults = await pokemonRosterQuery.then(result => {return result});
        
        let opponentRosterWeight = 0;
        let playerRosterWeight = 0;
        let randomID = Math.floor(Math.random() * pokemonRosterResults.length);
        let findOpponent = pokemonRosterResults[randomID];
        
        // While loop to make sure that the opponent name that we've taken is not the user name
        while(findOpponent.username === user){
            randomID = Math.floor(Math.random() * pokemonRosterResults.length);
            findOpponent = pokemonRosterResults[randomID];
        }
        
        //For loop to get the roster for the opponent and his roster weight
        const opponentRosterCollection = await getRosterForPlayer(findOpponent.username).then(result => {return result});
        for (let i = 0; i< opponentRosterCollection.length;i++ ){
            const result = opponentRosterCollection[i];
            let weight = 0;

            if(result.pokemonName != null){
                const pokemonData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${result.pokemonName.toLowerCase()}`);
                weight += pokemonData.data.stats[0].base_stat + pokemonData.data.stats[1].base_stat
                + pokemonData.data.stats[2].base_stat + pokemonData.data.stats[3].base_stat;
                opponentRosterWeight += weight
            }
        }
        
        //For loop to get the roster for the user and his roster weight
        const userRosterCollection = await getRosterForPlayer(user).then(result => {return result});
        for (let i = 0; i< userRosterCollection.length;i++ ){
            const result = userRosterCollection[i];
            let weight = 0;
            
            if(result.pokemonName != null){
                const pokemonData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${result.pokemonName.toLowerCase()}`);
                weight += pokemonData.data.stats[0].base_stat + pokemonData.data.stats[1].base_stat
                + pokemonData.data.stats[2].base_stat + pokemonData.data.stats[3].base_stat;
                playerRosterWeight += weight;
            }
        }
        
        // Some maths so we can get % chances of winning the battle between the user and the opponent
        let wholeWeight = playerRosterWeight + opponentRosterWeight;
        let userWinRatio = (playerRosterWeight*100)/wholeWeight;
        let opponentRatio = (opponentRosterWeight*100)/wholeWeight;
        let winner = Math.floor(Math.random() * (opponentRatio + userWinRatio)) + 1;
        let winnerRatio = 0;
        
        let usercScoreResults = await db.collection('leaderboard').findOne({username: user}).then(result => {return result});
        let opponentScoreResults = await db.collection('leaderboard').findOne({username: findOpponent.username}).then(result => {return result});
        

        if(usercScoreResults !== null && opponentScoreResults !== null){
            //With 'winner' we check if the number is in the range of the userWinRatio if it is not he hasn't won
            //Quick example : userWinRatio = 80% and opponent 20% -> if the number is bigger than 80%
            // for example 91% that means that we are in the range for the opponent win condition
            if(winner <= userWinRatio){
                winner = user;
                winnerRatio = userWinRatio;
                await db.collection('leaderboard').updateOne({username: user, loses: usercScoreResults.loses}, 
                    {$set: {wins: usercScoreResults.wins + 1, rankpoints: usercScoreResults.rankpoints + 20}});
        
                await db.collection('leaderboard').updateOne({username: findOpponent.username, wins: opponentScoreResults.wins}, 
                    {$set: {loses: opponentScoreResults.loses + 1, rankpoints: opponentScoreResults.rankpoints - 20}});
            } else {
                winner = findOpponent.username;
                winnerRatio = opponentRatio;
                await db.collection('leaderboard').updateOne({username: findOpponent.username, loses: opponentScoreResults.loses}, 
                    {$set: {wins: opponentScoreResults.wins + 1, rankpoints: opponentScoreResults.rankpoints + 20}});
        
                await db.collection('leaderboard').updateOne({username: user, wins: usercScoreResults.wins}, 
                    {$set: {loses: usercScoreResults.loses + 1, rankpoints: usercScoreResults.rankpoints - 20}});
            }
        }
      
        //Getting the leaderboard information for both users again so we have it updated
        await db.collection('matchHistory').insertOne({username: user, opponentname: findOpponent.username, winner: winner, winchances: winnerRatio});
        usercScoreResults = await db.collection('leaderboard').findOne({username: user}).then(result => {return result});
        opponentScoreResults = await db.collection('leaderboard').findOne({username: findOpponent.username}).then(result => {return result});
        res.render('battle', {user: req.session.user, opponentname: findOpponent.username, winner: winner, userRoster: userRosterCollection, 
                                opponentRoster: opponentRosterCollection, usercScoreResults: usercScoreResults, opponentScoreResults: opponentScoreResults,
                                userWinRatio: userWinRatio, opponentRatio: opponentRatio});
    } catch(err) {
        console.error(err);
        res.redirect('/');
    }
});


module.exports = router;