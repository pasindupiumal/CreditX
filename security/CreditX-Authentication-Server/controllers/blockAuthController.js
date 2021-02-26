const express =  require('express');
const router = express.Router();
const BlockAuthService = require('../services/blockAuthService');

/*
    Endpoint for obtaining public key of a specific user registered in the CreditXAuthenticatorService.
    Takes the username as an input parameters and returns the public key associated with the username.
 */
router.post('/key', (req, res) => {

    BlockAuthService.getBlockAuthPublicKey(req.body.username).then(data => {

        res.status(data.status).send({message: data.message, data: data.data});

    }).catch(error => {

        res.status(error.status).send({message: error.message});

    });

});

/*
    Endpoint for identifying whether a specific username is already registered in the CreditX Authentication
    Service. Takes the username as an input parameter and returns whether the username is available or not.
 */
router.get('/username', (req, res) => {

    BlockAuthService.usernameAvailable(req.query.username).then(data => {

        res.status(data.status).send({message: data.message, data: data.data});

    }).catch(error => {

        //res.status(error.status).send({message: error.message});
        res.status(error.status).send({message: error.message});

    });

});

/*
    Endpoint for obtaining the unique url generated for each user. Takes the username as an
    input parameter and returns the url associated with the given username.
 */
router.post('/url', (req, res) => {

    BlockAuthService.getBlockAuthUrl(req.body.username).then(data => {

        res.status(data.status).send({message: data.message, data: data.data});

    }).catch(error => {

        res.status(error.status).send({message: error.message});

    });

});

/*
    Endpoint for obtaining the Ethereum address of the the user. Takes in the username as an input
    parameter and provides the Ethereum address of the users' default account.
 */
router.post('/address', (req, res) => {

    BlockAuthService.getAddress(req.body.username).then(data => {

        res.status(data.status).send({message: data.message, data: data.data});

    }).catch(error => {

        res.status(error.status).send({message: error.message});

    });

});

/*
    Endpoint for registering a new user in the chain. Takes the relevant user data as input
    parameters and registers the user in the chain. The smart contracts emit an event once a new user
    is successfully registered in the chain, and here the BlockAuthService listens for the particular event
    to verify the status of the user registration process.
 */
router.post('/user', (req, res) => {

    userData = {
        username: req.body.username,
        block_auth_url: req.body.url,
        public_key: req.body.publicKey
    }

    BlockAuthService.addNewUser(userData).then(data => {

        res.status(data.status).send({message: data.message, data: data.data});

    }).catch(error => {

        res.status(error.status).send({message: error.message});

    });

});


module.exports = router;