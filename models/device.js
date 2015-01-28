"use strict";
module.exports = function(sequelize, DataTypes) {
  var Device = sequelize.define("Device", {
    name: DataTypes.STRING,
    device_id: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Device.belongsTo(models.User);
      }
    }
  });
  return Device;
};
