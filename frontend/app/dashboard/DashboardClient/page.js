"use client";

import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import DashboardStats from "../../../components/sections/DashboardStats";
import UserManagement from "../../../components/sections/UserManagement";
import KYCManagement from "../../../components/sections/KYCManagement";
import CourseManagement from "../../../components/sections/CourseManagement";

export default function DashboardClient({ session }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    users: [],
    kycData: [],
    courses: []
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, kycRes, coursesRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/kyc"),
        fetch("/api/courses"),
      ]);

      if (!usersRes.ok || !kycRes.ok || !coursesRes.ok) {
        throw new Error("Failed to fetch one or more datasets.");
      }

      const users = await usersRes.json();
      const kycData = await kycRes.json();
      const courses = await coursesRes.json();

      setData({ users, kycData, courses });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleKYCAction = async (kycId, action) => {
    try {
      const response = await fetch(`/api/kyc/${kycId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) throw new Error("Action failed");

      toast.success(`KYC ${action}d successfully`);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.message || `Failed to ${action} KYC`);
    }
  };

  const handleCourseAction = async (courseId, action, updates = {}) => {
    try {
      const method = action === "delete" ? "DELETE" : "PATCH";
      const response = await fetch(`/api/courses/${courseId}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method !== "DELETE" ? JSON.stringify({ action, ...updates }) : undefined,
      });

      if (!response.ok) throw new Error("Action failed");

      toast.success(`Course ${action === "update" ? "updated" : action + "d"} successfully`);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.message || `Failed to ${action} course`);
    }
  };

  const handleAddCourse = async (newCourse) => {
    try {
      const response = await fetch(`/api/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) throw new Error("Failed to add course.");

      toast.success("Course added successfully!");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to add course.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6 md:p-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-2">KaziLink Admin Dashboard</h1>
          <p className="text-indigo-800">Welcome, {session.user.email}</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-indigo-900">Loading dashboard data...</div>
        ) : (
          <>
            <DashboardStats
              stats={{
                users: data.users.length,
                kyc: data.kycData.length,
                courses: data.courses.length,
              }}
              className="mb-10"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center">
                    <span className="w-2 h-6 bg-indigo-600 rounded-full mr-3"></span>
                    User Management
                  </h2>
                  <UserManagement users={data.users} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center">
                    <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
                    KYC Management
                  </h2>
                  <KYCManagement
                    kycData={data.kycData}
                    onApprove={(kycId) => handleKYCAction(kycId, "approve")}
                    onReject={(kycId) => handleKYCAction(kycId, "reject")}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center">
                  <span className="w-2 h-6 bg-indigo-500 rounded-full mr-3"></span>
                  Course Management
                </h2>
                <CourseManagement
                  courses={data.courses}
                  onStatusChange={(courseId, action) => handleCourseAction(courseId, action)}
                  onEdit={(courseId, updates) => handleCourseAction(courseId, "update", updates)}
                  onDelete={(courseId) => handleCourseAction(courseId, "delete")}
                  onAdd={handleAddCourse}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
