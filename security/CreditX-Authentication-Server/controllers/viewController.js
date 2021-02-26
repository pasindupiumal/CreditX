const express = require('express');
const router = express.Router();
const config = require('../config');
const VerifierService = require('../services/verifierService');
const UserService = require('../services/userService');

const BASE_URL = config.BASE_URL;

/*
  ViewController performs the routing and rendering of the web pages.
 */


/*
  Method for enforing the session management.
  If the user is not logged in to the platform and attempt to access a retricted
  page, redirect the user back to the login page.
 */
const redirectToLogin = (req, res, next) => {

  const redirectLink = BASE_URL + '/signin?redirect=' + BASE_URL + '/verify'; 

  if (!req.session.isLogged){
    res.redirect(redirectLink);
  }
  else{
    next();
  }
}

/*
  Method for enforing the session management.
  If the user if  logged in to the platform and attempt to access login page
  page, redirect the user back to the Home page.
 */
const redirectToHome = (req, res, next) => {

  const profileLink = BASE_URL + '/profile';

  if (req.session.isLogged){
    res.redirect(profileLink);
  }
  else{
    next();
  }
}

//Render the index page.
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

//Render the sign in page.
router.get('/signin', redirectToHome, (req, res) => {
  res.render('signin');
});

//Render the profile page.
router.get('/profile', redirectToLogin, (req, res) => {
  res.render('profile');
});

//Render the integrate page.
router.get('/integrate', (req, res) => {
  res.render('integrate');
});

/*
  The CreditX Authenticator can be encoporated by any other platform which wishes to
  utilize CreditX Authentication Service. In order to do so, they need to expose a REST endpoint which is in turn
  used for the authentication process. This same approach is followed, when signing in users into the CreditX Authenticator
  for their profile management. Therefore, this endpoint is used for that purpose. Here it takes three input parameters
  and perform the authentication process. Here even though the VerifierService is imported manually. For third parties
  encoprating the authentication service, this functionality is provided through a npm package named 'CreditXAuthenticator'.
  Here depending on the success of the verification process, user is informed and session data is updated.
 */
router.get('/verify', (req, res) => {

  const username = req.query.username;
  const code = req.query.code;
  const hashCode = req.query.hashcode;

  VerifierService.verifyUser(username, code, hashCode).then(data => {

    console.log('Login success');
    const returnData = {

      status: true,
      to: BASE_URL + '/profile',
      username: username

    }

    req.session.isLogged = true;
    req.session.username = username;
    res.send({message: data.message, data: returnData});

  }).catch(error => {

    const returnData = {

      status: false,

    }

    res.send({message: error.message, data: returnData});
  
  });

});

/*
  This endpoint is used to capture the relevant input parameters and perform the authentication process.
  As the verification process continues the VerifierService invokes this endpoint with the given parameters to finalize
  the user authentication process. From here authenticateUser method of the UserService is invoked alongside passing the
  parameters and the status of the user verification is transmitted back to the VerifierService.
 */
router.post('/authentication/:id/verify', (req, res) => {

  const username = req.body.username;
  const code = req.body.code;
  const hashCode = req.body.hashCode;
  const cipher = req.body.cipher;

  UserService.authenticateUser(username, code, hashCode, cipher).then(data => {

    res.send({message: data.message, data:data.data});

  }).catch(error => {

    res.send({message: error.message});

  })

});

/*
  Endpoint for logging out the user from the CreditX Authentication Service Profile Management Session.
 */
router.get('/logout', (req, res) => {

  req.session.destroy(error => {

    if(error){

      //Perform error handling
      return res.redirect('/profile');

    }

    res.clearCookie('SID');
    res.redirect('/');
  })
})



module.exports = router;