export default function DashboardStats({ stats, className }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition-shadow">
        <h3 className="text-indigo-600 font-medium">Total Users</h3>
        <p className="text-3xl font-bold text-indigo-900">{stats.users}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition-shadow">
        <h3 className="text-blue-600 font-medium">KYC Applications</h3>
        <p className="text-3xl font-bold text-blue-900">{stats.kyc}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition-shadow">
        <h3 className="text-indigo-600 font-medium">Courses</h3>
        <p className="text-3xl font-bold text-indigo-900">{stats.courses}</p>
      </div>
    </div>
  )
}
