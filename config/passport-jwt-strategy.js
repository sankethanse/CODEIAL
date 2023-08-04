const passport = require('passport');

const JWTStrategy = require('passport-jwt').Strategy;

const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

let opts = {
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'codeial' 
}

passport.use(new JWTStrategy(opts, async function(jwtPayload,done){
    // in jwtPayload._id here we upload id data in payload
    try{
        const user = await User.findById(jwtPayload._id);
    // if(err){
    //     console.log('Error in finding user from JWT');
    //     return;
    // }

    if(user){
        return done(null, user);
    }
    else{
        return done(null, false);
    }
    }catch{
        console.log("****",err);
    }
    
}))

module.exports = passport;
