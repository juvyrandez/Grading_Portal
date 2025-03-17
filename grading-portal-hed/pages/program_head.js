import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FiUsers, FiClipboard, FiMenu, FiBell, FiUser, FiLogOut, FiChevronDown, FiChevronUp } from "react-icons/fi";
import "@fontsource/poppins";

export default function ProgramHeadDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [programHead, setProgramHead] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.user_type === "programhead") {
        setProgramHead(userData);
      } else {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login_form");
  };

  return (
    <div className="flex min-h-screen h-[100vh] font-poppins bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b from-sky-700 to-blue-950 text-white transition-all 
        ${isSidebarOpen ? "w-64 p-5" : "w-20 p-3"} min-h-screen fixed md:relative`}
      >
        <div className="flex items-center justify-between">
          {isSidebarOpen && <h1 className="text-lg font-bold">HED Program Head</h1>}
          <button className="text-white p-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FiMenu size={28} />
          </button>
        </div>

        <ul className="mt-6 space-y-3">
          <SidebarItem icon={FiClipboard} label="Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem
            icon={FiUsers}
            label="Program Students"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSidebarOpen={isSidebarOpen}
            hasDropdown
            dropdownItems={["1st Year", "2nd Year", "3rd Year", "4th Year"]}
          />
        </ul>
      </aside>

      {/* Main Content */}
      <main className="font-poppins text-black flex-1 p-6 bg-gray-100 overflow-auto ml-[5rem] md:ml-0">
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
              <button className="flex items-center gap-2" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <span className="font-semibold">
                  {programHead ? programHead.username || programHead.name : "Program Head"}
                </span>
                <img src="/images/youtube.png" alt="Program Head" className="w-10 h-10 rounded-full border" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg">
                  <ul className="py-2">
                    <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer">
                      <FiUser />
                      <span>Profile</span>
                    </li>
                    <li
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-gray-200 cursor-pointer"
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

        {/* Content Section */}
        <div className="font-poppins">
          {activeTab === "Dashboard" && <Dashboard />}
          {activeTab.includes("Program Students") && <ProgramStudents year={activeTab.split(" - ")[1]} />}
        </div>
      </main>
    </div>
  );
}

// Sidebar Item Component
function SidebarItem({ icon: Icon, label, activeTab, setActiveTab, isSidebarOpen, hasDropdown, dropdownItems = [] }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleClick = () => {
    if (hasDropdown) setIsDropdownOpen(!isDropdownOpen);
    else setActiveTab(label);
  };

  return (
    <li className="relative">
      <div
        className={`flex items-center gap-4 p-2 rounded-md transition cursor-pointer
        ${activeTab === label ? "bg-sky-900 text-white" : "hover:bg-sky-800 hover:text-gray-200"} 
        ${isSidebarOpen ? "justify-start" : "justify-center"}`}
        onClick={handleClick}
      >
        <Icon size={22} />
        {isSidebarOpen && <span className="text-sm">{label}</span>}
        {hasDropdown && (isDropdownOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />)}
      </div>

      {hasDropdown && isDropdownOpen && (
        <ul className="ml-4 mt-1 space-y-1">
          {dropdownItems.map((year) => (
            <li
              key={year}
              className={`p-2 rounded-md text-sm transition cursor-pointer
                ${activeTab === `${label} - ${year}` ? "bg-sky-900 text-white" : "hover:bg-sky-800 hover:text-gray-200"}`}
              onClick={() => setActiveTab(`${label} - ${year}`)}
            >
              {year}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}


// Components for different tabs
function Dashboard() {
  return <div>Dashboard Overview</div>;
}

function ProgramStudents({ year }) {
  const [students, setStudents] = useState([]);
  const [programHead, setProgramHead] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.user_type === "programhead") {
      setProgramHead(storedUser);
      if (storedUser.department && year) fetchStudents(storedUser.department, year);
    }
  }, [year]);

  const fetchStudents = async (department, year) => {
    try {
      const response = await fetch(`/api/getStudents?department=${department}&year_level=${year}`);
      const data = await response.json();
      if (data.students) setStudents(data.students);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  return (
    <div>
      <h3 className="font-bold mb-4">Students in {programHead?.department || "your department"}</h3>

      {students.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead className="bg-sky-800 text-white">
            <tr>
              <th className="border p-2">Full Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Year Level</th>
              <th className="border p-2">Course</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-sky-200 transition">
                <td className="border p-2">{student.fullname}</td>
                <td className="border p-2">{student.email}</td>
                <td className="border p-2">{student.year_level}</td>
                <td className="border p-2">{student.course}</td>
                <td className="border p-2">{student.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No students found for this year level.</p>
      )}
    </div>
  );
}


