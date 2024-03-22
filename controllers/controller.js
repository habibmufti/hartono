const { Cart, Product, User, Category, UserProfile } = require("../models");
const { Op, where } = require('sequelize');
const formatCurrency = require('../helper/formatCurrency');
const qrcode = require('qrcode');

class Controller {
  static async home(req, res) {
    try {
      let { name, CategoryId } = req.query
      let { userId } = req.session
      let user = await User.findAll({where:{id:userId}})
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
      if ({ name, CategoryId }){
        if (name) option.where.name = { [Op.iLike]: `%${name}%` }
        if (CategoryId) option.where.CategoryId = { [Op.eq]: CategoryId }
        let data = await Product.findAll(option)
        res.render("home", { data, title: "Home", user });
      }else{
        let data = await Product.readProduct(Category)
        res.render("home", { data, title: "Home", user });
      }
    } catch (error) {
      res.send(error);
    }
  }
  static async readUser(req, res){
    try {
      let { userId } = req.session
      let user = await User.findAll({ 
        where: { id: userId },
        include:{
          model: UserProfile
        }
      })
      const urlVideo = `https://www.youtube.com/watch?v=dQw4w9WgXcQ`;

      qrcode.toDataURL(urlVideo, (err, url) => {
        if (err) throw err;
        res.render('user', { title: 'User Details', user, qrCodeURL: url });
      });
    } catch (error) {
      res.send(error)
    }
  }
  static async getEditUserProfile(req, res) {
    try {
      let { userId } = req.session
      let user = await User.findAll({ where: { id: userId } })
      let { id } = req.params
      let profile = await UserProfile.findByPk(id)

      let { error, path } = req.query;
      res.render("edit-profile", { profile, error, path, user });
      // res.send(data)
    } catch (error) {
      res.send(error);
    }
  }
  static async postEditUserProfile(req, res) {
    try {
      let { id } = req.params
      let { fullName, dateOfBirth, profilePicture} = req.body;
      await UserProfile.update({ fullName, dateOfBirth, profilePicture }, {
        where: {
          id: id
        }
      });
      res.redirect(`/user/${id}`);
    } catch (error) {
      res.send(error)
    }
  }

  static async addToCart(req, res) {
    let { id } = req.params;
    try {
      let { userId } = req.session
      await Cart.create({ UserId: userId, ProductId: +id });
      res.redirect('/')
    } catch (error) {
      res.send(error)
    }
  }
  static async getCart(req, res) {
    try {
      let { userId } = req.session
      let user = await User.findAll({ where: { id: userId } })
      let cartUnpaid = await Cart.findAll({
        attributes: ['id', 'UserId', 'ProductId', 'quantity', 'isPaid'],
        where: {
          UserId: {
            [Op.eq]: userId
          },
          isPaid: {
            [Op.eq]: false
          }
        },
        include: {
          model: Product
        }
      });
      let cartPaid = await Cart.findAll({
        attributes: ['id', 'UserId', 'ProductId', 'quantity', 'isPaid'],
        where: {
          UserId: {
            [Op.eq]: userId
          },
          isPaid: {
            [Op.eq]: true
          }
        },
        include: {
          model: Product
        }
      });
      // res.send(dataCart)
      res.render('cart', { user, cartUnpaid, cartPaid, title: Cart, formatCurrency: formatCurrency })
    } catch (error) {
      throw error
    }
  }
  static async getIncreaseCart(req, res) {
    try {
      let { id } = req.params
      await Cart.increment({ quantity: 1 }, { where: { id: id } })
      res.redirect('/cart')
    } catch (error) {
      throw error
    }
  }
  static async getDecreaseCart(req, res) {
    try {
      let { id } = req.params
      await Cart.increment({ quantity: -1 }, { where: { id: id } })
      res.redirect('/cart')
    } catch (error) {
      throw error
    }
  }
  static async pay(req, res) {
    try {
      let { id } = req.params
      let { qty, productId } = req.query
      await Cart.update({ isPaid: true }, { where: { id: id } })
      await Product.increment({ stock: -qty }, { where: { id: productId } })
      res.redirect('/')
    } catch (error) {
      throw error
    }
  }

}
module.exports = Controller;
