const express = require("express");
const user_controller = require("./controller/user_controller");

const router = express.Router();

router
  .post("/register/user", user_controller.createUser)
  .post("/login/user", user_controller.loginUser)
  .get("/profile/user/:email", user_controller.getProfile)
  .post("/create/candidate/", user_controller.createCandidate)
  .get("/get/candidates/", user_controller.getAllCandidates)
  .post("/add/vote/:candidateId/:email", user_controller.voteCnadidate);

exports.router = router;
