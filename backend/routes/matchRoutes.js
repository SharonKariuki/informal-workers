import express from "express";

const router = express.Router();

router.get("/:workerId", async (req, res) => {
  try {
    const { workerId } = req.params;

    // In reality, you'd match jobs based on worker profile
    // For now, send dummy jobs
    const jobs = [
      {
        _id: "job1",
        title: "Electrician Job",
        description: "Fix electrical wiring in office buildings.",
        location: "Nairobi",
      },
      {
        _id: "job2",
        title: "Plumbing Repair",
        description: "Repair leaking pipes for residential homes.",
        location: "Mombasa",
      },
      {
        _id: "job3",
        title: "Painting Service",
        description: "Interior and exterior painting for commercial spaces.",
        location: "Kisumu",
      },
    ];

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
