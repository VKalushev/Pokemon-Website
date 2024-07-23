const express = require('express');
const router = express.Router();
const CryptoJS = require('crypto-js');
const {getDb} = require('../database');

router.get('/', (req, res) => {
    res.render('signin', {errors: {isPasswordIncorrect: false, isUsernameIncorrect: false, user: req.session.user || null}}); // Render the sign-in page
});

function checkPasswords(dbHash, dbSalt, password) {
    let hash = {
        hash: '',
        salt: ''
    };

    hash.salt = dbSalt.toString(CryptoJS.enc.Hex);
    
    // Hash the inputted password
    const key = CryptoJS.PBKDF2(password, hash.salt, {keySize: 64, iterations: 10000});
    hash.hash = CryptoJS.HmacSHA512(password, key).toString(CryptoJS.enc.Hex);

    // Compare the hash of the inputted password and the password from the database
    if (hash.hash !== dbHash) {
        return false;
    } else {
        return true;
    }
}

router.post('/', async(req, res) => {
    let body = req.body;

    const db = getDb();

    const username = body.username || '';
    const password = body.password || '';

    let isLoggedIn = false;

    let errors = {
        isPasswordIncorrect: true,
        isUsernameIncorrect: true
    };

    if (username !== '' && password !== '') {
        try {
            // Find a user with the username provided
            const findQuery = db.collection('users').findOne({username: username});
            const user = await findQuery.then(result => {return result});

            // If a user with that username exists
            if (user !== null) {
                errors.isUsernameIncorrect = false;

                // Check if the password provided is the right password
                const passwordCheck = checkPasswords(user.hash, user.salt, password);
                if (passwordCheck) {
                    isLoggedIn = true;
                    errors.isPasswordIncorrect = false;
                
                    req.session.user = {userId: user._id, username: user.username} // Create a new user session

                    try {
                        req.session.save(); // Save the user session
                    } catch(err) {
                        console.log(err);
                    }
                }
            }
        } catch(err) {
            console.log(err);
        }
    }

    if (isLoggedIn) {
        res.redirect('/'); // Redirect to the home page
    } else {
        res.render('signin', {errors: errors, user: req.session.user}); // Render the Signin page
    }
});

module.exports = router;
