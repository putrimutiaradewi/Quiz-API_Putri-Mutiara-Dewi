const config = require("../config/auth");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  const table = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  console.log(table);
  res.status(201).json({
    message: "success!",
  });
};

const signin = async (req, res) => {
  const table = await User.findOne({
    username: req.body.username,
  });

  if (!table) {
    return res.status(404).json({ message: "User Not found." });
  }

  console.log(table);

  var passwordIsValid = bcrypt.compareSync(req.body.password, table.password);

  if (!passwordIsValid) {
    return res.status(401).json({
      accessToken: null,
      message: "Invalid Password!",
    });
  }

  const token = jwt.sign({ id: table.id }, config.secret, {
    algorithm: "HS256",
    allowInsecureKeySizes: true,
    expiresIn: 86400, // 24 hours
  });

  res.status(200).json({
    id: table._id,
    username: table.username,
    email: table.email,
    accessToken: token,
  });
};

module.exports = { signup, signin };