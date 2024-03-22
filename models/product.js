"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    get formattedPrice() {
      return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(this.price);
    }

    static async readProduct(Category){
      try {
        let option = {
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: {
            model: Category,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            }
          }, where: {},
          order: [['name', 'asc']]
        }
        let data = await Product.findAll(option);
        return data
      } catch (error) {
        throw error
      }
    }

    static associate(models) {
      Product.belongsTo(models.Category);
      Product.belongsToMany(models.User, {
        through: models.Cart,
        foreignKey: "UserId",
        otherKey: "ProductId",
      });
    }
  }
  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: `name is requierd`
          },
          notNull: {
            msg: `name is requierd`
          }
        }
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: `description is requierd`
          },
          notNull: {
            msg: `description is requierd`
          }
        }
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: `price is requierd`
          },
          notNull: {
            msg: `price is requierd`
          }
        }
      },
      CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Categories", //harus selalu plural
          key: "id",
        },
      },
     stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: `stock is requierd`
          },
          notNull: {
            msg: `stock is requierd`
          },
          minstock(value) {
            if (value < 1 ) throw new Error(`minimum stock is 1`)
          }
        }
      },
      urlPicture: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: `picture url is requierd`
          },
          notNull: {
            msg: `picture url is requierd`
          }
        }
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
