var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("keren", salt);

console.log(hash);

console.log(bcrypt.compareSync("keren", hash));
console.log(bcrypt.compareSync("kerenn", hash));
