
'use strict';
var bcrypt = require("bcrypt-nodejs");


module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1]
      }
    },
    username: {
      type: DataTypes.STRING,
      required: true,
      validate: {
        len: [1]
      }
      },
    password: {
      type: DataTypes.STRING,
      required: true,
      validate: {
        len: [1]
    }
  }
});

    User.associate = function (models) {
      models.User.hasOne(models.Layout);
    };

    User.prototype.validPassword = function(password) {
      return bcrypt.compareSync(password, this.password);
    };
    // Hooks are automatic methods that run during various phases of the User Model lifecycle
    // In this case, before a User is created, we will automatically hash their password
    User.hook("beforeCreate", function(user) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });


  return User;
}

