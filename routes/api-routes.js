// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Grabbing our models

var db = require("../models");

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

  app.get("/framework",function(req,res) {
    res.render('framework');
  });


  app.put("/api/layout/:id", function(req,res){
    var updateObj = {};
    if(req.body.column == "nav"){
      updateObj = {
        nav: { "option" : req.body.option }
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


  app.get("/element/:folder?/:file?", function(req,res){
    var folder = req.params.folder;
    var file = req.params.file;
    res.render('partials/'+folder+'/'+file, { layout: 'elements' });
  });

  app.get("/sidebars/:file?", function(req,res){
    var file = req.params.file;
    res.render('sidebars/'+file, { layout: 'elements' });
  });
  


//PASSPORT ROUTES//

// show the login form
    app.get('/login', function(req, res) {

      // render the page and pass in any flash data if it exists
      res.render('login.handlebars', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // show the signup form
    app.get('/signup', function(req, res) {

      // render the page and pass in any flash data if it exists
      res.render('signup.handlebars', { message: req.flash('signupMessage') });
    });

    app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    });


    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

      // if user is authenticated in the session, carry on 
      if (req.isAuthenticated())
          return next();

      // if they aren't redirect them to the home page
      res.redirect('/');
    }

 }
