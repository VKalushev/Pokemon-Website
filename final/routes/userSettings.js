const express = require('express');
const router = express.Router();
const {getDb} = require("../database");
const CryptoJS = require('crypto-js');

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

router.get('/user/settings', (req, res) => {
    if (req.session.user) {
        res.render('userSettings', {user: req.session.user}); // Render the settings page if there is a user session
    } else {
        res.redirect('/signup'); // Redirect to the signup page if there is no user session
    }
});

router.post('/user/settings/description', async(req, res) => {
    const db = getDb();
    const user = req.session.user;
    const description = req.body.description;

    if (description && description !== "") {
        try {
            // Update the user entry with the username from the user session, giving a new description
            const updateQuery = db.collection('users').updateOne({username: user.username} ,{$set: {description: description}});
            const userResult = await updateQuery.then(result => {return result});
        } catch(err) {
            console.error(err);
        }
    }

    res.json({});
});

router.post('/user/settings/password', async(req, res) => {
    const db = getDb();
    const user = req.session.user;
    const password = req.body.password;

    if (password) {
        // Hash the new password
        let hash = hashPassword(password);
        
        try {
            // Update the user entry with the username from the user session, giving a new password
            const updateQuery = db.collection('users').updateOne({username: user.username} ,{$set: {hash: hash.hash, salt: hash.salt}});
            const userResult = await updateQuery.then(result => {return result});
        } catch(err) {
            console.error(err);
        }
    }

    res.json({});
});

router.post('/user/settings/history', async(req, res) => {
    const db = getDb();
    const user = req.session.user;

    try {
        // Delete all records in the search history collection that have the user session's user id
        const searchHistoryQuery = db.collection('searchHistory').deleteMany({userId: user.userId});
        await searchHistoryQuery.then(result => {return result});
        res.json({success: true});
    } catch(err) {
        console.error(err);
        res.json({success: false});
    }
});

module.exports = router;