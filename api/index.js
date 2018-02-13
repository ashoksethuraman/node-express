var express = require('express');
var router = express.Router();


// http://localhost:3000/
router.get('/', function(req, res, next) {
    res.status(200)
        .json({
            status: 'success',
            message: 'Live long and prosper!'
        });
});


//////////////////////
// Postgres queries
//////////////////////

var db = require('./queries');

// router.get('/api/starships', db.getAllStarships);
// router.get('/api/starships/:id', db.getStarship);
router.post('/api/signup', db.createUser);
router.post('/api/login', db.UserLogin);

router.get('api/logout', function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });

});

module.exports = router;