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

// show the login form
    app.get('/login', function(req, res) {

      // render the page and pass in any flash data if it exists
      res.render('login'); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // show the signup form
    app.get('/signup', function(req, res) {

      // render the page and pass in any flash data if it exists
      res.render('signup');
    });

    // app.get('/logout', function(req, res) {
    //   req.logout();
    //   res.redirect('/');
    // });


    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

      // if user is authenticated in the session, carry on 
      if (req.isAuthenticated())
          return next();

      // if they aren't redirect them to the home page
      res.redirect('/');
    }

 }
