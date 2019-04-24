module.exports = function(sequelize, DataTypes) {
  var Layouts = sequelize.define("Layouts", {
    companyName: DataTypes.STRING,
    navItems: DataTypes.JSON
  });
  return Layouts;
};

