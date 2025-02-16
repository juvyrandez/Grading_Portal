import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FiUser, FiBook, FiBell, FiSettings, FiLogOut, FiMenu, FiHome } from "react-icons/fi";
import "@fontsource/poppins";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/"); // Redirect to index.js (Homepage)
  };

  return (
    <div className="flex h-screen font-poppins bg-gray-100">
      <aside className={`bg-gradient-to-b from-sky-700 to-blue-950 text-white transition-all ${isSidebarOpen ? "w-64 p-5" : "w-20 p-3"}`}>
        <div className="flex items-center justify-between">
          {isSidebarOpen && <img src="/images/logo2.png" alt="Logo" className="h-20 w-auto" />}
          <button className="text-white p-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FiMenu size={28} />
          </button>
        </div>

        <ul className="mt-6 space-y-3">
          <SidebarItem icon={FiUser} label="Profile" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={FiBook} label="Grades" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={FiBell} label="Announcements" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={FiSettings} label="Settings" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />

          {/* Back to Home Button (in Sidebar) */}
          <li
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition cursor-pointer mt-6"
            onClick={() => router.push("/")}
          >
            <FiHome size={28} />
            {isSidebarOpen && <span>Back to Home</span>}
          </li>
        </ul>
      </aside>

      <main className="font-poppins text-black flex-1 p-6 bg-gray-100">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">{activeTab}</h2>
          <div className="flex items-center gap-5">
            {/* Notification Bell */}
            <button className="relative p-2 rounded-full hover:bg-gray-200 transition">
              <FiBell size={24} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">3</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-3"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="font-semibold">{user ? user.username : "User"}</span>
                <img src="/images/naz.jpg" alt="User" className="w-10 h-10 rounded-full border" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg p-2">
                  <button
                    onClick={() => setActiveTab("Profile")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-200 rounded-md flex items-center gap-2"
                  >
                    <FiUser /> Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200 rounded-md flex items-center gap-2"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 shadow-md rounded-lg mt-4">
          {activeTab === "Profile" && <Profile />}
          {activeTab === "Grades" && <Grades />}
          {activeTab === "Announcements" && <Announcements />}
          {activeTab === "Settings" && <Settings />}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, activeTab, setActiveTab, isSidebarOpen }) {
  return (
    <li
      className={`flex items-center gap-4 p-3 rounded-lg transition ${
        activeTab === label ? "bg-sky-900" : "hover:bg-sky-800"
      } ${isSidebarOpen ? "" : "justify-center"}`}
      onClick={() => setActiveTab(label)}
    >
      <Icon size={28} />
      {isSidebarOpen && <span>{label}</span>}
    </li>
  );
}

function Profile() {
  return <div>Profile Content</div>;
}

function Grades() {
  return <div>Grades Content</div>;
}

function Announcements() {
  return <div>Announcements Content</div>;
}

function Settings() {
  return <div>Settings Content</div>;
}
