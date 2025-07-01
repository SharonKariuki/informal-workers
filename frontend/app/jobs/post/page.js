'use client';

import { useState } from 'react';

export default function Post() {
  const [hasScreening, setHasScreening] = useState(false);

  return (
    <form className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 transition-all duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-indigo-900 mb-3 font-serif tracking-tight">
            Post a New Job Opportunity
          </h1>
          <p className="text-lg text-indigo-700 max-w-2xl mx-auto">
            Attract top talent with a beautifully crafted job listing. All fields marked with * are required.
          </p>
        </div>

        {/* Job Details section */}
        <section className="bg-white p-8 rounded-xl shadow-lg border border-indigo-100 transition-all hover:shadow-xl">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-6 pb-2 border-b border-indigo-100 font-serif">
            Job Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-1">Job Title *</label>
              <input
                className="w-full border border-indigo-200 p-3 rounded-lg text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                type="text"
                placeholder="e.g. Senior Software Engineer"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-1">Location *</label>
              <input
                className="w-full border border-indigo-200 p-3 rounded-lg text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                type="text"
                placeholder="e.g. San Francisco, CA or Remote"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-1">Job Type *</label>
              <select 
                className="w-full border border-indigo-200 p-3 rounded-lg text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none"
                required
              >
                <option value="">Select job type</option>
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-1">Experience Level *</label>
              <select 
                className="w-full border border-indigo-200 p-3 rounded-lg text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none"
                required
              >
                <option value="">Select experience level</option>
                <option>Entry</option>
                <option>Mid</option>
                <option>Senior</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-1">Minimum Salary (optional)</label>
              <input
                className="w-full border border-indigo-200 p-3 rounded-lg text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                type="number"
                placeholder="e.g. 50000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-1">Maximum Salary (optional)</label>
              <input
                className="w-full border border-indigo-200 p-3 rounded-lg text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                type="number"
                placeholder="e.g. 80000"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-indigo-700 mb-3">
              Remote Work Options *
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="remote" 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-indigo-300 transition-all"
                  required 
                />
                <span className="ml-2 text-indigo-700">On-site only</span>
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="remote" 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-indigo-300 transition-all"
                />
                <span className="ml-2 text-indigo-700">Hybrid</span>
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="remote" 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-indigo-300 transition-all"
                />
                <span className="ml-2 text-indigo-700">Remote only</span>
              </label>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-indigo-700 mb-1">
              Job Description *
            </label>
            <textarea
              className="w-full border border-indigo-200 p-3 rounded-lg text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all min-h-[120px]"
              placeholder="Describe the role, responsibilities, and ideal candidate"
              required
            ></textarea>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-indigo-700 mb-1">
              Requirements *
            </label>
            <textarea
              className="w-full border border-indigo-200 p-3 rounded-lg text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all min-h-[120px]"
              placeholder="List the skills, qualifications, and experience required"
              required
            ></textarea>
          </div>
        </section>

        {/* Application Settings section */}
        <section className="bg-white p-8 rounded-xl shadow-lg border border-indigo-100 transition-all hover:shadow-xl">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-6 pb-2 border-b border-indigo-100 font-serif">
            Application Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-1">Application Email *</label>
              <input
                className="w-full border border-indigo-200 p-3 rounded-lg text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                type="email"
                placeholder="Where applications will be sent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-1">External Application URL</label>
              <input
                className="w-full border border-indigo-200 p-3 rounded-lg text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                type="url"
                placeholder="External application form URL (optional)"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center gap-3 text-indigo-700">
              <input
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-indigo-300 rounded transition-all"
                onChange={(e) => setHasScreening(e.target.checked)}
              />
              <span>Include a screening question for applicants</span>
            </label>

            {hasScreening && (
              <div className="mt-3">
                <input
                  className="w-full border border-indigo-200 p-3 rounded-lg text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  type="text"
                  placeholder="e.g. How many years of experience do you have with React?"
                />
              </div>
            )}
          </div>

          <div className="mt-6 space-y-3 text-indigo-700">
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-indigo-300 rounded transition-all"
              /> 
              <span>Require resume upload</span>
            </label>
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-indigo-300 rounded transition-all"
              /> 
              <span>Require cover letter</span>
            </label>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-indigo-100">
            <div className="mb-4 sm:mb-0">
              <p className="text-sm text-indigo-500">Total</p>
              <p className="text-3xl font-bold text-indigo-800">KSh 50000</p>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                className="px-6 py-3 border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-all duration-200"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Publish Job
              </button>
            </div>
          </div>
        </section>
      </div>
    </form>
  );
}