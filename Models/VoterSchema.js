const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voterSchema = new Schema({
  full_name: { type: String, required: true, maxlength: 255 },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  phone_number: { type: String, required: true, maxlength: 20 },
  password: { type: String, required: true, maxlength: 128 },
  photo: { type: String },
  participated_in: { type: Schema.Types.ObjectId, ref: "Election", null: true },
});

const Voter = mongoose.model("Voter", voterSchema);
module.exports = Voter;
