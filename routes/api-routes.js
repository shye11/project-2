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
  app.get("/api/user", function(req, res) {

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
  
};
