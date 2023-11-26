const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Election = require("./ElectionSchema");
const candidateSchema = new Schema({
  name: { type: String, required: true, maxlength: 255 },
  subinformation: { type: String, default: "" },
  election: { type: Schema.Types.ObjectId, ref: "Election", null: true },
});

const Candidate = mongoose.model("Candidate", candidateSchema);
module.exports = Candidate;
