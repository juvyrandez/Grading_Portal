import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FiUsers, FiBook, FiClipboard, FiSettings, FiLogOut, FiMenu, FiBell, FiUser } from "react-icons/fi";
import { FaLaptopCode, FaBalanceScale, FaBusinessTime, FaChalkboardTeacher } from "react-icons/fa";

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
    router.push("/login_form");
  };

  return (
    <div className="flex min-h-screen h-[100vh] font-poppins bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-gradient-to-b from-sky-700 to-blue-950 text-white transition-all 
        ${isSidebarOpen ? "w-64 p-5" : "w-20 p-3"} min-h-screen fixed md:relative`}>
        <div className="flex items-center justify-between">
          {isSidebarOpen && <h1 className="text-lg font-bold">HED Admin</h1>}
          {/* Sidebar Toggle Button - Now Inside Sidebar */}
          <button className="text-white p-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FiMenu size={28} />
          </button>
        </div>

        <ul className="mt-6 space-y-3">
          <SidebarItem icon={FiClipboard} label="Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={FiUsers} label="Students" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={FiBook} label="ProgramHead" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={FiClipboard} label="Semester" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={FiSettings} label="Help" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
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
                <span className="font-semibold">{admin?.username || "Admin"}</span>
                <img src={"/images/youtube.png"} alt="Admin" className="w-10 h-10 rounded-full border" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg">
                  <ul className="py-2">
                    <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer">
                      <FiUser />
                      <span>Profile</span>
                    </li>
                    <li className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-gray-200 cursor-pointer" onClick={handleLogout}>
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
          {activeTab === "Students" && <Students />}
          {activeTab === "ProgramHead" && <ProgramHead />}
          {activeTab === "Semester" && <Semester />}
          {activeTab === "Help" && <Help />}
        </div>
      </main>
    </div>
  );
}

// Sidebar Item Component
function SidebarItem({ icon: Icon, label, activeTab, setActiveTab, isSidebarOpen }) {
  return (
    <li
      className={`flex items-center gap-4 p-3 rounded-lg transition 
        ${activeTab === label ? "bg-sky-900" : "hover:bg-sky-800"} 
        ${isSidebarOpen ? "" : "justify-center"}`}
      onClick={() => setActiveTab(label)}
    >
      <Icon size={28} />
      {isSidebarOpen && <span>{label}</span>}
    </li>
  );
}

// ADMIN DASHBOARD
function Dashboard() {
  const [announcements] = useState([
    { id: 1, title: "Grading Period Opens", date: "March 10, 2025" },
    { id: 2, title: "Teacher Evaluation Due", date: "March 15, 2025" },
    { id: 3, title: "Final Exams Schedule", date: "March 20, 2025" },
  ]);

  const [activities] = useState([
    { id: 1, user: "Admin", action: "Approved a student grade", time: "2 hrs ago" },
    { id: 2, user: "Prof. Smith", action: "Added a new subject", time: "5 hrs ago" },
    { id: 3, user: "Admin", action: "Updated semester details", time: "1 day ago" },
  ]);

  return (
    <div className="p-6">
      {/* Dashboard Title */}
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>

      {/* Stats Overview - Matches Student Profile Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-medium">Total Students</h3>
          <p className="text-gray-700 text-2xl font-bold">120</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-medium">Total Teachers</h3>
          <p className="text-gray-700 text-2xl font-bold">15</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-medium">Total Programs</h3>
          <p className="text-gray-700 text-2xl font-bold">5</p>
        </div>
      </div>

      {/* Quick Actions - Matches Student Profile Button Style */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-medium">Quick Actions</h3>
        <div className="flex gap-4 mt-4">
          <button className="border border-gray-300 px-4 py-2 rounded-md">➕ Add Student</button>
          <button className="border border-gray-300 px-4 py-2 rounded-md">➕ Add Teacher</button>
          <button className="border border-gray-300 px-4 py-2 rounded-md">➕ Add Program</button>
        </div>
      </div>

      {/* Recent Activities & Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Recent Activities */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium">Recent Activities</h3>
          <ul className="mt-3">
            {activities.map((activity) => (
              <li key={activity.id} className="border-b py-2">
                <span className="font-bold">{activity.user}</span> {activity.action} -{" "}
                <span className="text-gray-500">{activity.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Announcements */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium">Announcements</h3>
          <ul className="mt-3">
            {announcements.map((announcement) => (
              <li key={announcement.id} className="border-b py-2">
                <span className="font-bold">{announcement.title}</span> -{" "}
                <span className="text-gray-500">{announcement.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}



// STUDENTS
function Students() {
  const tempData = [
    { name: "Alyza Nunag", age: 20, email: "alyza@email.com", course: "BSIT", year: "3rd Year", status: "Active" },
    { name: "Benedict Abanto", age: 21, email: "benedict@email.com", course: "BSCS", year: "2nd Year", status: "Active" },
    { name: "Michaela Abecia", age: 19, email: "michaela@email.com", course: "BSIT", year: "1st Year", status: "Inactive" },
    { name: "Joan Minoza", age: 22, email: "joan@email.com", course: "BSIT", year: "4th Year", status: "Active" },
    { name: "Juvy Randez", age: 20, email: "juvy@email.com", course: "BSCS", year: "3rd Year", status: "Active" },
    { name: "Karl Domingo", age: 21, email: "karl@email.com", course: "BSIT", year: "2nd Year", status: "Inactive" },
    { name: "Anne Feliciano", age: 20, email: "anne@email.com", course: "BSCS", year: "1st Year", status: "Active" },
    { name: "David Enriquez", age: 23, email: "david@email.com", course: "BSIT", year: "4th Year", status: "Active" },
    { name: "Sophia Cruz", age: 19, email: "sophia@email.com", course: "BSIT", year: "1st Year", status: "Inactive" },
    { name: "Marco Reyes", age: 22, email: "marco@email.com", course: "BSCS", year: "3rd Year", status: "Active" },
    { name: "Ella Martinez", age: 20, email: "ella@email.com", course: "BSIT", year: "2nd Year", status: "Active" },
    { name: "Chris Velasco", age: 21, email: "chris@email.com", course: "BSCS", year: "3rd Year", status: "Inactive" },
    { name: "Rina Salvador", age: 19, email: "rina@email.com", course: "BSIT", year: "1st Year", status: "Active" },
    { name: "Jason Dela Cruz", age: 22, email: "jason@email.com", course: "BSCS", year: "4th Year", status: "Active" },
  ];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(tempData.length / itemsPerPage);

  const paginatedData = tempData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="bg-blue-100 p-4 flex justify-between items-center flex-wrap rounded-lg shadow-md">
        <h2 className="text-lg md:text-xl">View Students</h2>
        <div className="flex gap-4 text-sm md:text-base">
          <select className="bg-white border border-gray-300 p-2 rounded-md text-gray-700 cursor-pointer">
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
            <option>4th Year</option>
          </select>
          <select className="bg-white border border-gray-300 p-2 rounded-md text-gray-700 cursor-pointer">
            <option>Bachelor of Science in IT</option>
            <option>Criminology</option>
            <option>BSBA</option>
            <option>BEED</option>
          </select>
          <select className="bg-white border border-gray-300 p-2 rounded-md text-gray-700 cursor-pointer">
            <option>2024-2025</option>
            <option>2023-2024</option>
          </select>
        </div>
      </div>

      {/* Search & Add Button */}
      <div className="flex justify-between items-center mt-4">
        <input
          type="text"
          placeholder="Search for student"
          className="border border-gray-300 p-2 rounded-md w-60"
        />
        <button className="bg-gray-200 px-4 py-2 rounded-md flex items-center gap-2">
          <span>➕</span> Add Student Account
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-5">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-200">
              <th className="border border-gray-400 px-4 py-2">#</th>
              <th className="border border-gray-400 px-4 py-2">Student Name</th>
              <th className="border border-gray-400 px-4 py-2">Age</th>
              <th className="border border-gray-400 px-4 py-2">Email</th>
              <th className="border border-gray-400 px-4 py-2">Course</th>
              <th className="border border-gray-400 px-4 py-2">Year Level</th>
              <th className="border border-gray-400 px-4 py-2">Status</th>
              <th className="border border-gray-400 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="border border-gray-400 px-4 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="border border-gray-400 px-4 py-2">{row.name}</td>
                <td className="border border-gray-400 px-4 py-2">{row.age}</td>
                <td className="border border-gray-400 px-4 py-2">{row.email}</td>
                <td className="border border-gray-400 px-4 py-2">{row.course}</td>
                <td className="border border-gray-400 px-4 py-2">{row.year}</td>
                <td className="border border-gray-400 px-4 py-2">{row.status}</td>
                <td className="border border-gray-400 px-4 py-2 flex gap-2">
                  <button className="text-blue-500">✏️</button>
                  <button className="text-red-500">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          className="bg-gray-300 px-3 py-1 rounded-md"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ◀ Prev
        </button>
        <span className="px-3 py-1">{currentPage} / {totalPages}</span>
        <button
          className="bg-gray-300 px-3 py-1 rounded-md"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}


// PROGRAM HEAD
function ProgramHead() {
  const tempData = [
    { name: "Alyza Nunag", email: "alyza@email.com", status: "Active", semester: "1st Semester", department: "IT", departmentType: "Academic" },
    { name: "Benedict Abanto", email: "benedict@email.com", status: "Active", semester: "2nd Semester", department: "CS", departmentType: "Academic" },
    { name: "Joan Minoza", email: "joan@email.com", status: "Inactive", semester: "1st Semester", department: "IT", departmentType: "Academic" },
    { name: "Juvy Randez", email: "juvy@email.com", status: "Active", semester: "2nd Semester", department: "CS", departmentType: "Academic" },
    { name: "Karl Domingo", email: "karl@email.com", status: "Inactive", semester: "1st Semester", department: "IT", departmentType: "Academic" },
    { name: "David Enriquez", email: "david@email.com", status: "Active", semester: "2nd Semester", department: "IT", departmentType: "Academic" },
    { name: "Sophia Cruz", email: "sophia@email.com", status: "Inactive", semester: "1st Semester", department: "CS", departmentType: "Academic" },
    { name: "Marco Reyes", email: "marco@email.com", status: "Active", semester: "2nd Semester", department: "IT", departmentType: "Academic" },
  ];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(tempData.length / itemsPerPage);

  const paginatedData = tempData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="bg-blue-100 p-4 flex justify-between items-center rounded-lg shadow-md">
        <h2 className="text-lg md:text-xl">Program Heads</h2>
        <div className="flex gap-4 text-sm md:text-base">
          <select className="bg-white border border-gray-300 p-2 rounded-md text-gray-700 cursor-pointer">
            <option>IT</option>
            <option>CJEP</option>
            <option>BSBA</option>
            <option>BEED</option>
            <option>HM</option>
          </select>
        </div>
      </div>

      {/* Search & Add Button */}
      <div className="flex justify-between items-center mt-4">
        <input
          type="text"
          placeholder="Search for program head"
          className="border border-gray-300 p-2 rounded-md w-60"
        />
        <button className="bg-gray-200 px-4 py-2 rounded-md flex items-center gap-2">
          <span>➕</span> Add New Program Head
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-5">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-200">
              <th className="border border-gray-400 px-4 py-2">#</th>
              <th className="border border-gray-400 px-4 py-2">Name</th>
              <th className="border border-gray-400 px-4 py-2">Email</th>
              <th className="border border-gray-400 px-4 py-2">Status</th>
              <th className="border border-gray-400 px-4 py-2">Semester</th>
              <th className="border border-gray-400 px-4 py-2">Department</th>
              <th className="border border-gray-400 px-4 py-2">Department Type</th>
              <th className="border border-gray-400 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="border border-gray-400 px-4 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="border border-gray-400 px-4 py-2">{row.name}</td>
                <td className="border border-gray-400 px-4 py-2">{row.email}</td>
                <td className="border border-gray-400 px-4 py-2">{row.status}</td>
                <td className="border border-gray-400 px-4 py-2">{row.semester}</td>
                <td className="border border-gray-400 px-4 py-2">{row.department}</td>
                <td className="border border-gray-400 px-4 py-2">{row.departmentType}</td>
                <td className="border border-gray-400 px-4 py-2 flex gap-2">
                  <button className="text-blue-500">✏️</button>
                  <button className="text-red-500">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          className="bg-gray-300 px-3 py-1 rounded-md"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ◀ Prev
        </button>
        <span className="px-3 py-1">{currentPage} / {totalPages}</span>
        <button
          className="bg-gray-300 px-3 py-1 rounded-md"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}



// SEMESTER
function Semester() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample Data (Only 1st Sem & 2nd Sem)
  const semesterData = [
    {
      name: "1st Semester",
      schoolYear: "2024-2025",
      region: "10",
      schoolName: "SRCB",
      status: "Active",
      semester: "1st Sem",
    },
  ];

  const totalPages = Math.ceil(semesterData.length / itemsPerPage);
  const paginatedData = semesterData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="bg-blue-100 p-4 flex justify-between items-center flex-wrap rounded-lg shadow-md">
        <h2 className="text-lg md:text-xl">View Semester</h2>
        <div className="flex gap-4 text-sm md:text-base">
          <select className="bg-white border border-gray-300 p-2 rounded-md text-gray-700 cursor-pointer">
            <option>1st Sem</option>
            <option>2nd Sem</option>
          </select>
        </div>
      </div>

      {/* Search & Add Button */}
      <div className="flex justify-between items-center mt-4">
        <input
          type="text"
          placeholder="Search for semester"
          className="border border-gray-300 p-2 rounded-md w-60"
        />
        <button className="bg-gray-200 px-4 py-2 rounded-md flex items-center gap-2">
          <span>➕</span> Add Semester
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-5">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-200">
              <th className="border border-gray-400 px-4 py-2">#</th>
              <th className="border border-gray-400 px-4 py-2">Name</th>
              <th className="border border-gray-400 px-4 py-2">School Year</th>
              <th className="border border-gray-400 px-4 py-2">Region</th>
              <th className="border border-gray-400 px-4 py-2">School Name</th>
              <th className="border border-gray-400 px-4 py-2">Status</th>
              <th className="border border-gray-400 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="border border-gray-400 px-4 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="border border-gray-400 px-4 py-2">{row.name}</td>
                <td className="border border-gray-400 px-4 py-2">{row.schoolYear}</td>
                <td className="border border-gray-400 px-4 py-2">{row.region}</td>
                <td className="border border-gray-400 px-4 py-2">{row.schoolName}</td>
                <td className="border border-gray-400 px-4 py-2">{row.status}</td>
                <td className="border border-gray-400 px-4 py-2 flex gap-2">
                  <button className="text-blue-500">✏️</button>
                  <button className="text-red-500">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          className="bg-gray-300 px-3 py-1 rounded-md"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ◀ Prev
        </button>
        <span className="px-3 py-1">{currentPage} / {totalPages}</span>
        <button
          className="bg-gray-300 px-3 py-1 rounded-md"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}



// HELP
function Help() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="font-poppins max-w-4xl mx-auto p-6 md:p-10">
      {/* Header */}
      <div className="bg-blue-100 p-5 flex justify-between items-center flex-wrap rounded-lg shadow-md">
        <h2 className="text-lg md:text-xl">Instructions</h2>
        <div className="flex gap-5 text-sm md:text-base mt-2 md:mt-0">
          <span className="text-gray-700 cursor-pointer hover:underline">General Questions</span>
          <span className="text-gray-700 cursor-pointer hover:underline">Terms of Use</span>
        </div>
      </div>

      {/* Accordion */}
      <div className="mt-5">
        <AccordionItem
          index={0}
          openIndex={openIndex}
          title="How to change my password?"
          content={
            <>
              <p className="text-sm md:text-base">To change your password, follow these steps:</p>
              <ol className="list-decimal list-inside text-sm md:text-base leading-relaxed mt-2">
                <li>Go to account settings</li>
                <li>Click the "change password" tab</li>
                <li>Enter your current password</li>
                <li>Enter your new password</li>
                <li>Re-enter your new password to confirm</li>
                <li>Save the new password</li>
              </ol>
              <p className="text-sm md:text-base mt-3">
                Your password will expire in exactly 1 month. Please change it regularly.
              </p>
            </>
          }
          toggleAccordion={toggleAccordion}
        />
        <AccordionItem index={1} openIndex={openIndex} title="How to update personal info?" toggleAccordion={toggleAccordion} />
        <AccordionItem index={2} openIndex={openIndex} title="How to change user photo?" toggleAccordion={toggleAccordion} />
        <AccordionItem index={3} openIndex={openIndex} title="AMBOT NIMOO?" toggleAccordion={toggleAccordion} />
      </div>
    </div>
  );
}

// Accordion Item Component
function AccordionItem({ index, openIndex, title, content, toggleAccordion }) {
  return (
    <div className="border mb-2 w-full">
      <button
        className={`w-full text-left p-4 text-sm md:text-base transition rounded-lg ${
          openIndex === index ? "bg-gray-300" : "bg-gray-200"
        }`}
        onClick={() => toggleAccordion(index)}
      >
        {index + 1}. {title}
      </button>
      {openIndex === index && <div className="p-5 bg-white text-sm md:text-base">{content || "Content not available yet."}</div>}
    </div>
  );
}
