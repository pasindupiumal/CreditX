const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');
const keyRouter = require('../controllers/keyController');
const userRouter = require('../controllers/userController');
const blockAuthRouter = require('../controllers/blockAuthController');

//Management of routes.
router.use('/', viewController);
router.use('/keys', keyRouter);
router.use('/users/', userRouter);
router.use('/blockauth/', blockAuthRouter);


module.exports = router;