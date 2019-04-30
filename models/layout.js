'use strict';
module.exports = function(sequelize, DataTypes) {
  var Layout = sequelize.define("Layout", {
    nav: {
      type:  DataTypes.JSON,
      defaultValue: { option: "option-one", customization: {}},
     
    },
    carousel: {
      type: DataTypes.JSON,
      defaultValue: { option: "option-one", customization: {} }
      
    },
    body: {
      type: DataTypes.JSON,
      defaultValue: [
        {
            option: "three-columns",
            title: "About",
            customization: {}
        },{
            option: "two-columns",
            title: "Portfolio",
            customization: {}
        },{
            option: "three-columns",
            title: "Contact",
            customization: {}
        }
      ]},
    footer: {
      type: DataTypes.JSON,
      defaultValue: { option: "option-one", customization: {}}
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

