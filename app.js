var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodepj');
var db = mongoose.connection;

// routes 

var routes = require('./routes/index');
var users = require('./routes/users');

//Initalizing app

var app = express();

// View Engine

app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exphbs({defaultLayout:'layout'}));
app.set('view engine','handlebars');


// Middle Wares

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser); 

// static folder to store imgs,css,styles,js....etc

app.use(express.static(path.join(__dirname,'public')));



// express sessions

app.use(session(
    {
        secret:'secret',
        saveUninitialized: true,
        resave:true
    }
));


// passport Initalizing

app.use(passport.initialize());
app.use(passport.session());


app.use(expressValidator(
    {
        errorFormatter: function(param,msg,value){
            var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
            while(namespace.length){
                formParam+='['+namespace.shift() + ']';
            }
            return {
                param: formParam,
                msg: msg,
                value:value
            };

        }
    }
));


// connect flash form msgs


app.use(flash());


app.use(function(req,res,next)
{

res.locals.success_msg = req.flash('sucess_msg');
res.locals.error_msg = req.flash('error_msg');
res.locals.error = req.flash('error');
next();
});


app.use('/',routes);
app.use('/users',users);


//set port


app.set('port',(process.env.PORT || 3000));

app.listen(app.get('port'),function(){

    console.log('Congratulations!! Your Server Started at ' + app.get('port'));

});
