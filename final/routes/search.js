const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('search', {user: req.session.user || null}); // Render the search page
});

module.exports = router;