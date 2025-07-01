'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmModal from "../../../components/ConfirmModal";

export default function EmployerDashboardPage() {
  const [profile, setProfile] = useState({
    companyName: "Tech Innovations Inc.",
    email: "contact@techinnovations.com",
    companyWebsite: "https://techinnovations.com"
  });
  
  const [jobs, setJobs] = useState([
    {
      _id: "1",
      title: "Senior Frontend Developer",
      description: "We're looking for an experienced frontend developer to join our team.",
      status: "active",
      createdAt: new Date().toISOString(),
      location: "Remote",
      jobType: "Full-time",
      applications: 12,
      salaryRange: { min: 90000, max: 120000 }
    },
    {
      _id: "2",
      title: "UX Designer",
      description: "Join our design team to create beautiful user experiences.",
      status: "active",
      createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      location: "San Francisco, CA",
      jobType: "Full-time",
      applications: 8,
      salaryRange: { min: 85000, max: 110000 }
    }
  ]);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [jobIdToDelete, setJobIdToDelete] = useState(null);
  const router = useRouter();

  const handleDeleteJob = async () => {
    setJobs(jobs.filter((job) => job._id !== jobIdToDelete));
    setModalOpen(false);
    setJobIdToDelete(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { 
        color: 'bg-emerald-100/80 text-emerald-800 border-emerald-200', 
        text: 'Active',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      },
      draft: { 
        color: 'bg-amber-100/80 text-amber-800 border-amber-200', 
        text: 'Draft',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        )
      },
      closed: { 
        color: 'bg-gray-100/80 text-gray-800 border-gray-200', 
        text: 'Closed',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      }
    };
    return statusMap[status] || statusMap.draft;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-25 to-blue-50/50 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 font-serif tracking-tight">
              Employer <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Dashboard</span>
            </h1>
            <p className="text-lg text-indigo-600/90">
              Manage your profile and job postings with precision
            </p>
          </div>
          <button
            onClick={() => router.push('/pages/jobs/post')}
            className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-indigo-700 hover:to-blue-700 flex items-center group"
          >
            <span className="relative z-10 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Post New Job
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-indigo-100/50 transition-all duration-300 hover:shadow-xl hover:border-indigo-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-indigo-100/80 to-blue-100/80 p-3 rounded-xl shadow-inner border border-indigo-200/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-indigo-900">
                  {profile.companyName}
                </h2>
                <p className="text-indigo-600/90">{profile.email}</p>
                <a 
                  href={profile.companyWebsite} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm mt-1 inline-flex items-center transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {profile.companyWebsite.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
            <button
              onClick={() => router.push('/pages/employers/edit-profile')}
              className="bg-white border border-indigo-200/70 text-indigo-700 px-5 py-2.5 rounded-xl hover:bg-indigo-50/50 transition-all duration-300 flex items-center shadow-sm hover:shadow-md group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600/90 group-hover:text-indigo-700 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-indigo-100/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <h3 className="text-indigo-800/90 font-medium">Total Jobs</h3>
              <div className="bg-indigo-100/70 p-2 rounded-lg border border-indigo-200/30 group-hover:bg-indigo-200/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-indigo-900 mt-4">{jobs.length}</p>
            <div className="mt-2 h-1 bg-indigo-100/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-400/70 to-blue-400/70 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (jobs.length / 10) * 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-blue-100/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <h3 className="text-blue-800/90 font-medium">Active Jobs</h3>
              <div className="bg-blue-100/70 p-2 rounded-lg border border-blue-200/30 group-hover:bg-blue-200/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-blue-900 mt-4">
              {jobs.filter(job => job.status === 'active').length}
            </p>
            <div className="mt-2 h-1 bg-blue-100/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400/70 to-indigo-400/70 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (jobs.filter(job => job.status === 'active').length / 10) * 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-indigo-100/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <h3 className="text-indigo-800/90 font-medium">Applications</h3>
              <div className="bg-indigo-100/70 p-2 rounded-lg border border-indigo-200/30 group-hover:bg-indigo-200/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-indigo-900 mt-4">
              {jobs.reduce((acc, job) => acc + (job.applications || 0), 0)}
            </p>
            <div className="mt-2 h-1 bg-indigo-100/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-400/70 to-blue-400/70 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (jobs.reduce((acc, job) => acc + (job.applications || 0), 0) / 50) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Jobs Section */}
        <section className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-indigo-100/50 transition-all duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-indigo-900 font-serif">Your Job Postings</h2>
              <p className="text-indigo-600/90 mt-1">Manage and review your current job listings</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${jobs.length > 0 ? 'bg-indigo-100/70 text-indigo-800 border border-indigo-200/50' : 'bg-gray-100 text-gray-800'}`}>
                {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'}
              </span>
              <button 
                className="p-2 text-indigo-600/90 hover:bg-indigo-100/50 rounded-lg transition-all duration-300 hover:rotate-180"
                onClick={() => window.location.reload()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-indigo-100/50 rounded-xl bg-indigo-50/20">
              <div className="mx-auto w-24 h-24 bg-indigo-100/50 rounded-full flex items-center justify-center mb-6 border border-indigo-200/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-indigo-900">No jobs posted yet</h3>
              <p className="mt-2 text-indigo-600/90 max-w-md mx-auto mb-6">
                Start attracting top talent by creating your first job posting
              </p>
              <button
                onClick={() => router.push('/pages/jobs/post')}
                className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:from-indigo-700 hover:to-blue-700 inline-flex items-center"
              >
                <span className="relative z-10 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Post a Job
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => {
                const status = getStatusBadge(job.status || 'draft');
                return (
                  <div
                    key={job._id}
                    className="relative overflow-hidden border border-indigo-100/50 p-6 rounded-xl transition-all duration-300 hover:shadow-md hover:border-indigo-200/70 group bg-white/90 backdrop-blur-sm"
                  >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/20 to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    
                    <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-4 z-10">
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold text-indigo-900 group-hover:text-indigo-700 transition-colors duration-300">
                              {job.title}
                            </h3>
                            <div className="flex items-center mt-2 space-x-3">
                              <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full border ${status.color}`}>
                                {status.icon}
                                {status.text}
                              </span>
                              <span className="text-sm text-indigo-600/90">
                                Posted: {formatDate(job.createdAt)}
                              </span>
                            </div>
                          </div>
                          <span className="text-lg font-semibold text-indigo-800 whitespace-nowrap">
                            KSH{job.salaryRange?.min?.toLocaleString() || '0'} - KSH{job.salaryRange?.max?.toLocaleString() || '0'}
                          </span>
                        </div>
                        
                        <p className="mt-3 text-indigo-700/90 line-clamp-2">
                          {job.description}
                        </p>
                        
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-600/90">
                          <span className="inline-flex items-center bg-indigo-50/50 px-2.5 py-0.5 rounded-full border border-indigo-100/50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location || 'Remote'}
                          </span>
                          <span className="inline-flex items-center bg-indigo-50/50 px-2.5 py-0.5 rounded-full border border-indigo-100/50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {job.jobType || 'Full-time'}
                          </span>
                          <span className="inline-flex items-center bg-indigo-50/50 px-2.5 py-0.5 rounded-full border border-indigo-100/50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {job.applications || 0} {job.applications === 1 ? 'Application' : 'Applications'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex md:flex-col gap-2">
                        <button
                          onClick={() => router.push(`/pages/employer/applications/${job._id}`)}
                          className="bg-indigo-50/70 text-indigo-700 p-2.5 rounded-lg hover:bg-indigo-100/70 transition-all duration-300 flex items-center group border border-indigo-100/50 hover:border-indigo-200/70"
                          title="View Applications"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => router.push(`/pages/employer/edit-job/${job._id}`)}
                          className="bg-blue-50/70 text-blue-700 p-2.5 rounded-lg hover:bg-blue-100/70 transition-all duration-300 flex items-center group border border-blue-100/50 hover:border-blue-200/70"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setJobIdToDelete(job._id);
                            setModalOpen(true);
                          }}
                          className="bg-red-50/70 text-red-700 p-2.5 rounded-lg hover:bg-red-100/70 transition-all duration-300 flex items-center group border border-red-100/50 hover:border-red-200/70"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this job posting? This action cannot be undone."
        onClose={() => setModalOpen(false)}
        onConfirm={handleDeleteJob}
        confirmText="Delete"
        confirmColor="bg-red-600 hover:bg-red-700"
      />
    </main>
  );
}
