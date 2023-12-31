const express = require('express');
const cookieParser = require('cookie-parser');
const db= require('./config/config');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const bodyParser= require('body-parser');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportlocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth-strategy');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static('./assets'))
// make the uploads path available to the browser
app.use('/uploads',express.static(__dirname + '/uploads'))
app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set up view engine
app.set('view engine', 'ejs');
app.set('views', './views');


// mongo store is used to store the session cokie in DB
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode 
    secret : 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        // after how much time cookie will expire maxage is in milisecond
        maxAge: (1000*60*100)
    },
    store:MongoStore.create({
        mongoUrl:'mongodb://127.0.0.1/Codeal',
        autoRemove:'disabled'
    },
    function(err){
        console.log(err || 'connect-mongodb setup ok')
    }
    )
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
// use express router
app.use('/', require('./routes/homePage'))

app.listen(port, function(err){
    if(err){
        console.log (`error is running the server ${err}`);
    }
    console.log(`Server running on port ${port}`)
})