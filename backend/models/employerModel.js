import mongoose from "mongoose";

const employerSchema = new mongoose.Schema({
  name: String,
  company: String,
  city: String,
  phone: String,
  email: String,
});

export default mongoose.model("Employer", employerSchema);
