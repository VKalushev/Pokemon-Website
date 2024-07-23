const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('error404', {user: req.session.user || null});
});

module.exports = router;