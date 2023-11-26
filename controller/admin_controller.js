const User = require("../Models/VoterSchema");
const Election = require("../Models/ElectionSchema"); // Your Mongoose Election model
const Admin = require("../Models/AdminSchema"); // Your Mongoose Voter model
const Vote = require("../Models/VoteSchema");
const Candidate = require("../Models/CandidateSchema"); // Your Mongoose Admin model
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    console.log("hello");
    const { full_name, email, phone_number, password } = req.body;

    const token = jwt.sign({ email: req.body.email }, process.env.secretKey);

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const emailExists = await Admin.findOne({ email: email }).exec();
      if (emailExists) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }
    } catch (err) {
      console.log(err);
    }

    const phoneExists = await Admin.findOne({
      phone_number: phone_number,
    }).exec();
    if (phoneExists) {
      return res
        .status(400)
        .json({ message: "User with this phone number already exists" });
    }

    const admin = new Admin({
      full_name: full_name,
      email: email,
      phone_number: phone_number,
      password: hashedPassword,
    });

    admin
      .save()
      .then((result) => {
        return res.status(200).json({
          token: token,
          message: "Admin created successfully",
          data: result,
        });
      })
      .catch((err) => {
        console.error(err);
        return res
          .status(400)
          .json({ message: "Failed to create admin", error: err });
      });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    if (bcrypt.compareSync(password, admin.password)) {
      const token = jwt.sign({ email: admin.email }, process.env.secretKey);
      const adminData = admin;
      res.json({ token: token, data: adminData });
    } else {
      return res.status(400).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
