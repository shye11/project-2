// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Grabbing our models

var db = require("../models");
// var passport = require('passport');
// var LocalStrategy = require("passport-local").Strategy;

// Routes
// =============================================================
module.exports = function(app, passport) {
  // GET route for getting all of the user
  app.get("/api/user", isLoggedIn, function(req, res) {
    res.render("user.handlebars", {
      user: req.user // get the user out of session and pass to template
    });
  });

  // POST route for saving a new user. You can create a user using the data on req.body
  app.post("/api/user", function(req, res) {});

  // DELETE route for deleting user. You can access the user's id in req.params.id
  app.delete("/api/user/:id", function(req, res) {});

  // PUT route for updating user. The updated user will be available in req.body
  app.put("/api/user", function(req, res) {});

  app.get("/", function(req, res) {
    res.render("index", { layout: "static" });
  });

  // Load all options on the framework page
  // TODO: we need to determine the logged in user
  app.get("/framework", function(req, res) {
    console.log("req.user", req.user);
    if (req.user) {
      db.Layout.findAll({
        where: {
          UserId: req.user.id
        },
        include: [
          {
            model: db.User
          }
        ]
      }).then(function(frameworkOptions) {
        //console.log(frameworkOptions[0].dataValues.nav.option);
        res.render("framework", { data: frameworkOptions[0].dataValues });
      });
    } else {
      res.redirect("/login");
    }
  });

  // Update the framework options
  // TODO: determine whether we use the UserId or Id
  app.put("/api/layout/", function(req, res) {
    db.Layout.findOne({
      where: {
        UserId: req.user.id
      },
      include: [
        {
          model: db.User
        }
      ]
    }).then(function(frameworkOptions) {
      var updateObj = {};
      var data = frameworkOptions.dataValues;
      if (req.body.column == "nav") {
        data.nav.option = req.body.option;
        updateObj = {
          nav: data.nav
        };
      }
      if (req.body.column == "carousel") {
        data.carousel.option = req.body.option;
        updateObj = {
          carousel: data.carousel
        };
      }
      if (req.body.column == "body") {
        var bodyItems = data.body;
        /*
        SAMPLE DATA
        We will replace the entire column each time something changes
        [
          {"title": "Portfolio", "option": "two-columns","customization": {}}, 
          {"title": "Contact", "option": "three-columns", "customization":{}}
          {"title": "About", "option": "three-columns", "customization": {}}, 
        ]
      */

        data.body = req.body.option;
        updateObj = {
          body: data.body
        };
      }
      if (req.body.column == "footer") {
        data.footer.option = req.body.option;
        updateObj = {
          footer: data.footer
        };
      }

      console.log("updateObj", updateObj);
      db.Layout.update(updateObj, {
        where: {
          id: req.user.id
        }
      }).then(function(results) {
        res.json(results);
      });
    });
  });

  app.put("/api/customization/:type", function(req, res) {
    var updateObj = {};
    var updateType = req.params.type;
    db.Layout.findOne({
      where: {
        UserId: req.user.id
      },
      include: [
        {
          model: db.User
        }
      ]
    }).then(function(frameworkOptions) {
      console.log(frameworkOptions);
      // console.log(frameworkOptions[0].dataValues.nav.option);
      var data = frameworkOptions.dataValues;
      if (updateType == "nav") {
        data.nav.customization = req.body;
        updateObj = {
          nav: data.nav
        };
      }
      if (updateType == "carousel") {
        data.carousel.customization = req.body;
        updateObj = {
          carousel: data.carousel
        };
      }
      if (updateType == "footer") {
        data.footer.customization = req.body;
        updateObj = {
          footer: data.footer
        };
      }
      console.log("updateObj", updateObj);
      db.Layout.update(updateObj, {
        where: {
          UserId: req.user.id
        }
      }).then(function(results) {
        res.json(results);
      });
    });
  });

  // Used to render elements for jQuery load of frameworks
  app.get("/element/:folder?/:file?", function(req, res) {
    var folder = req.params.folder;
    var file = req.params.file;
    res.render("partials/" + folder + "/" + file, { layout: "elements" });
  });

  // Used to render elements for jQuery load of sidebars
  app.get("/sidebars/:file?", function(req, res) {
    var file = req.params.file;
    res.render("sidebars/" + file, { layout: "elements" });
  });

  // show the login form
  app.get("/login", function(req, res) {
    // render the page and pass in any flash data if it exists
    console.log(req);
    res.render("login");
  });

  // show the signup form
  app.get("/signup", function(req, res) {
    res.render("signup");
  });

  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/framework",
      failureRedirect: "/signup"
    })
  );

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

  // route middleware to make sure a user is logged in
  function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) return next();

    // if they aren't redirect them to the home page
    res.redirect("/");
  }

  app.post(
    "/login",
    passport.authenticate("local-signin", {
      successRedirect: "/framework",
      failureRedirect: "/login"
    })
  );

  // route middleware to make sure a user is logged in
  function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) return next();

    // if they aren't redirect them to the home page
    res.redirect("/");
  }
};
