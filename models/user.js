
'use strict';
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

  return User;
}
