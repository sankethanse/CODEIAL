const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

// tell passport to use new stategy for googlr login
passport.use(new googleStrategy({
    clientID : "763123930748-4tg40ookv0e96bprlc0r2ce7v68a3isd.apps.googleusercontent.com",
    clientSecret : "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",
    callbackURL : "http://localhost:8000/users/auth/google/callback"  
},
   async function(accessToken , refreshToken,profile,done){
    //find user
         const user = await User.findOne({email : profile.emails[0].value}).exec()
            // if(err){
            //     console.log('error in google stategy pasport ', err);
            // }
            if(user){
                // if found,  set this user as req.user
                return done(null, user);
            }
            else{
                // if not found create the user and set it as req.user
                const google = User.create({
                    name : profile.displayName,
                    email : profile.emails[0].value,
                    password : crypto.randomBytes(20).toString('hex')
                })
                    // if(err){
                    //     console.log('error in google stategy pasport ', err);
                    // }
                    return done(null,user);
            }
    }
))


module.exports = passport;