'use client';

import { useEffect, useState } from 'react';

export default function WorkerDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setErrorMsg('');

        // Step 1 — fetch profile
        const profileRes = await fetch('http://localhost:5000/api/workers/me', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!profileRes.ok) {
          const errText = await profileRes.text();
          throw new Error(`Profile fetch failed: ${errText}`);
        }

        const profileData = await profileRes.json();
        setProfile(profileData);

        // Step 2 — fetch jobs if profile._id exists
        if (profileData?._id) {
          const jobsRes = await fetch(
            `http://localhost:5000/api/match/${profileData._id}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (!jobsRes.ok) {
            const errText = await jobsRes.text();
            throw new Error(`Job match fetch failed: ${errText}`);
          }

          const jobsData = await jobsRes.json();
          setMatchedJobs(jobsData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setErrorMsg(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-indigo-900 mb-2">
            Worker Dashboard
          </h1>
          <p className="text-lg text-indigo-600">
            Manage your profile and job opportunities
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : errorMsg ? (
          <div className="text-center text-red-600 text-lg font-medium mt-10">
            {errorMsg}
          </div>
        ) : (
          <>
            {profile && (
              <div className="bg-white p-6 rounded-xl shadow-lg mb-8 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-indigo-900">
                      {profile.firstName || ''} {profile.lastName || ''}
                    </h2>
                    <p className="text-indigo-600">{profile.email || ''}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-indigo-500 uppercase tracking-wider">
                      Contact
                    </h3>
                    <p className="mt-1 text-indigo-900">
                      {profile.phone || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-indigo-500 uppercase tracking-wider">
                      Member Since
                    </h3>
                    <p className="mt-1 text-indigo-900">
                      {profile.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <section className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-indigo-900">
                  Your Job Matches
                </h2>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {matchedJobs.length} opportunities
                </span>
              </div>

              {matchedJobs.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-indigo-900">
                    No matched jobs yet
                  </h3>
                  <p className="mt-1 text-indigo-600">
                    We'll notify you when we find perfect matches for your
                    skills.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {matchedJobs.map((job) => (
                    <div
                      key={job._id}
                      className="group p-5 border border-indigo-100 rounded-lg transition-all duration-300 hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-md"
                    >
                      <div className="flex items-start">
                        <div className="bg-indigo-100 group-hover:bg-indigo-200 p-2 rounded-lg mr-4 transition-colors duration-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-indigo-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-indigo-900 group-hover:text-indigo-700 transition-colors duration-300">
                            {job.title || 'Untitled Job'}
                          </h3>
                          <p className="mt-2 text-indigo-600">
                            {job.description || 'No description'}
                          </p>
                          <div className="mt-3 flex items-center text-sm text-indigo-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {job.location || 'Remote'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}


