const express = require('express');
const router = express.Router();
const homeController = require('../controller/user_controller');
const passport = require('passport');
const User = require('../models/user')

router.get('/sign-up', homeController.signUp);
router.get('/sign-in', homeController.signIn);
router.post('/create-profile', homeController.create)
router.get('/profile/:id',passport.checkAuthentication, homeController.profile);
router.post('/update/:id',passport.checkAuthentication, homeController.update);
// router.post('/create-session', homeController.createSession)

//use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
) ,homeController.createSession)

router.get('/sign-out', homeController.destroySession);
// router.use('/', require('./homePage'))
router.get('/auth/google/', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), homeController.createSession)
module.exports = router;