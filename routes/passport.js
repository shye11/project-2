var passport = require("passport");
var db = require("../models");
var LocalStrategy = require("passport-local").Strategy;

//LOCAL SIGNIN

passport.use(
  "local-signin",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password"
      // passReqToCallback: true
    },

    function(username, password, done) {
      db.User.findOne({
        where: {
          username: username
        }
      }).then(function(user) {
        if (!user) {
          return done(null, false, {
            message: "Username does not exist"
          });
        } else if (!user.validPassword(password)) {
          return done(null, false, { message: "Incorrect Password" });
        }

        return done(null, user);
      });
    }
  )
);

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },

    function(req, username, password, done) {
      db.User.findOne({
        where: {
          username: username
        },
        include: [
          {
            model: db.Layout
          }
        ]
      }).then(function(user) {
        if (user) {
          return done(null, false, {
            message: "That username is already taken"
          });
        } else {
          var userPassword = password;
          var userFullName = req.body.name;

          console.log("userFullName", userFullName);

          var data = {
            name: userFullName,
            username: username,
            password: userPassword
          };

          db.User.create(data).then(function(newUser, created) {
            if (!newUser) {
              return done(null, false);
            }

            if (newUser) {
              console.log("new user created");

              db.Layout.create({
                UserId: newUser.id
              }).then(function() {
                return done(null, newUser);
              });
            }
          });
        }
      });
    }
  )
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

module.exports = passport;
