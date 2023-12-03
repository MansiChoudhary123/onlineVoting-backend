// POST /candidates/add
const Election = require("../Models/ElectionSchema"); // Your Mongoose Election model
const Voter = require("../Models/VoterSchema"); // Your Mongoose Voter model
const Vote = require("../Models/VoteSchema");
const Candidate = require("../Models/CandidateSchema");
exports.addCandidate = async (req, res) => {
  try {
    const newCandidate = new Candidate(req.body);
    const savedCandidate = await newCandidate.save();
    res.status(201).json(savedCandidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.checkPasswordForElection = async (req, res) => {
  const { password, election_id } = req.body;

  try {
    const election = await Election.findById(election_id);
    if (!election) {
      return res.status(404).json({ error: "Election not found" });
    }

    if (election.password === password) {
      res.status(200).json({ message: "Password is correct" });
    } else {
      res.status(400).json({ error: "Password is incorrect" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.editCandidate = async (req, res) => {
  const { id } = req.params;
  try {
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    for (let key in req.body) {
      if (req.body[key] !== undefined) {
        candidate[key] = req.body[key];
      }
    }

    const updatedCandidate = await candidate.save();
    res.json(updatedCandidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.deleteCandidate = async (req, res) => {
  const { id } = req.params;

  try {
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    await candidate.deleteOne();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.candidatesByElection = async (req, res) => {
  const { election_id } = req.params;

  try {
    const candidates = await Candidate.find({ election: election_id });
    if (!candidates.length) {
      return res
        .status(404)
        .json({ error: "No candidates found for this election." });
    }
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.addVote = async (req, res) => {
  const { voter_email_id, election } = req.body;

  try {
    const voter = await Voter.findOne({ email: voter_email_id });
    if (!voter) {
      return res.status(404).json({ error: "Voter not found" });
    }

    if (voter.participated_in.includes(election)) {
      return res
        .status(400)
        .json({ error: "You have already participated in this election" });
    }

    const newVote = new Vote(req.body);
    await newVote.save();

    voter.participated_in.push(election);
    await voter.save();

    res.status(201).json({ message: "Vote added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getResultByElectionId = async (req, res) => {
  try {
    const electionId = req.params.election_id;

    const candidates = await Candidate.find({ election: electionId });

    const candidatesWithVotes = await Promise.all(
      candidates.map(async (candidate) => {
        const voteCount = await Vote.countDocuments({
          candidate: candidate._id,
        });
        return {
          ...candidate.toObject(),
          voteCount,
        };
      })
    );

    res.status(200).json(candidatesWithVotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
