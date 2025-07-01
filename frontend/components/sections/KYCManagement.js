export default function KYCManagement({ kycData, onApprove, onReject }) {
  return (
    <div className="space-y-4">
      {kycData.map(kyc => (
        <div key={kyc.id} className="p-4 border border-indigo-100 rounded-lg bg-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 text-gray-900">
            <div>
              <h3 className="font-semibold">User</h3>
              <p>{kyc.userName}</p>
            </div>
            <div>
              <h3 className="font-semibold">ID Type</h3>
              <p>{kyc.idType}</p>
            </div>
            <div>
              <h3 className="font-semibold">ID Number</h3>
              <p>{kyc.idNumber}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                kyc.status === 'approved' ? 'bg-green-100 text-green-800' :
                kyc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {kyc.status}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <button 
              onClick={() => onApprove(kyc.id)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Approve
            </button>
            <button 
              onClick={() => onReject(kyc.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
