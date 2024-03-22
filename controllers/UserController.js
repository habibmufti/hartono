const { User, UserProfile } = require("../models");
const bcrypt = require("bcryptjs");
//kalau pake package harus di bikin require

class userController {
  static registerForm(req, res) {
    try {
      res.render("auth-pages/register-form");
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }

  static async postRegister(req, res) {
    try {
      let { username, email, password } = req.body;
      let data = await User.create({ username, email, password });
      console.log(req.body);
      console.log("ini dari form register");
      await UserProfile.create({
        fullName: `Default Member`,
        profilePicture: `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png`,
        dateOfBirth: `${new Date()}`,
        UserId: data.id,
        /** user id ini pentinng dan harus ada
         * supaya bisa mendapatkna data userprofile
         */
      });
      res.redirect("/login");
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }

  static loginForm(req, res) {
    try {
      const { error } = req.query;
      res.render("auth-pages/login-form", { error });
      // ini untuk menerima query error dari res redirect
      /**yang /login?error=${error} */
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }

  static postLogin(req, res) {
    try {
      const { username, password } = req.body;
      // ini pencarian username dari login form
      User.findOne({ where: { username } }).then((user) => {
        //ini mencari user berdasarkan username yang ada di USER dbeaver
        //baru nanti kalo username input user
        //sama dengan username yang tersimpan di dbeaver
        //nanti lanjut ke ifelse dibawah
        if (user) {
          const isValidPassword = bcrypt.compareSync(password, user.password);
          /** ini adalah cara verif password */
          if (isValidPassword) {
            //case berhasil login
            req.session.userId = user.id; //set seession di controller
            //req.session adalah pemanggilan session
            // req session ini untuk menyimpan id yang didapat dari input user
            return res.redirect("/");
          } else {
            const error = "invalid username/password";
            return res.redirect(`/login?error=${error}`);
          }
          //ini kalo username nya ga sama dengan yang ada di dbeaver
        } else {
          const error = "invalid username/password";
          return res.redirect(`/login?error=${error}`);
        }

        /** ini adalah cara verif password */
      });
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }

  static async getLogOut(req, res) {
    try {
      req.session.destroy((error) => {
        if (error) res.send(error);
        else {
          res.redirect("/");
        }
      });
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }
}

module.exports = userController;
