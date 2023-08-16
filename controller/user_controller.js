const model = require("../model");

const User = model.User;
const Candidate = model.Candidate;
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  try {
    console.log("hello");
    const { name, email, phone, age, password } = req.body;

    // Generate a JWT token
    const token = jwt.sign({ email: req.body.email }, process.env.secretKey);

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the email or phone already exists
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

    const phoneExists = await User.findOne({ phone: phone }).exec();
    if (phoneExists) {
      return res
        .status(400)
        .json({ message: "User with this phone number already exists" });
    }

    // Create a new user instance
    const user = new User({
      name: name,
      email: email,
      phone: phone,
      age: age,
      password: hashedPassword,
    });

    // Save the user to the database
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
    // Find the user based on the provided email
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

    // Create a new candidate instance
    const newCandidate = new Candidate({
      id: id,
      candidate_name: candidate_name,
      candidate_party: candidate_party,
    });

    // Save the candidate to the database
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
    // Fetch all candidates from the database
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
    const email = req.params.email; // Corrected parameter name

    // Check if the user is allowed to vote
    var user = await User.findOne({ email: email }).exec();
    console.log(user);
    if (user.isVote) {
      return res
        .status(400)
        .json({ message: "You are not allowed to vote again" });
    }

    // Find the candidate and update their votes
    var candidate = await Candidate.findOne({ id: candidateId }).exec();
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Update the candidate's votes
    candidate.votes += 1;
    await candidate.save();

    // Update the user's isVote field to true
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
