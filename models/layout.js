module.exports = function(sequelize, DataTypes) {
  var Layouts = sequelize.define("Layouts", {
    companyName: DataTypes.STRING,
    nav: DataTypes.JSON,
    carousel: DataTypes.JSON
  });
  return Layouts;
};

