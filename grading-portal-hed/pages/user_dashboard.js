import { useState } from "react";
import { FiUser, FiBook, FiBell, FiSettings, FiLogOut } from "react-icons/fi";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div className="flex h-screen font-poppins bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="text-center py-6">
          <img src="/images/logo2.png" alt="Logo" className="mx-auto h-14 mb-2" />
          <h2 className="text-lg font-bold">HED Grading Portal</h2>
        </div>
        <nav className="flex-1">
          <ul>
            <SidebarItem icon={FiUser} label="Profile" active={activeTab} setActiveTab={setActiveTab} />
            <SidebarItem icon={FiBook} label="Grades" active={activeTab} setActiveTab={setActiveTab} />
            <SidebarItem icon={FiBell} label="Announcements" active={activeTab} setActiveTab={setActiveTab} />
            <SidebarItem icon={FiSettings} label="Settings" active={activeTab} setActiveTab={setActiveTab} />
          </ul>
        </nav>
        <button className="flex items-center gap-3 p-4 text-white bg-red-600 hover:bg-red-700 transition">
          <FiLogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeTab === "Profile" && <Profile />}
        {activeTab === "Grades" && <Grades />}
        {activeTab === "Announcements" && <Announcements />}
        {activeTab === "Settings" && <Settings />}
      </main>
    </div>
  );
}

// Sidebar Item Component
function SidebarItem({ icon: Icon, label, active, setActiveTab }) {
  return (
    <li
      className={`flex items-center gap-3 p-4 cursor-pointer transition ${
        active === label ? "bg-blue-700" : "hover:bg-blue-800"
      }`}
      onClick={() => setActiveTab(label)}
    >
      <Icon size={20} />
      {label}
    </li>
  );
}

// Sample Components for Each Tab
function Profile() {
  return <div className="bg-white p-6 shadow-md rounded">User Profile Content</div>;
}

function Grades() {
  return <div className="bg-white p-6 shadow-md rounded">Grades Content</div>;
}

function Announcements() {
  return <div className="bg-white p-6 shadow-md rounded">Announcements Content</div>;
}

function Settings() {
  return <div className="bg-white p-6 shadow-md rounded">Settings Content</div>;
}
