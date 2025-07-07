"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch job details");
        }

        const data = await res.json();
        setJob(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <p>Loading job details...</p>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <p>Job not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow p-8 rounded">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {job.title}
        </h1>

        <div className="text-gray-600 mb-6">
          <p><strong>Location:</strong> {job.location || "Remote"}</p>
          <p><strong>Job Type:</strong> {job.jobType || "Full-time"}</p>
          <p><strong>Salary:</strong> KSH {job.salaryMin?.toLocaleString()} - KSH {job.salaryMax?.toLocaleString()}</p>
          <p><strong>Status:</strong> {job.status || "Draft"}</p>
        </div>

        <div className="prose max-w-none text-gray-800">
          <p>{job.description}</p>
        </div>

        <div className="mt-8">
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Back
          </button>
        </div>
      </div>
    </main>
  );
}
