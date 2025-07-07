'use client';

import { useState } from 'react';

export default function Post() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    minSalary: '',
    maxSalary: '',
    remoteWork: '',
    jobDescription: '',
    requirements: '',
    applicationEmail: '',
    externalUrl: '',
    screeningQuestion: '',
    requireResume: false,
    requireCoverLetter: false,
  });

  const [hasScreening, setHasScreening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess(false);

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to post a job.');
    }

    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // ✅ Send token here
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Something went wrong');
    }

    setSuccess(true);
    setFormData({
      jobTitle: '',
      location: '',
      jobType: '',
      experienceLevel: '',
      minSalary: '',
      maxSalary: '',
      remoteWork: '',
      jobDescription: '',
      requirements: '',
      applicationEmail: '',
      externalUrl: '',
      screeningQuestion: '',
      requireResume: false,
      requireCoverLetter: false,
    });
    setHasScreening(false);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-16 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Floating header */}
        <div className="sticky top-20 z-10 bg-white/90 backdrop-blur-md shadow-sm py-4 px-6 rounded-xl mb-8 border border-indigo-100">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-indigo-900 font-serif tracking-tight">
                Post a New Job
              </h1>
              <p className="text-sm text-indigo-500">
                Fill out the form below to list your opportunity
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="px-4 py-2 border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-all duration-200 text-sm whitespace-nowrap"
              >
                Save Draft
              </button>
              <button
                type="submit"
                form="jobForm"
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm whitespace-nowrap"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publishing...
                  </span>
                ) : 'Publish Job'}
              </button>
            </div>
          </div>
        </div>

        <form
          id="jobForm"
          onSubmit={handleSubmit}
          className="space-y-8 pb-20"
        >
          {/* Success/Error messages */}
          {(success || error) && (
            <div className={`p-4 rounded-xl ${success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <div className="flex items-center">
                {success ? (
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className="font-medium">{success ? 'Job posted successfully!' : error}</span>
              </div>
            </div>
          )}

          {/* Job Details */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-indigo-50 transition-all hover:shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-indigo-900 font-serif">Job Details</h2>
                <p className="text-sm text-indigo-500">Basic information about the position</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div className="space-y-1 col-span-2">
                <label className="block text-sm font-medium text-indigo-700">Job Title *</label>
                <div className="relative">
                  <input
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="w-full border border-indigo-100 p-3 rounded-lg text-indigo-900 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all pl-10"
                    type="text"
                    placeholder="Senior Software Engineer"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-140 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-indigo-700">Location *</label>
                <div className="relative">
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full border border-indigo-100 p-3 rounded-lg text-indigo-900 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all pl-10"
                    type="text"
                    placeholder="Nairobi, Kenya"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-80 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Job Type */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-indigo-700">Job Type *</label>
                <div className="relative">
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full border border-indigo-100 p-3 rounded-lg text-indigo-900 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all appearance-none pl-10"
                    required
                  >
                    <option value="">Select job type</option>
                    <option>Full-Time</option>
                    <option>Part-Time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                    <option>Temporary</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Experience Level */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-indigo-700">Experience Level *</label>
                <div className="relative">
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full border border-indigo-100 p-3 rounded-lg text-indigo-900 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all appearance-none pl-10"
                    required
                  >
                    <option value="">Select experience level</option>
                    <option>Internship</option>
                    <option>Entry Level</option>
                    <option>Mid Level</option>
                    <option>Senior Level</option>
                    <option>Director</option>
                    <option>Executive</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Salary Range */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-indigo-700">Minimum Salary</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* <span className="text-gray-500">KSH</span> */}
                  </div>
                  <input
                    name="minSalary"
                    value={formData.minSalary}
                    onChange={handleChange}
                    className="w-full border border-indigo-100 p-3 rounded-lg text-indigo-900 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all pl-10"
                    type="number"
                    placeholder="e.g. 50000"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm">KSH</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-indigo-700">Maximum Salary</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* <span className="text-gray-500">$</span> */}
                  </div>
                  <input
                    name="maxSalary"
                    value={formData.maxSalary}
                    onChange={handleChange}
                    className="w-full border border-indigo-100 p-3 rounded-lg text-indigo-900 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all pl-10"
                    type="number"
                    placeholder="e.g. 80000"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm">KSH</span>
                  </div>
                </div>
              </div>

              {/* Remote Work Options */}
              <div className="space-y-3 col-span-2">
                <label className="block text-sm font-medium text-indigo-700">Remote Work Options *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['On-site only', 'Hybrid', 'Remote only'].map((option) => (
                    <label key={option} className="inline-flex items-center p-3 rounded-lg border border-indigo-100 hover:bg-indigo-50 transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="remoteWork"
                        value={option}
                        checked={formData.remoteWork === option}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-300 border-indigo-200 transition-all"
                        required
                      />
                      <span className="ml-2 text-indigo-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-3 col-span-2">
                <label className="block text-sm font-medium text-indigo-700">Job Description *</label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  className="w-full border border-indigo-100 p-3 rounded-lg text-indigo-900 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all min-h-[180px]"
                  placeholder="Describe the role, responsibilities, and ideal candidate..."
                  required
                />
              </div>

              {/* Requirements */}
              <div className="space-y-3 col-span-2">
                <label className="block text-sm font-medium text-indigo-700">Requirements *</label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  className="w-full border border-indigo-100 p-3 rounded-lg text-indigo-900 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all min-h-[180px]"
                  placeholder="List the skills, qualifications, and experience required..."
                  required
                />
              </div>
            </div>
          </section>

          {/* Application Settings */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-indigo-50 transition-all hover:shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-indigo-900 font-serif">Application Settings</h2>
                <p className="text-sm text-indigo-500">How candidates will apply for this position</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Application Email */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-indigo-700">Application Email *</label>
                <div className="relative">
                  <input
                    name="applicationEmail"
                    value={formData.applicationEmail}
                    onChange={handleChange}
                    className="w-full border border-indigo-100 p-3 rounded-lg text-indigo-900 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all pl-10"
                    type="email"
                    placeholder="careers@company.com"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-140 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* External URL */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-indigo-700">External Application URL</label>
                <div className="relative">
                  <input
                    name="externalUrl"
                    value={formData.externalUrl}
                    onChange={handleChange}
                    className="w-full border border-indigo-100 p-3 rounded-lg text-indigo-900 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all pl-10"
                    type="url"
                    placeholder="https://apply.example.com"
                  />
                  <div className="absolute inset-y-0 left-0 pl-140 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

          </section>
        </form>
      </div>
    </div>
  );
}