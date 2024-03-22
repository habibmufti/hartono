const express = require("express");
const Controller = require("../controllers/controller");
const AdminController = require("../controllers/adminController");
const userController = require("../controllers/userController");
const router = express.Router();

//get register
router.get("/register", userController.registerForm);

//post register
router.post("/register", userController.postRegister);

//get login
router.get("/login", userController.loginForm);

//post login

router.post("/login", userController.postLogin);

router.get("/logout", userController.getLogOut);

//middleware

// a middleware function with no mount path. This code is executed for every request to the router
router.use((req, res, next) => {
  console.log(req.session);
  if (!req.session.userId) {
    const error = "please login first!";
    //if condition yang menangkap user id
    res.redirect(`/login?error=${error}`);
    //ini nyambung ke halaman lgin yang di
    //controller login form dan ditangkap req query nya
  } else {
    next();
    //next ini artinya kalo udah ada req session id dan di tangkap
    //oleh req session di controller dan di oper ke req sesion
    //yang ada di index router sekarang ini
  }
  //console.log("Time:", Date.now());
  //next();
});
//

//middleware

router.get("/", Controller.home);
router.get("/cart", Controller.getCart);
router.get("/cart/increase/:id", Controller.getIncreaseCart);
router.get("/cart/decrease/:id", Controller.getDecreaseCart);
router.get("/cart/pay/:id", Controller.pay);
router.get('/user/edit/profile/:id', Controller.getEditUserProfile)
router.post('/user/edit/profile/:id', Controller.postEditUserProfile)
router.get('/user/:id', Controller.readUser)
router.get('/addToCart/:id', Controller.addToCart)


//admin
router.get("/admin", AdminController.adminPage);

router.get("/admin/addProduct", AdminController.getFormAdd);
router.post("/admin/addProduct", AdminController.postFormAdd);
router.get("/admin/edit/:id", AdminController.getEdit);
router.post("/admin/edit/:id", AdminController.postEdit);
router.get("/admin/delete/:id", AdminController.destroyProduct);

// router.use("/incubators", require("./incubators"));
// router.use("/startUp", require("./startUp"));

module.exports = router;
