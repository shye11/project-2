'use strict';
module.exports = function(sequelize, DataTypes) {
  var Layout = sequelize.define("Layout", {
    nav: {
      type:  DataTypes.JSON,
      defaultValue: { option: "option-one"}
    },
    carousel: {
      type: DataTypes.JSON,
      defaultValue: { option: "option-one"}
    },
    body: {
      type: DataTypes.JSON,
      defaultValue: { options: "" }
    },
    footer: {
      type: DataTypes.JSON,
      defaultValue: { option: "option-one"}
    }
  });

  Layout.associate = function (models) {
    models.Layout.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Layout;
}

