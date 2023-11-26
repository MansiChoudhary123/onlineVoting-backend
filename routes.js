const express = require("express");
const router = express.Router();

const admin_controller = require("./controller/admin_controller");
const candidate_controller = require("./controller/candidate_controller");
const election_controller = require("./controller/election_controller");
const user_controller = require("./controller/user_controller");

router
  .post("/admin/register", admin_controller.createAdmin)
  .get("/admins", admin_controller.getAdmins)
  .post("/admin/login", admin_controller.adminLogin)

  .post("/candidates/add", candidate_controller.addCandidate)
  .put("/candidates/edit/:id", candidate_controller.editCandidate)
  .patch("/candidates/edit/:id", candidate_controller.editCandidate)
  .delete("/candidates/delete/:id", candidate_controller.deleteCandidate)
  .get(
    "/elections/:election_id/candidates",
    candidate_controller.candidatesByElection
  )
  .get(
    "/result/elections/:election_id/candidates",
    candidate_controller.getResultByElectionId
  )
  .post("/create/election/", election_controller.createElection)
  .post(
    "/elections/check-password",
    candidate_controller.checkPasswordForElection
  )
  .get(
    "/elections/admin/:election_id",
    election_controller.getElectionDetailById
  )
  .get("/elections/admin/id/:admin_id", election_controller.getElectionViaAdmin)
  .get("/elections/list/all", election_controller.getELectionList)

  .post("/votes/add", candidate_controller.addVote)

  .post("/register/user", user_controller.createUser)
  .post("/login/user", user_controller.loginUser)
  .get("/profile/user/:email", user_controller.getProfile)
  .post("/create/candidate", user_controller.createCandidate)
  .get("/get/candidates", user_controller.getAllCandidates)
  .post("/add/vote/:candidateId/:email", user_controller.voteCnadidate);

module.exports = router;
