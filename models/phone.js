"use strict";
module.exports = function(sequelize, DataTypes) {
  var Phone = sequelize.define("Phone", {
    number: DataTypes.STRING,
    is_verified: DataTypes.BOOLEAN,
    is_active: DataTypes.BOOLEAN,
    verification_token: DataTypes.STRING,
    verification_expires: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        Phone.belongsTo(models.User);
      }
    }
  });
  return Phone;
};
