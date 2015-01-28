"use strict";
module.exports = function(sequelize, DataTypes) {
  var Email = sequelize.define("Email", {
    address: DataTypes.STRING,
    is_verified: DataTypes.BOOLEAN,
    is_active: DataTypes.BOOLEAN,
    verification_token: DataTypes.STRING,
    verification_expires: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        Email.belongsTo(models.User);
      }
    }
  });
  return Email;
};
