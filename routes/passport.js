var passport = require("passport");
var db = require("../models");
var LocalStrategy = require("passport-local").Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log("deserializeUser ran", id);
  db.User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(done);
});

//LOCAL SIGNIN

passport.use(
  "local-signin",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true
    },

    function(req, username, password, done) {
      // var isValidPassword = function(userpass, password) {
      //   return bCrypt.compareSync(password, userpass);
      // };

      db.User.findOne({
        where: {
          username: username
        }
      })
        .then(function(user) {
          if (!user) {
            return done(null, false, {
              message: "Username does not exist"
            });
          }

          // if (!isValidPassword(user.password, password)) {
          //   return done(null, false, {
          //     message: "Incorrect password."
          //   });
          // }

          var userinfo = user.get();
          return done(null, userinfo);
        })
        .catch(function(err) {
          console.log("Error:", err);

          return done(null, false, {
            message: "Something went wrong with your Signin"
          });
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

module.exports = passport;
