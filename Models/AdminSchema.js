const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const adminSchema = new Schema({
  full_name: { type: String, required: true, maxlength: 255 },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true, maxlength: 20 },
  password: { type: String, required: true, maxlength: 128 },
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
