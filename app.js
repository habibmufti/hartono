const express = require("express");
const router = require("./routers/index");
const app = express();
const session = require("express-session");
//ini untuk instalasi session
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
//ini adalah settingan default untuk session

app.use(
  session({
    secret: "rahasia", // harus ada
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: true, // untuk security dari csrf attack
      //https
    },
  })
);

//ini adalah settingan default untuk session

app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
