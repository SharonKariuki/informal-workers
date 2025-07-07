"use client";

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function WorkerDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setErrorMsg('');

        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found. Please log in.');

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const profileRes = await fetch(`http://localhost:5000/api/workers/user/${userId}`, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (!profileRes.ok) {
          const errText = await profileRes.text();
          throw new Error(`Profile fetch failed: ${errText}`);
        }

        const profileData = await profileRes.json();
        console.log('Profile data:', profileData);
        setProfile(profileData);
        console.log("loaded profile data:", profileData);

        if (profileData?._id) {
          const jobsRes = await fetch(`http://localhost:5000/api/match/${profileData._id}`, {
            headers: { 'Content-Type': 'application/json' },
          });

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

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
    }
  };

  const renderProfileModal = () => {
    if (!profile) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl relative overflow-y-auto max-h-[90vh] animate-slideUp">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex flex-col items-center md:items-start">
              <div className="relative group mb-4">
                {profile.profilePhoto ? (
                  <div className="relative overflow-hidden rounded-full border-4 border-indigo-100 shadow-lg w-32 h-32">
                    <img
                      src={`http://localhost:5000/uploads/${profile.profilePhoto}`}
                      alt="Profile"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                  </div>
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-full border-4 border-indigo-100 shadow-lg group-hover:bg-gray-200 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 group-hover:text-gray-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <label className="absolute -bottom-2 right-2 bg-indigo-600 text-white rounded-full p-2 cursor-pointer hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input type="file" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-indigo-900 group-hover:text-indigo-700 transition-colors duration-300">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300">{profile.email}</p>
                <p className="text-sm text-gray-500 mt-1 hover:text-gray-700 transition-colors duration-300">
                  Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
                {profile.isApprovedByAdmin && (
                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Trust Verified
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    ),
                    title: "Contact",
                    content: profile.phone || 'Not provided'
                  },
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ),
                    title: "Address",
                    content: profile.address?.street ? 
                      `${profile.address.street}, ${profile.address.city}, ${profile.address.state} ${profile.address.zip}, ${profile.address.country}` : 
                      'Not provided'
                  },
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ),
                    title: "Occupation",
                    content: `${profile.occupation || 'Not specified'} ${profile.experience ? `(${profile.experience} yrs experience)` : ''}`
                  },
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    ),
                    title: "Skills",
                    content: profile.skills?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, i) => (
                          <span key={i} className="bg-white px-3 py-1 rounded-full text-sm text-indigo-700 border border-indigo-200 hover:bg-indigo-50 transition-colors duration-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No skills listed</p>
                    )
                  }
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-indigo-50 p-4 rounded-lg hover:bg-indigo-100 transition-colors duration-300 group"
                  >
                    <h3 className="font-semibold text-indigo-600 mb-2 flex items-center group-hover:text-indigo-800 transition-colors duration-300">
                      {item.icon}
                      {item.title}
                    </h3>
                    <p className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-indigo-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group">
              <h3 className="font-semibold text-indigo-600 mb-4 flex items-center text-lg group-hover:text-indigo-800 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
                Education
              </h3>
              {profile.education?.degree ? (
                <div className="space-y-2 group-hover:text-gray-900 transition-colors duration-300">
                  <p className="text-gray-700">
                    <span className="font-medium">{profile.education.degree}</span> in {profile.education.field}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {profile.education.institution}, graduated {profile.education.completionYear}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 group-hover:text-gray-700 transition-colors duration-300">No education information provided</p>
              )}
            </div>

            <div className="bg-white border border-indigo-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group">
              <h3 className="font-semibold text-indigo-600 mb-4 flex items-center text-lg group-hover:text-indigo-800 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Certification
              </h3>
              {profile.certification?.certificationName ? (
                <div className="space-y-2 group-hover:text-gray-900 transition-colors duration-300">
                  <p className="text-gray-700">
                    <span className="font-medium">{profile.certification.certificationName}</span> - {profile.certification.issuingOrg}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Issued: {new Date(profile.certification.certificationDate).toLocaleDateString()}
                  </p>
                  {profile.certification.certificate && (
                    <a
                      href={`http://localhost:5000/uploads/${profile.certification.certificate}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm mt-2 transition-colors duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Certificate
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 group-hover:text-gray-700 transition-colors duration-300">No certifications provided</p>
              )}
            </div>
          </div>

          <div className="bg-white border border-indigo-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 mb-8 group">
            <h3 className="font-semibold text-red-600 mb-4 flex items-center text-lg group-hover:text-red-800 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Criminal Record
            </h3>
            <p className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
              {profile.criminalRecord?.hasRecord ? (
                profile.criminalRecord.explanation
              ) : (
                <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No criminal record
                </span>
              )}
            </p>
          </div>

          <div className="bg-indigo-50 rounded-lg p-6 hover:bg-indigo-100 transition-colors duration-300 group">
            <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center group-hover:text-indigo-800 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Reviews & Ratings
            </h3>
            <div className="text-center py-8 bg-white rounded-lg shadow-inner hover:shadow-sm transition-shadow duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-indigo-300 mb-4 group-hover:text-indigo-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-indigo-600 font-medium group-hover:text-indigo-700 transition-colors duration-300">Coming soon</p>
              <p className="text-gray-500 text-sm mt-1 group-hover:text-gray-600 transition-colors duration-300">Your reviews and ratings will appear here once clients provide feedback.</p>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center hover:-translate-y-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-900 hover:from-indigo-700 hover:to-indigo-900 transition-all duration-500">
              Professional Dashboard
            </span>
          </h1>
          <p className="text-lg text-indigo-600 max-w-2xl mx-auto hover:text-indigo-800 transition-colors duration-300">
            Manage your profile and discover job opportunities tailored to your unique skills
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 border-opacity-50"></div>
            <div className="absolute animate-ping rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 border-opacity-30"></div>
          </div>
        ) : errorMsg ? (
          <div className="text-center">
            <div className="inline-flex items-center bg-red-100 text-red-700 px-6 py-4 rounded-lg shadow-md max-w-2xl hover:shadow-lg transition-shadow duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-bold text-lg">Error Loading Dashboard</h3>
                <p>{errorMsg}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Profile Summary Card */}
            {profile && (
              <div
                onClick={() => setShowModal(true)}
                className="cursor-pointer bg-white p-6 rounded-2xl shadow-xl mb-10 hover:shadow-2xl transition-all duration-500 border border-indigo-100 transform hover:-translate-y-1 hover:border-indigo-200"
              >
                <div className="flex items-center space-x-6">
                  {profile.profilePhoto ? (
                    <div className="relative group">
                      <div className="relative overflow-hidden rounded-full border-4 border-indigo-100 shadow-lg w-20 h-20">
                        <img
                          src={`http://localhost:5000/uploads/${profile.profilePhoto}`}
                          alt="Profile"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full p-1 shadow-lg hover:bg-indigo-700 transition-colors duration-300 hover:shadow-xl hover:-translate-y-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full border-4 border-indigo-100 shadow-md group hover:bg-gray-200 transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 group-hover:text-gray-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-indigo-900 hover:text-indigo-700 transition-colors duration-300">
                          {profile.firstName} {profile.lastName}
                        </h2>
                        <p className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300">{profile.email}</p>
                      </div>
                      {profile.isApprovedByAdmin && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-300">
                          Verified Professional
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors duration-300">
                        {profile.occupation || 'Professional'}
                      </span>
                      {profile.experience && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors duration-300">
                          {profile.experience} years experience
                        </span>
                      )}
                      {profile.skills?.slice(0, 2).map((skill, i) => (
                        <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-indigo-800 border border-indigo-200 hover:bg-indigo-50 transition-colors duration-300">
                          {skill}
                        </span>
                      ))}
                      {profile.skills?.length > 2 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-indigo-800 border border-indigo-200 hover:bg-indigo-50 transition-colors duration-300">
                          +{profile.skills.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Job Matches Section */}
            <section className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-100 hover:shadow-2xl transition-all duration-500">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 hover:text-indigo-700 transition-colors duration-300">Your Job Matches</h2>
                  <p className="text-indigo-600 mt-1 hover:text-indigo-800 transition-colors duration-300">Opportunities tailored to your skills and experience</p>
                </div>
                <span className="mt-3 md:mt-0 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 shadow-sm hover:bg-indigo-200 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {matchedJobs.length} matches found
                </span>
              </div>

              {matchedJobs.length === 0 ? (
                <div className="text-center py-16 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-indigo-300 mb-4 hover:text-indigo-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-medium text-indigo-900 mb-2 hover:text-indigo-700 transition-colors duration-300">No matched jobs yet</h3>
                  <p className="text-indigo-600 max-w-md mx-auto hover:text-indigo-800 transition-colors duration-300">
                    We're actively searching for opportunities that match your profile. Check back soon or update your skills to increase matches.
                  </p>
                  <button className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow hover:shadow-lg hover:-translate-y-0.5">
                    Update Skills
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {matchedJobs.map((job) => (
                    <div 
                      key={job._id} 
                      className="group relative p-6 border border-indigo-100 rounded-xl hover:border-indigo-200 hover:shadow-lg transition-all duration-300 bg-white hover:bg-indigo-50"
                    >
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-300">
                          New Match
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-indigo-900 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 group-hover:text-gray-800 transition-colors duration-300">{job.description}</p>
                      <div className="flex items-center text-sm text-indigo-500 group-hover:text-indigo-700 transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location || 'Remote'}
                      </div>
                      <div className="mt-6 pt-4 border-t border-indigo-50 group-hover:border-indigo-100 transition-colors duration-300 flex justify-between items-center">
                        <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">Posted 2 days ago</span>
                        <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors duration-300">
                          View Details
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {showModal && renderProfileModal()}
          </>
        )}
      </div>
    </main>
  );
}