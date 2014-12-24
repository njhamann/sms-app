"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Subscriptions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      stripe_customer_id: {
        type: DataTypes.STRING
      },
      card_description: {
        type: DataTypes.STRING
      },
      is_active: {
        type: DataTypes.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Subscriptions").done(done);
  }
};