"use client";

import { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

export default function CourseManagement({ initialCourses }) {
  const [courses, setCourses] = useState(initialCourses || []);

  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    published: false,
  });

  // Re-fetch courses from the API
  async function fetchCourses() {
    const res = await fetch("/api/courses", { cache: "no-store" });
    const data = await res.json();
    setCourses(data);
  }

  const handleAddSubmit = async () => {
    await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCourse),
    });

    setIsAdding(false);
    setNewCourse({
      title: '',
      description: '',
      published: false,
    });

    fetchCourses();
  };

  const handleEditSubmit = async (courseId) => {
    await fetch(`/api/courses/${courseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editedTitle,
        description: editedDescription,
      }),
    });

    setEditingId(null);
    fetchCourses();
  };

  const handleStatusChange = async (courseId, action) => {
    await fetch(`/api/courses/${courseId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
      }),
    });

    fetchCourses();
  };

  const confirmDelete = (courseId) => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this course?",
      buttons: [
        {
          label: "Delete",
          onClick: () => handleDelete(courseId),
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  const handleDelete = async (courseId) => {
    await fetch(`/api/courses/${courseId}`, {
      method: "DELETE",
    });

    fetchCourses();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
        >
          Add New Course
        </button>
      </div>

      {isAdding && (
        <div className="border border-indigo-100 rounded-lg p-6 bg-white shadow-sm">
          <h3 className="font-semibold mb-4 text-lg text-gray-900">Add New Course</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newCourse.title}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, title: e.target.value })
                }
                className="w-full p-2 border border-indigo-200 rounded text-gray-900"
                placeholder="Course title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
                className="w-full p-2 border border-indigo-200 rounded text-gray-900"
                placeholder="Course description"
                rows="3"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                checked={newCourse.published}
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    published: e.target.checked,
                  })
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="published"
                className="ml-2 block text-sm text-gray-700"
              >
                Publish immediately
              </label>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
              >
                Add Course
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="border border-indigo-100 rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col bg-white"
          >
            {editingId === course.id ? (
              <div className="flex-grow">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full p-2 mb-2 border border-indigo-200 rounded text-gray-900"
                  placeholder="Course title"
                />
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full p-2 mb-2 border border-indigo-200 rounded text-gray-900"
                  placeholder="Course description"
                  rows="3"
                />
              </div>
            ) : (
              <div className="flex-grow">
                <h3 className="font-semibold mb-2 text-gray-900">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-800 mb-3 line-clamp-3">
                  {course.description}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center mt-auto">
              <span
                className={`text-sm font-medium ${
                  course.published ? "text-green-600" : "text-gray-600"
                }`}
              >
                {course.published ? "Published" : "Draft"}
              </span>

              <div className="flex gap-2">
                {editingId === course.id ? (
                  <>
                    <button
                      onClick={() => handleEditSubmit(course.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 font-medium"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        handleStatusChange(
                          course.id,
                          course.published ? "unpublish" : "publish"
                        )
                      }
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        course.published
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          : "bg-green-100 text-green-800 hover:bg-green-200"
                      }`}
                    >
                      {course.published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => {
                        setEditedTitle(course.title);
                        setEditedDescription(course.description);
                        setEditingId(course.id);
                      }}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-md text-sm hover:bg-indigo-200 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(course.id)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200 font-medium"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
