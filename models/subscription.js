"use strict";
module.exports = function(sequelize, DataTypes) {
  var Subscription = sequelize.define("Subscription", {
    stripe_customer_id: DataTypes.STRING,
    stripe_subscription_id: DataTypes.STRING,
    card_description: DataTypes.STRING,
    plan: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Subscription.belongsTo(models.Account);
      }
    }
  });
  return Subscription;
};
