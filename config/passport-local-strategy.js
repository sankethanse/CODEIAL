const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user')

//authentication using passport
passport.use(new LocalStrategy({
    usernameField : 'email',
    passReqToCallback: true
},

 async function (req,email, password, done) {
    try{
        //find user and establish the identity 
        const user = await User.findOne({email:email})
            if(!user || user.password != password){
            req.flash('error', 'Invalid Username/Password');
            return done(null,false)
            }
        return done(null,user);
    }catch(err){
        req.flash('error', err);
        return;
    }
    
}
));


//serializing the user to decide whith key is to be kept in the cookies

passport.serializeUser(function(user,done){
    done(null,user.id);
})

// deserializing the user from the key in the cookies

passport.deserializeUser(async function(id,done){
   const user =await User.findById(id)
        return done(null,user);
});

// check if user authenticated
passport.checkAuthentication = function(req,res,next){
    // if user signed in then pass on request to next function(controllers action)
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect ('/users/sign-in')
}

passport.setAuthenticatedUser = function(req, res,next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;