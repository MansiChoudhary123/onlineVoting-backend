const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVote: {
    type: Boolean,
    default: false,
  },
});

const candidateSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  candidate_name: {
    type: String,
    required: true,
  },
  candidate_party: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
});

const Candidate = mongoose.model("Candidate", candidateSchema);
const User = mongoose.model("User", userSchema);

module.exports = {
  User: User,
  Candidate: Candidate,
};
