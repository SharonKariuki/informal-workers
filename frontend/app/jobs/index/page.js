"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/Layouts/Layout';




export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs');
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <Layout title="Browse Jobs">
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Find Your Next Opportunity</h1>
            <p className="mt-2 text-lg text-gray-600">
              Browse through our job listings
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {jobs.map((job) => (
                <div 
                  key={job.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/jobs/${job.id}`)}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{job.company}</p>
                    <p className="mt-2 text-gray-600">{job.location}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="px-2 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded-full">
                        {job.type}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        ${job.salaryRange?.min} - ${job.salaryRange?.max}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No jobs available</h3>
              <p className="mt-2 text-gray-600">Check back later for new opportunities</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
