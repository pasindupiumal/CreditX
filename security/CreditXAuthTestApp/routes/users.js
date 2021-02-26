var express = require('express');
const VerifierService = require('creditxauthenticator');
var router = express.Router();

/* GET users listing. */


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//http://localhost:5000/users/authenticate
router.get('/authenticate', function(req, res, next) {

  const username = req.query.username;
  const code = req.query.code;
  const hashCode = req.query.hashcode;

  VerifierService.verifyUser(username, code, hashCode).then(data => {

    console.log('Login success');
    const returnData = {

      status: true,
      to: 'http://localhost:5000/profile',
      username: username

    }

    res.send({message: data.message, data: returnData});

  }).catch(error => {

    const returnData = {

      status: false,

    }

    res.send({message: error.message, data: returnData});

  });

});



module.exports = router;
