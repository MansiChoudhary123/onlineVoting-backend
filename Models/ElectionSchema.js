const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const electionSchema = new Schema({
  election_name: { type: String, required: true, maxlength: 255 },
  generation_date: { type: Date, required: true },
  expiry_date: { type: Date, required: true },
  created_by: { type: Schema.Types.ObjectId, ref: "Admin", null: true },
  access_type: {
    type: String,
    enum: ["OPEN_FOR_ALL", "VIA_URL"],
    default: "OPEN_FOR_ALL",
  },
  password: { type: String, maxlength: 128 },
});

const Election = mongoose.model("Election", electionSchema);
module.exports = Election;
