const User = require("../Models/VoterSchema");
const Election = require("../Models/ElectionSchema"); // Your Mongoose Election model
const Admin = require("../Models/AdminSchema"); // Your Mongoose Voter model
const Vote = require("../Models/VoteSchema");
const Candidate = require("../Models/CandidateSchema");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  try {
    console.log("hello");
    const { full_name, email, phone_number, age, password } = req.body;
    const token = jwt.sign({ email: req.body.email }, process.env.secretKey);

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const emailExists = await User.findOne({ email: email }).exec();
      if (emailExists) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }
    } catch (err) {
      console.log(err);
    }

    const phoneExists = await User.findOne({
      phone_number: phone_number,
    }).exec();
    if (phoneExists) {
      return res
        .status(400)
        .json({ message: "User with this phone number already exists" });
    }

    const user = new User({
      full_name: full_name,
      email: email,
      phone_number: phone_number,
      age: age,
      password: hashedPassword,
    });

    user
      .save()
      .then((result) => {
        return res.status(200).json({
          token: token,
          message: "User created successfully",
          data: result,
        });
      })
      .catch((err) => {
        console.error(err);
        return res
          .status(400)
          .json({ message: "Failed to create user", error: err });
      });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};
exports.loginUser = async (req, res) => {
  try {
    var email = req.body.email;
    var password = req.body.password;
    var tok = jwt.sign({ email: req.body.email }, process.env.secretKey);
    var query = await User.findOne({ email: email }).exec();
    if (query) {
      const result = await bcrypt.compare(password, query.password);
      if (result) {
        return res.status(200).json({
          message: "Login Successfull",
          token: tok,
        });
      } else {
        return res.status(401).json({ message: "password is incorrect" });
      }
    } else {
      return res.status(404).json({ message: "User does not exist" });
    }
  } catch (err) {
    return res.status(401).send(err);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const email = req.params.email;
    console.log(email);
    const user = await User.findOne({ email: email }).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};

exports.createCandidate = async (req, res) => {
  try {
    const { id, candidate_name, candidate_party } = req.body;

    const newCandidate = new Candidate({
      id: id,
      candidate_name: candidate_name,
      candidate_party: candidate_party,
    });

    const savedCandidate = await newCandidate.save();

    return res.status(201).json({
      message: "Candidate created successfully",
      candidate: savedCandidate,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().exec();
    return res.status(200).json(candidates);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};
exports.voteCnadidate = async (req, res) => {
  try {
    const candidateId = req.params.candidateId;
    const email = req.params.email;

    var user = await User.findOne({ email: email }).exec();
    console.log(user);
    if (user.isVote) {
      return res
        .status(400)
        .json({ message: "You are not allowed to vote again" });
    }

    var candidate = await Candidate.findOne({ id: candidateId }).exec();
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    candidate.votes += 1;
    await candidate.save();

    user.isVote = true;
    await user.save();

    return res.status(200).json({ message: "Vote counted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};
