import { useState } from "react";
import { FiUsers, FiBook, FiClipboard, FiSettings, FiLogOut } from "react-icons/fi";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="flex h-screen font-poppins">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5">
        <h1 className="text-xl font-bold text-center mb-6">HED Admin Panel</h1>
        <ul>
          <li className={`p-3 flex items-center gap-2 cursor-pointer rounded-lg ${activeTab === "Dashboard" ? "bg-gray-700" : ""}`} onClick={() => setActiveTab("Dashboard")}>
            <FiClipboard /> Dashboard
          </li>
          <li className={`p-3 flex items-center gap-2 cursor-pointer rounded-lg ${activeTab === "Users" ? "bg-gray-700" : ""}`} onClick={() => setActiveTab("Users")}>
            <FiUsers /> Manage Users
          </li>
          <li className={`p-3 flex items-center gap-2 cursor-pointer rounded-lg ${activeTab === "Subjects" ? "bg-gray-700" : ""}`} onClick={() => setActiveTab("Subjects")}>
            <FiBook /> Manage Subjects
          </li>
          <li className={`p-3 flex items-center gap-2 cursor-pointer rounded-lg ${activeTab === "Grades" ? "bg-gray-700" : ""}`} onClick={() => setActiveTab("Grades")}>
            <FiClipboard /> Manage Grades
          </li>
          <li className={`p-3 flex items-center gap-2 cursor-pointer rounded-lg ${activeTab === "Settings" ? "bg-gray-700" : ""}`} onClick={() => setActiveTab("Settings")}>
            <FiSettings /> Settings
          </li>
          <li className="p-3 flex items-center gap-2 cursor-pointer text-red-500 mt-4" onClick={() => alert("Logging out...")}>
            <FiLogOut /> Logout
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">{activeTab}</h2>
          <div className="flex items-center gap-3">
            <span className="font-semibold">Admin</span>
            <img src="/images/admin-avatar.png" alt="Admin" className="w-10 h-10 rounded-full border" />
          </div>
        </div>

        {/* Dashboard Overview */}
        {activeTab === "Dashboard" && (
          <div className="grid grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
              <FiUsers className="text-3xl text-blue-500" />
              <div>
                <p className="text-gray-600">Total Students</p>
                <h3 className="text-2xl font-bold">450</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
              <FiBook className="text-3xl text-green-500" />
              <div>
                <p className="text-gray-600">Total Subjects</p>
                <h3 className="text-2xl font-bold">35</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
              <FiClipboard className="text-3xl text-red-500" />
              <div>
                <p className="text-gray-600">Pending Grades</p>
                <h3 className="text-2xl font-bold">12</h3>
              </div>
            </div>
          </div>
        )}

        {/* Other Sections */}
        {activeTab === "Users" && <p className="mt-6">Manage user accounts here...</p>}
        {activeTab === "Subjects" && <p className="mt-6">Manage subject details here...</p>}
        {activeTab === "Grades" && <p className="mt-6">View and update student grades here...</p>}
        {activeTab === "Settings" && <p className="mt-6">Modify system settings here...</p>}
      </main>
    </div>
  );
}
