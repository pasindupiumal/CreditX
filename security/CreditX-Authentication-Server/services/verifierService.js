const cryptico = require('cryptico');
const crypto = require('crypto');
const config = require('../config');
const axios = require('axios');
const { default: Axios } = require('axios');

//Acquiring required configurations
const BASE_URL = config.BASE_URL;

/*
    Implementation of the VerifierService. For third party platforms which encoporates the
    CreditX Authentication Service this functionality is provided through a node package manager
    module named 'CreditXAuthenticator'.
 */
const VerifierService = function() {

    this.verifyUser = (username, code, hashCode) => {

        return new Promise((resolve, reject) => {

           //Obtain users public key and the unique url
           const getUserURL = BASE_URL + '/blockauth/url';
           const getKey = BASE_URL +  '/blockauth/key';

           var userURL = "";
           var userKey = "";

           axios.post(getUserURL, {username: username}).then( data => {

                userURL = data.data.data;

                axios.post(getKey, {username: username}).then( data => {

                    userKey = data.data.data;

                    const tokenRaw = crypto.createHash('sha256').update(Math.random().toString()).digest('base64').substr(0,10);
                    const encrypted = cryptico.encrypt(tokenRaw, userKey, "").cipher;

                    axios.post(userURL + '/verify', {username: username, code: code, hashCode: hashCode, cipher: encrypted}).then(data => {

                        if(data.data.data == tokenRaw){

                            console.log("Authentication Successful. Token validated successfully.");
                            resolve({status: 200, message: 'Authentication Successful', data: ''});

                        }
                        else{

                            console.log("Authentication unsuccessful. Token validation failed");
                            reject({status: 500, message: 'Invalid Password'});

                        }

                    }).catch(error => {

                        console.log('Error - Authentication failed - ' + error );
                        reject({status: 500, message: 'Error - Authentication failed - ' + error});

                    });

                }).catch(error => {

                    console.log('Error getting user key ' + error);
                    reject({status: 500, message: 'Error getting user key - ' + error});

                });

           }).catch(error => {

                console.log('Error getting user url ' + error);
                reject({status: 500, message: 'Error getting user url - ' + error});

           });

        });

    }

};


module.exports = new VerifierService();