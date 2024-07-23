const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('item', {user: req.session.user || null}); // Render the item page
});

module.exports = router;