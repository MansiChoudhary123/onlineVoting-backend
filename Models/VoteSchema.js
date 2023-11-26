const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const voteSchema = new Schema({
  candidate: { type: Schema.Types.ObjectId, ref: "Candidate", required: true },
  election: { type: Schema.Types.ObjectId, ref: "Election", required: true },
  time_cast: { type: Date, default: Date.now },
});

const Vote = mongoose.model("Vote", voteSchema);
module.exports = Vote;
