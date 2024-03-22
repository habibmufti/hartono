"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.User)
      Cart.belongsTo(models.Product)
    }
  }
  Cart.init(
    {
      UserId: DataTypes.INTEGER,
      ProductId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      isPaid: DataTypes.BOOLEAN
    },
    {
      hooks:{
        beforeCreate(instance, option){
          instance.quantity = 1;
          instance.isPaid = false;
        }
      },
      sequelize,
      modelName: "Cart",
    }
  );
  return Cart;
};
