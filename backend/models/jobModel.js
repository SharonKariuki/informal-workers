import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  requirements: String,
  location: String,
  employer: { type: mongoose.Schema.Types.ObjectId, ref: "Employer" },
});

export default mongoose.model("Job", jobSchema);
