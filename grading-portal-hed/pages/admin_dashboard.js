import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FiUsers, FiBook, FiClipboard, FiSettings, FiLogOut, FiMenu, FiBell, FiUser } from "react-icons/fi";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [admin, setAdmin] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.user_type === "admin") {
      setAdmin(userData);
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login_form"); // Redirects to login_form.js after logout
  }

  return (
    <div className="flex h-screen font-poppins">
      {/* Sidebar */}
      <aside className={`bg-gradient-to-b from-sky-700 to-blue-950 transition-all ${isSidebarOpen ? "w-64 p-5" : "w-20 p-3"}`}>
        <div className="flex items-center justify-between">
          {isSidebarOpen && <h1 className="text-lg font-bold">HED Admin</h1>}
          <button className="text-white p-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FiMenu size={24} />
          </button>
        </div>

        <ul className="mt-6 space-y-3">
          <SidebarItem icon={FiClipboard} label="Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={FiUsers} label="Manage Users" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={FiBook} label="Manage Subjects" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={FiClipboard} label="Manage Grades" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={FiSettings} label="Settings" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
        </ul>
      </aside>

      {/* Main Content */}
      <main className="text-black flex-1 p-6 bg-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">{activeTab}</h2>
          <div className="flex items-center gap-5">
            <button className="relative p-2 rounded-full hover:bg-gray-200 transition">
              <FiBell size={24} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">3</span>
            </button>

            {/* Admin Profile Section with Dropdown */}
            <div className="relative">
            <button className="flex items-center gap-2" onClick={() => setDropdownOpen(!dropdownOpen)}>
  <span className="font-semibold">{admin?.username}</span>
  <img
    src={"/images/youtube.png"} // No `customer_img` field in your table, so using a default image
    alt="Admin"
    className="w-10 h-10 rounded-full border"
  />
</button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg">
                  <ul className="py-2">
                    <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer">
                      <FiUser />
                      <span>Profile</span>
                    </li>
                    <li
                      className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-gray-200 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      
      

        <div className="mt-6">
          {activeTab === "Dashboard" && <p>Dashboard Overview</p>}
          {activeTab === "Manage Users" && <p>Manage user accounts here...</p>}
          {activeTab === "Manage Subjects" && <p>Manage subject details here...</p>}
          {activeTab === "Manage Grades" && <p>View and update student grades here...</p>}
          {activeTab === "Settings" && <p>Modify system settings here...</p>}
        </div>
      </main>
    </div>
  );
}

// Sidebar Item Component
function SidebarItem({ icon: Icon, label, activeTab, setActiveTab, isSidebarOpen }) {
  return (
    <li
      className={`flex items-center gap-4 p-3 rounded-lg transition ${activeTab === label ? "bg-sky-900" : "hover:bg-sky-800"} ${
        isSidebarOpen ? "" : "justify-center"
      }`}
      onClick={() => setActiveTab(label)}
    >
      <Icon size={28} />
      {isSidebarOpen && <span>{label}</span>}
    </li>
  );
}
