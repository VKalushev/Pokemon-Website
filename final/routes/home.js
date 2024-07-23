const express = require('express');
const router = express.Router();
const {getDb} = require('../database');
const url = require('url');
const { resourceLimits } = require('worker_threads');

router.get('/', (req, res) => {
    res.render('index', {user: req.session.user || null}); // Render the home page
});

router.post('/search', async(req, res) => {
    const body = req.body;
    const searchTerm = body.searchTerm || '';

    /* Send search term to a table */
    const user = req.session.user;

    if (user) {
        try {
            const db = getDb();
            // Post what was search to the search history collection
            const current_datetime = Date.now(); // Get the current time
            const searchHistoryQuery = db.collection('searchHistory').insertOne({userId: user.userId, timestamp: current_datetime, search_term: searchTerm});
            const searchResult = await searchHistoryQuery.then(result => {return result});
        } catch(err) {
            console.error(err);
        }
    }
});

router.get('/search/history', async(req, res) => {
    /* Send search term to a table */
    const user = req.session.user;
    let searchHistory = [];
	
    if (user) {
        try {
            const db = getDb();
            // Sort by most recent search
            const searchHistoryQuery = db.collection('searchHistory').find({userId: user.userId}).sort({timestamp: -1}).toArray();
            const searchResults = await searchHistoryQuery.then(result => {return result});
	            
            searchResults.forEach(result => {
                searchHistory.push({"searchTerm": result.search_term, "timestamp": result.timestamp});
            });
        } catch(err) {
            console.log("Could not find search history in collection");
        }
    }

    // Return this as JSON since this gets used on the frontend
    res.json({searchHistory: searchHistory});
});

router.get('/signout', (req, res) => {
    req.session.destroy(); // Remove the user session, signing them out

    res.redirect('/'); // Redirect back to the home page
});

module.exports = router;