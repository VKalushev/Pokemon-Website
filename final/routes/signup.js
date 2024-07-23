const express = require('express');
const { MongoDBNamespace } = require('mongodb');
const router = express.Router();
const CryptoJS = require('crypto-js');
const {getDb} = require('../database');

async function isUsernameTaken(username) {
   	const db = getDb();
    
    try {
        // Find a user with the username inputted
        const findQuery = db.collection('users').findOne({username: username});
        const user = await findQuery.then(result => {return result});

        if (user !== null) {
            return true;
        } else {
            return false;
        }
    } catch(err) {
        console.error(err);
        return true;
    }
}

function arePasswordsEqual(password, passwordCheck) {
    if (password === passwordCheck) {
        return true;
    } else {
        return false;
    }
}

function hashPassword(password) {
    let hash = {
        hash: '',
        salt: ''
    };

    // Create a hash and salt for the password inputted
    hash.salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);

    const key = CryptoJS.PBKDF2(password, hash.salt, {keySize: 64, iterations: 10000});
    hash.hash = CryptoJS.HmacSHA512(password, key).toString(CryptoJS.enc.Hex);

    return hash;
}

router.get('/', (req, res) => {
    res.render('signup', {
        errors: {
            isUsernameTaken: false,
            arePasswordsEqual: true
        }
    });
});

router.post('/', async(req, res, next) => {
    // Signup form
    let body = req.body;

    const isUsernameUsed = await isUsernameTaken(body.username).then(data => {return data;});
    console.log("Username: ", isUsernameUsed);
    const arePasswordsTheSame = arePasswordsEqual(body.password, body.passwordCheck);

    let isValid = !isUsernameUsed && arePasswordsTheSame;

    if (isValid) {
        // Hash the password...
        let hash = hashPassword(body.password);

        const db = getDb();
        
        // Insert a new user in the users collection
        db.collection('users').insertOne({
            "username": req.body.username,
            "description": "Battling with my Pokemon",
            "hash": hash.hash,
            "salt": hash.salt,
        }, (err, result) => {
            // Re-render the page with error values passes to the EJS file
            db.collection('leaderboard').insertOne({username: req.body.username, wins: 0, loses: 0, rankpoints: 1000});
            res.render('signin', {errors: {isPasswordIncorrect: false, isUsernameIncorrect: false}, user: req.session.user});
        });
    } else {
        res.render('signup', {
            errors: {
                isUsernameTaken: isUsernameUsed,
                arePasswordsEqual: arePasswordsTheSame
            },
            user: req.session.user
        }); // Render the Signup Page
    }
});

module.exports = router;
