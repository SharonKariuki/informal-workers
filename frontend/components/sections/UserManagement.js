export default function UserManagement({ users }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-gray-900">
        <thead className="bg-indigo-50">
          <tr>
            <th className="p-3 text-left font-semibold">Name</th>
            <th className="p-3 text-left font-semibold">Email</th>
            <th className="p-3 text-left font-semibold">Status</th>
            <th className="p-3 text-left font-semibold">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b border-indigo-50 hover:bg-indigo-50">
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' :
                  user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.status}
                </span>
              </td>
              <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
