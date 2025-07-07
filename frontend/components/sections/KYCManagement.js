"use client";

import { FaCheckCircle, FaTimesCircle, FaIdCard, FaUserCircle } from "react-icons/fa";

export default function KYCManagement({ kycData, refresh, loading }) {
  const handleAction = async (id, action) => {
    try {
      const response = await fetch(`/api/admin/kyc/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process KYC");
      }

      refresh();
    } catch (error) {
      console.error("Error processing KYC:", error);
      alert(error.message || "An error occurred processing KYC");
    }
  };

  if (!Array.isArray(kycData)) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-indigo-900 mb-4">KYC Management</h2>
        <p className="text-red-500">Invalid KYC data format</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-900">KYC Management</h2>
          <div className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {kycData.length} Pending Verification
            {kycData.length !== 1 ? "s" : ""}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : kycData.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-indigo-200 mb-4">
              <FaCheckCircle className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              All KYC submissions verified
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No pending KYC requests at this time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {kycData.map((kyc) => (
              <div
                key={kyc._id}
                className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">
                      {kyc.firstName} {kyc.lastName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{kyc.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">
                      Submitted
                    </p>
                    <p className="text-gray-900">
                      {kyc.submittedAt
                        ? new Date(kyc.submittedAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">
                      Documents
                    </p>
                    <div className="flex space-x-3">
                      {kyc.idCard && (
                        <a
                          href={kyc.idCard}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          <FaIdCard className="mr-1" /> ID
                        </a>
                      )}
                      {kyc.selfie && (
                        <a
                          href={kyc.selfie}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          <FaUserCircle className="mr-1" /> Selfie
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        kyc.kycStatus === "verified"
                          ? "bg-green-100 text-green-800"
                          : kyc.kycStatus === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {kyc.kycStatus}
                    </span>
                  </div>
                </div>

                {kyc.kycStatus === "pendingApproval" && (
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleAction(kyc._id, "approve")}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FaCheckCircle className="mr-2" /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(kyc._id, "reject")}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <FaTimesCircle className="mr-2" /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
