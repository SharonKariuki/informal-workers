const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Admin = require("../models/Admin");
const User = require("../models/User");
const Worker = require("../models/Worker");
const Employer = require("../models/Employer");
const Job = require("../models/jobModels");
const Review = require("../models/Review");
const Banner = require("../models/Banner");

// 🔐 Generate JWT
const signAdminToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: "admin",
      isVerified: admin.isVerified,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// 🟩 Admin Sign In
exports.adminSignin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return res.status(401).json({ message: "Admin not found or invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = signAdminToken(admin);

    res.status(200).json({
      token,
      user: {
        id: admin._id,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin signin error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// 📋 Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("worker", "-__v")
      .populate("employer", "-__v");
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// 📊 Dashboard stats
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const workers = await Worker.countDocuments();
    const employers = await Employer.countDocuments();
    const verifiedWorkers = await Worker.countDocuments({ kycStatus: "verified" });
    const jobs = await Job.countDocuments();

    res.status(200).json({ totalUsers, workers, employers, verifiedWorkers, jobs });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// 🕵️ Workers with pending KYC
exports.getPendingKYC = async (req, res) => {
  try {
    const pending = await Worker.find({ kycStatus: "pending" }).select("-__v");
    res.status(200).json(pending);
  } catch (error) {
    console.error("Error fetching KYC:", error);
    res.status(500).json({ error: "Failed to fetch KYC data" });
  }
};

// ✅ Update KYC Status
exports.updateKYCStatus = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  if (!["approve", "reject"].includes(action)) {
    return res.status(400).json({ error: "Invalid action. Must be 'approve' or 'reject'." });
  }

  const status = action === "approve" ? "verified" : "rejected";

  try {
    const worker = await Worker.findByIdAndUpdate(id, { kycStatus: status }, { new: true });
    if (!worker) {
      return res.status(404).json({ error: "Worker not found." });
    }
    res.status(200).json(worker);
  } catch (err) {
    console.error("Error updating KYC status:", err);
    res.status(500).json({ error: "Failed to update KYC status" });
  }
};

// 📄 All Job Posts
exports.getJobPosts = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

// 🔄 Update Job Status
exports.updateJobStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const job = await Job.findByIdAndUpdate(id, { status }, { new: true });
    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }
    res.status(200).json(job);
  } catch (err) {
    console.error("Error updating job status:", err);
    res.status(500).json({ error: "Failed to update job" });
  }
};

// ⭐ Get All Reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// ❌ Delete Review
exports.deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found." });
    }
    res.status(200).json({ message: "Review deleted" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ error: "Failed to delete review" });
  }
};

// 🖼️ Get All Banners
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json(banners);
  } catch (err) {
    console.error("Error fetching banners:", err);
    res.status(500).json({ error: "Failed to fetch banners" });
  }
};

// ➕ Add Banner
exports.addBanner = async (req, res) => {
  const { imageUrl, title, link } = req.body;
  try {
    const banner = await Banner.create({ imageUrl, title, link });
    res.status(201).json(banner);
  } catch (err) {
    console.error("Error adding banner:", err);
    res.status(500).json({ error: "Failed to add banner" });
  }
};

// ✅ Update User Approval Status

// ✅ Update User Approval Status

exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { approved } = req.body;

  console.log("📥 Incoming user status update:", { id, approved });

  if (typeof approved !== "boolean") {
    console.error("❌ Invalid 'approved' type:", typeof approved);
    return res.status(400).json({ error: "'approved' must be a boolean (true or false)" });
  }

  try {
    console.log("📥 Incoming user status update:", { id, approved });

    const user = await User.findById(id);
    if (!user) {
      console.error("❌ User not found with ID:", id);
      return res.status(404).json({ error: "User not found" });
    }

if (user.role === "worker" && user.worker) {
  await Worker.findByIdAndUpdate(user.worker, { profileApproved: approved });
} else if (user.role === "employer" && user.employer) {
  await Employer.findByIdAndUpdate(user.employer, { profileApproved: approved });
} else {
  console.warn("Invalid role or missing profile link:", user);
  return res.status(400).json({ error: "Invalid user role or missing profile reference." });
}

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        profileApproved: approved,
        isProfileComplete: approved,
      },
      { new: true }
    ).populate("worker").populate("employer");

    res.status(200).json({
      message: `User profile ${approved ? "approved" : "rejected"} successfully.`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Error in updateUserStatus handler:", error);
    res.status(500).json({ error: error.message || "Failed to update user status" });
  }
};
