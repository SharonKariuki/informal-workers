// components/sections/UserManagement.js
import { useState, useMemo } from "react";
import { FaStar, FaShieldAlt, FaSearch, FaFilter, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

export default function UserManagement({ users, refresh, loading }) {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [selectedUser, setSelectedUser] = useState(null);

  const safeUsers = Array.isArray(users) ? users : [];

  const filtered = useMemo(() => {
    const s = search.toLowerCase();

    let arr = safeUsers.filter((u) =>
      `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase().includes(s) ||
      (u.email || "").toLowerCase().includes(s)
    );

    if (filterRole) {
      arr = arr.filter((u) => u.role === filterRole);
    }

    arr.sort((a, b) => {
      if (sortBy === "rating") {
        return sortDir === "asc"
          ? (a.rating || 0) - (b.rating || 0)
          : (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === "date") {
        return sortDir === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }

      const na = `${a.firstName || ""} ${a.lastName || ""}`.toLowerCase();
      const nb = `${b.firstName || ""} ${b.lastName || ""}`.toLowerCase();
      return sortDir === "asc" ? na.localeCompare(nb) : nb.localeCompare(na);
    });

    return arr;
  }, [safeUsers, search, filterRole, sortBy, sortDir]);

const updateStatus = async (id, action) => {
  try {
    const approved = action === "approve";

    const response = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ approved }), // ✅ boolean value
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        console.error("🚨 Server responded with error:", errorData);
      } catch {
        console.error("❌ Error response is not valid JSON:", errorText);
      }
      throw new Error("Failed to update user status");
    }

    refresh(); // ✅ Refresh data after successful update
  } catch (error) {
    console.error("❌ Error updating user status:", error.message);
  }
};

  const getUserStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Approved</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Rejected</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Unknown</span>;
    }
  };

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-indigo-900">User Management</h2>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
            >
              <option value="">All Roles</option>
              <option value="worker">Worker</option>
              <option value="employer">Employer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider cursor-pointer"
                    onClick={() => {
                      setSortBy("name");
                      setSortDir(sortDir === "asc" ? "desc" : "asc");
                    }}
                  >
                    <div className="flex items-center">
                      Name
                      {sortBy === "name" ? (
                        sortDir === "asc" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                      ) : <FaSort className="ml-1 text-gray-400" />}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Role
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider cursor-pointer"
                    onClick={() => {
                      setSortBy("rating");
                      setSortDir(sortDir === "asc" ? "desc" : "asc");
                    }}
                  >
                    <div className="flex items-center">
                      Rating
                      {sortBy === "rating" ? (
                        sortDir === "asc" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                      ) : <FaSort className="ml-1 text-gray-400" />}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.length > 0 ? (
                  filtered.map((u) => (
                    <tr key={u._id} className="hover:bg-indigo-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                            {u.firstName?.charAt(0)}{u.lastName?.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {u.firstName} {u.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{u.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          u.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : u.role === 'employer' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900 mr-1">
                            {(u.rating || 0).toFixed(1)}
                          </span>
                          <FaStar className="text-yellow-400" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      {getUserStatusBadge(u.status || (u.profileApproved ? 'approved' : 'pending'))}

                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {!u.profileApproved && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateStatus(u._id, "approve")}
                              className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateStatus(u._id, "reject")}
                              className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No users found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}