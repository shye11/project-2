// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory
app.use(express.static("public"));

// Set Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ 
  defaultLayout: "main",
  helpers: {
    partial: function (uri,name) {
      // This helper allows us to load dynamic partials
      // Where the variable contains uri+"/"+name
      // Usage: {{> (partial variable) }}
      return uri+"/"+name.toString();
    },
    equal: function(lvalue, rvalue, options) {
      // This allows us to compare two values
      // Usage: {{#equal var1 var2}}
      if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
      if( lvalue!=rvalue ) {
          return options.inverse(this);
      } else {
          return options.fn(this);
      }
    },
    lowercase: function(name) {
      // performs string operation lowercase 
      // Usage: {{lowercase "Text"}}
      return name.toLowerCase();
    }
  }
 }));
app.set("view engine", "handlebars");


// Routes
// =============================================================
require("./routes/api-routes.js")(app);

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({force:true}).then(function() {
  db.User.create({
    name: 'Michael Rosario',
    username: 'michaelrosario',
    password: 'password'

  });
  db.Layout.create({
   UserId: 1
  });



// PASSPORT server.js

// set up ======================================================================
// get all the tools we need
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

// configuration ==============================================================

// require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./routes/api-routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================

app.listen(PORT, function() {
  console.log("Server listening on: http://localhost:" + PORT);
});
});