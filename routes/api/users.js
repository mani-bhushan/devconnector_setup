const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const gravatar = require("gravatar");
//import User from '../../models/User';
const User = require("../../models/User");
// @route       GET api/users
// @desc        Test route
// @access      Public
router.get("/", (req, res) => res.send("Users test route"));

// @route       POST api/users/register
// @desc        Registration test route
// @access      Public
router.post(
  "/register",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Please incllude a valid email").isEmail(),
    check("password", "Please enter a vaild passsword").isLength({ min: 6 }),
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //console.log(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "Useralready exists" });
      }
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      user = new User({
        name,
        email,
        avatar,
        password,
      });
      res.send("Users register test route");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
