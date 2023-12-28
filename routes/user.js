const express = require("express");
const router = express.Router();

const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Missing parameter" });
    }

    const userAlreadyInDb = await User.findOne({ email: email });

    if (userAlreadyInDb) {
      return res.status(409).json({ message: "This email is already used" });
    }

    const token = uid2(64);
    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);

    const user = await User.create({
      email,
      username,
      token,
      salt,
      hash,
    });

    res.json({ id: user._id, username: user.username, token: user.token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
