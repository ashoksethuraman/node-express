var promise = require('bluebird');
const bcrypt = require('bcrypt');
var crypto = require('crypto');
var localStorage = require('localStorage');
const TokenGenerator = require('uuid-token-generator');



const token = new TokenGenerator(512, TokenGenerator.BASE62);






var options = {
    // Initialization Options
    promiseLib: promise
};

var pgp = require('pg-promise')(options);

var connectionString = "postgres://postgres:postgres@localhost/nodejsassignment";
// var connectionString = 'postgres://localhost:5432/nodeJSAssignment'; // nodeJSAssignment is an example database name
var db = pgp(connectionString);


/////////////////////
// Query Functions
/////////////////////

function getAllStarships(req, res, next) {
    db.any('SELECT * FROM starships')
        .then(function(data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved all starships'
                });
        })
        .catch(function(err) {
            return next(err);
        });
}

function UserLogin(req, res, next) {
    var status;
    var query = "SELECT * FROM identity_user where username='" + req.body.username + "'";
    console.log(query)
    db.one(query)
        .then(function(data) {
            var response = JSON.parse(JSON.stringify(data));
            console.log(response.password);
            hash = response.password;
            if (bcrypt.compareSync(req.body.password, hash)) {
                status = 'authentication successfully';
                localStorage.setItem('token', token.generate());
                
            } else {
                status = 'authentication failed';
            }

            res.status(200)
                .json({
                    message: status,
                    userId : response.id,
                    token:localStorage.getItem('token')
                });

        })
        .catch(function(err) {
            return next('authentication failed');
        });
}

function createUser(req, res, next) {
    // req.body.launched = parseInt(req.body.launched);
    var friend_id = req.body.friendIds;
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    db.query('INSERT INTO identity_user(username, password) values(${username}, ${password})  RETURNING id ', req.body)
        .then(data => {
            var response = JSON.parse(JSON.stringify(data[0]));
            friend_id.forEach(function(id) {
                console.log(response.id, id)
                db.query("INSERT INTO user_friends (user_id, friend_id) values('" + response.id + "', '" + id + "')");

            })
            res.send({
                message: 'registry success'
            });
        })
        .catch(function(err) {
            console.log(err);
            return next(err);
        });
}

// function updateStarship(req, res, next) {
//   db.none('UPDATE starships SET name=$1, registry=$2, affiliation=$3, launched=$4, class=$5, captain=$6 where id=$7',
//     [req.body.name, req.body.registry, req.body.affiliation, parseInt(req.body.launched), req.body.class, parseInt(req.params.id)])
//     .then(function () {
//       res.status(200)
//         .json({
//           status: 'success',
//           message: 'Updated starship'
//         });
//     })
//     .catch(function (err) {
//       return next(err);
//     });
// }

// function removeStarship(req, res, next) {
//   var id = parseInt(req.params.id);
//   db.result('DELETE FROM starships WHERE id = $1', id)
//     .then(function (result) {
//       /* jshint ignore:start */
//       res.status(200)
//         .json({
//           status: 'success',
//           message: 'Removed ${result.rowCount} starships'
//         });
//       /* jshint ignore:end */
//     })
//     .catch(function (err) {
//       return next(err);
//     });
// }


/////////////
// Exports
/////////////

module.exports = {
    getAllStarships: getAllStarships,
    UserLogin: UserLogin,
    createUser: createUser
};