const Admin = require("../Models/AdminSchema");
const Election = require("../Models/ElectionSchema"); // Your Mongoose Election model
exports.createElection = async (req, res) => {
  try {
    const newElection = new Election(req.body);
    const savedElection = await newElection.save();
    res.status(201).json(savedElection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getElection = async (req, res) => {
  const electionId = req.params.election_id; // Assuming you're using route parameters

  try {
    if (electionId) {
      const election = await Election.findById(electionId);

      if (!election) {
        return res.status(404).json({ error: "Election not found" });
      }

      if (election.expiry_date < new Date()) {
        election.status = "Closed";
        await election.save();
      }

      res.status(200).json(election);
    } else {
      const elections = await Election.find({});
      res.status(200).json(elections);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getElectionDetailById = async (req, res) => {
  const { election_id } = req.params;

  try {
    if (election_id) {
      const election = await Election.findById(election_id);

      if (!election) {
        return res.status(404).json({ error: "Election not found" });
      }

      if (election.expiry_date < new Date()) {
        election.status = "Closed";
        await election.save();
      }

      res.status(200).json(election);
    } else {
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getElectionViaAdmin = async (req, res) => {
  const { admin_id } = req.params;

  if (!admin_id) {
    return res.status(400).json({ error: "Admin ID must be provided." });
  }

  try {
    const admin = await Admin.findById(admin_id);

    if (!admin) {
      return res.status(404).json({ error: "Admin not found." });
    }

    const elections = await Election.find({ created_by: admin_id });

    if (elections.length === 0) {
      return res
        .status(404)
        .json({ message: "No elections found for the given admin." });
    }

    res.status(200).json(elections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getELectionList = async (req, res) => {
  try {
    const elections = await Election.find().select("-password");
    res.status(200).json(elections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
