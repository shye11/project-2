// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Grabbing our models

var db = require("../models");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the user
  app.get("/api/user", isLoggedIn ,function(req, res) {
    res.render('user.handlebars', {
      user : req.user // get the user out of session and pass to template
    });
  });

  // POST route for saving a new user. You can create a user using the data on req.body
  app.post("/api/user", function(req, res) {

  });

  // DELETE route for deleting user. You can access the user's id in req.params.id
  app.delete("/api/user/:id", function(req, res) {

  });

  // PUT route for updating user. The updated user will be available in req.body
  app.put("/api/user", function(req, res) {

  });

  app.get("/",function(req,res) {
    res.render('index', { layout: 'static' });
  });

  // Load all options on the framework page
  // TODO: we need to determine the logged in user
  app.get("/framework",function(req,res) {
    db.Layout.findAll({
      where: {
        UserId: 1
      },
      include: [
        {
          model: db.User
        }
      ]
    }).then(function(frameworkOptions) {
      //console.log(frameworkOptions[0].dataValues.nav.option);
      res.render('framework',{data: frameworkOptions[0].dataValues});
    
    });
    
  });

  // Update the framework options
  // TODO: determine whether we use the UserId or Id
  app.put("/api/layout/:id", function(req,res){
    var updateObj = {};
    if(req.body.column == "nav"){
      updateObj = {
        nav: { "option" : req.body.option }
      }
    }
    if(req.body.column == "carousel"){
      updateObj = {
        carousel: { "option" : req.body.option }
      }
    }
    if(req.body.column == "footer"){
      updateObj = {
        footer: { "option" : req.body.option }
      }
    }
    console.log(updateObj);
    db.Layout.update(updateObj, {
      where: {
        id: req.params.id
      }
    }).then(function(results) {
      res.json(results);
    });
  });

  // Used to render elements for jQuery load of frameworks
  app.get("/element/:folder?/:file?", function(req,res){
    var folder = req.params.folder;
    var file = req.params.file;
    res.render('partials/'+folder+'/'+file, { layout: 'elements' });
  });

  // Used to render elements for jQuery load of sidebars
  app.get("/sidebars/:file?", function(req,res){
    var file = req.params.file;
    res.render('sidebars/'+file, { layout: 'elements' });
  });
  


//PASSPORT ROUTES//

    // passport.use(new LocalStrategy(
    //   function(username, password, done) {
    //     db.User.findOne({ username: username }, function (err, user) {npm 
    //       if (err) { return done(err); }
    //       if (!user) { return done(null, false); }
    //       if (!user.verifyPassword(password)) { return done(null, false); }
    //       return done(null, user);
    //     });
    //   }
    // ));

    

// show the login form
    app.get('/login', function(req, res) {
      // render the page and pass in any flash data if it exists
      console.log(req);
      res.render('login');
    });

    app.post('/login', 
      passport.authenticate('local', { failureRedirect: '/login' }),
      function(req, res) {
        res.redirect('/framework');
      });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // show the signup form
    app.get('/signup', function(req, res) {
     
     /* // render the page and pass in any flash data if it exists
      db.User.findOne({
        where: {
            username: req.params.username
        }
    }).then(function(user) {
     
        if (user)
     
        {
            return done(null, false, {
                message: 'That username is already taken'
            });
        } else
        {
            var userPassword = req.params.password;
            var data =
     
                {
                    name: 'jon snow',
                    password: userPassword,
                    username: req.body.username,
                };
     
     
            db.User.create(data).then(function(newUser, created) {
     
                if (!newUser) {
                    return done(null, false);
                }
     
                if (newUser) {
                    return done(null, newUser);
                }
            });
     
        }
     
    });*/

    res.render("signup");

    });

    // app.get('/logout', function(req, res) {
    //   req.logout();
    //   res.redirect('/');
    // });

    //LOCAL SIGNIN
passport.use('local-signin', new LocalStrategy(
 
  {

      // by default, local strategy uses username and password, we will override with email

      usernameField: 'email',

      passwordField: 'password',

      passReqToCallback: true // allows us to pass back the entire request to the callback

  },


  function(req, email, password, done) {

      var User = user;

      var isValidPassword = function(userpass, password) {

          return bCrypt.compareSync(password, userpass);

      }

      User.findOne({
          where: {
              email: email
          }
      }).then(function(user) {

          if (!user) {

              return done(null, false, {
                  message: 'Email does not exist'
              });

          }

          if (!isValidPassword(user.password, password)) {

              return done(null, false, {
                  message: 'Incorrect password.'
              });

          }


          var userinfo = user.get();
          return done(null, userinfo);


      }).catch(function(err) {

          console.log("Error:", err);

          return done(null, false, {
              message: 'Something went wrong with your Signin'
          });

      });


  }

));

passport.use('local-signup', new LocalStrategy(
 
  {

      username: 'username',

      password: 'password',

      passReqToCallback: true // allows us to pass back the entire request to the callback

  },



  function(req, username, password, done) {

      var generateHash = function(password) {

          return password;

      };



      db.User.findOne({
          where: {
            username: username
          }
      }).then(function(user) {

          if (user)

          {

              return done(null, false, {
                  message: 'That username is already taken'
              });

          } else

          {

              var userPassword = password;

              var data =

                  {
                      name : 'jon snow',
                      username: username,

                      password: userPassword,

                  };

              db.User.create(data).then(function(newUser, created) {

                  if (!newUser) {

                      return done(null, false);

                  }

                  if (newUser) {

                      return done(null, newUser);

                  }

              });

          }

      });

  }

));

app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/dashboard',

  failureRedirect: '/signup'
}

));

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

      // if user is authenticated in the session, carry on 
      if (req.isAuthenticated())
          return next();

      // if they aren't redirect them to the home page
      res.redirect('/');
    }

 }


