import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FiMenu, FiBell, FiLogOut, FiChevronDown, FiChevronUp } from "react-icons/fi";
import "@fontsource/poppins";
import Swal from "sweetalert2";
import { FaUserGraduate } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { MdAddchart } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";

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
      // Check if user exists and is a program head
      if (userData && userData.user_type === "programhead") {
        setProgramHead(userData);
      } else {
        router.push("/login_form"); // Redirect to login form if not program head
      }
    } else {
      router.push("/login_form"); // Redirect to login form if no user data
    }
  }, [router]); // Added router to dependency array

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        Swal.fire({
          icon: "success",
          title: "Logged out!",
          text: "You've been successfully logged out.",
          showConfirmButton: false,
          timer: 2000,
        });
        router.push("/login_form");
      }
    });
  };

  return (
    <div className="flex min-h-screen h-[100vh] font-poppins bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
  className={`bg-gradient-to-b from-sky-700 to-blue-950 text-white transition-all 
  ${isSidebarOpen ? "w-64 p-5" : "w-20 p-3"} min-h-screen fixed md:relative`}
>
  <div className="flex items-center justify-between">
  {isSidebarOpen && <img src="/images/logo2.png" alt="Logo" className="h-20 w-auto" />}
    <button className="text-white p-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
      <FiMenu size={28} />
    </button>
  </div>

  <ul className="mt-6 space-y-3">
    <SidebarItem icon={MdDashboard} label="Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
    <SidebarItem
      icon={FaUserFriends}
      label="Program Students"
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isSidebarOpen={isSidebarOpen}
      hasDropdown
      dropdownItems={["1st Year", "2nd Year", "3rd Year", "4th Year"]}
    />
    <SidebarItem
      icon={MdAddchart}
      label="Add Grades"
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isSidebarOpen={isSidebarOpen}
    />
  </ul>
</aside>


      {/* Main Content */}
      <main className="font-poppins text-black flex-1 p-6 bg-gray-100 overflow-auto ml-[5rem] md:ml-0">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">{activeTab}</h2>
          <div className="flex items-center gap-5">

            {/* Profile Dropdown */}
<div className="relative">
  <button className="flex items-center gap-2" onClick={() => setDropdownOpen(!dropdownOpen)}>
    <span className="font-semibold">
      {programHead ? programHead.username || programHead.name : "Program Head"}
    </span>
    <FaUserGraduate className="w-10 h-10 p-2 text-blue-500 border-2 border-blue-500 rounded-full" />
  </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg">
                  <ul className="py-2">
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
          {activeTab === "Add Grades" && <AddGrades />} {/* New Add Grades component */}
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
  // Mock data - would normally come from backend
  const mockData = {
    studentStats: {
      total: 243,
      active: 218,
      onLeave: 15,
      graduating: 32
    },
    recentAnnouncements: [
      { id: 1, title: "Curriculum Review Meeting", date: "2023-05-15", content: "Please prepare for the quarterly curriculum review meeting next week." },
      { id: 2, title: "Student Feedback Results", date: "2023-05-10", content: "The latest student feedback reports are now available for review." }
    ],
    upcomingEvents: [
      { id: 1, title: "Faculty Meeting", date: "2023-05-20", time: "2:00 PM" },
      { id: 2, title: "Industry Advisory Board", date: "2023-05-25", time: "9:00 AM" },
      { id: 3, title: "Graduation Ceremony", date: "2023-06-10", time: "10:00 AM" }
    ],
    quickLinks: [
      { name: "Curriculum Docs", url: "#", icon: "📚" },
      { name: "Faculty Portal", url: "#", icon: "👨‍🏫" },
      { name: "Student Records", url: "#", icon: "📊" },
      { name: "Assessment Tools", url: "#", icon: "📝" }
    ]
  };

  return (
    <div className="mt-4 p-4 bg-gray rounded shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Program Head Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
          <span className="font-medium">May 17, 2023</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Students" 
          value={mockData.studentStats.total} 
          icon="👥" 
          trend="stable" 
        />
        <StatCard 
          title="Active Students" 
          value={mockData.studentStats.active} 
          icon="✅" 
          trend="up" 
        />
        <StatCard 
          title="On Leave" 
          value={mockData.studentStats.onLeave} 
          icon="⏸️" 
          trend="down" 
        />
        <StatCard 
          title="Graduating Soon" 
          value={mockData.studentStats.graduating} 
          icon="🎓" 
          trend="up" 
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Announcements */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Announcements</h2>
            <div className="space-y-4">
              {mockData.recentAnnouncements.map(announcement => (
                <AnnouncementCard key={announcement.id} {...announcement} />
              ))}
            </div>
          </div>

          {/* Calendar Section */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Upcoming Events</h2>
            <div className="space-y-3">
              {mockData.upcomingEvents.map(event => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Links */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Links</h2>
            <div className="grid grid-cols-2 gap-3">
              {mockData.quickLinks.map((link, index) => (
                <QuickLink key={index} {...link} />
              ))}
            </div>
          </div>

          {/* Inspiration */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Daily Inspiration</h2>
            <div className="bg-blue-50 p-3 rounded">
              <p className="italic text-gray-700">
                "Education is the most powerful weapon which you can use to change the world."
                <span className="block text-right text-sm mt-2">— Nelson Mandela</span>
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
            <div className="space-y-3">
              <ActivityItem 
                icon="📝" 
                text="Approved 5 student petitions" 
                time="2 hours ago" 
              />
              <ActivityItem 
                icon="👨‍🎓" 
                text="Met with 3 advisees" 
                time="Yesterday" 
              />
              <ActivityItem 
                icon="📅" 
                text="Scheduled faculty meeting" 
                time="May 15" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for stat cards
function StatCard({ title, value, icon, trend }) {
  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    stable: "text-gray-500"
  };

  const trendIcons = {
    up: "↑",
    down: "↓",
    stable: "→"
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className={`mt-2 text-sm ${trendColors[trend]}`}>
        {trendIcons[trend]} {trend === 'up' ? 'Increased' : trend === 'down' ? 'Decreased' : 'No change'} from last month
      </div>
    </div>
  );
}

// Component for announcement cards
function AnnouncementCard({ title, date, content }) {
  return (
    <div className="border-b pb-3 last:border-b-0 last:pb-0">
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <span className="text-sm text-gray-500">{new Date(date).toLocaleDateString()}</span>
      </div>
      <p className="text-gray-600 text-sm">{content}</p>
    </div>
  );
}

// Component for event cards
function EventCard({ title, date, time }) {
  return (
    <div className="flex items-center p-2 hover:bg-gray-50 rounded">
      <div className="bg-blue-100 text-blue-800 rounded-lg p-2 mr-3 text-center min-w-[50px]">
        <div className="font-bold">{new Date(date).getDate()}</div>
        <div className="text-xs">{new Date(date).toLocaleString('default', { month: 'short' })}</div>
      </div>
      <div>
        <h3 className="font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
    </div>
  );
}

// Component for quick links
function QuickLink({ name, url, icon }) {
  return (
    <a href={url} className="flex flex-col items-center justify-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-sm text-center">{name}</span>
    </a>
  );
}

// Component for activity items
function ActivityItem({ icon, text, time }) {
  return (
    <div className="flex items-start">
      <span className="text-lg mr-2">{icon}</span>
      <div>
        <p className="text-gray-800">{text}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
}

function AddGrades() {
  const [programHead, setProgramHead] = useState(null);
  const [yearLevel, setYearLevel] = useState("");
  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'regular', 'irregular'

  // Load logged-in Program Head data
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.user_type === "programhead") setProgramHead(storedUser);
  }, []);

  // Fetch subjects based on Program Head's department, year level, and semester
  useEffect(() => {
    if (programHead && yearLevel && semester) {
      fetch(`/api/ph_addgrades/getSubjects?department=${programHead.department}&yearLevel=${yearLevel}&semester=${semester}`)
        .then((res) => res.json())
        .then(setSubjects)
        .catch((err) => console.error("Error fetching subjects:", err));
    }
  }, [programHead, yearLevel, semester]);

  // Fetch students enrolled in the selected subject (regular or irregular)
  useEffect(() => {
    if (programHead && selectedSubject && semester) {
      setLoading(true);
      
      const subject = subjects.find(sub => sub.subject_code === selectedSubject);
      if (!subject) return;

      fetch(`/api/ph_addgrades/getEnrolledStudents?subjectId=${subject.subject_id}&semester=${semester}`)
        .then((res) => res.json())
        .then((data) => {
          // Sort students alphabetically by fullname initially
          const sortedStudents = [...data].sort((a, b) => 
            a.fullname.localeCompare(b.fullname)
          );
          setStudents(sortedStudents);

          const initialGrades = sortedStudents.reduce((acc, student) => {
            acc[student.id] = { 
              midterm: student.midterm || "", 
              final: student.final || "",
              is_irregular: student.is_irregular || false
            };
            return acc;
          }, {});
          setGrades(initialGrades);
        })
        .catch((err) => console.error("Error fetching students:", err))
        .finally(() => setLoading(false));
    }
  }, [programHead, selectedSubject, semester, subjects]);

  // Handle grade input per student
  const handleGradeChange = (studentId, field, value) => {
    setGrades({
      ...grades,
      [studentId]: { ...grades[studentId], [field]: value },
    });
  };

  // Sort students alphabetically
  const sortStudents = () => {
    const sorted = [...students].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.fullname.localeCompare(b.fullname);
      } else {
        return b.fullname.localeCompare(a.fullname);
      }
    });
    setStudents(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Filter students by status
  const filteredStudents = students.filter(student => {
    if (filterStatus === "all") return true;
    if (filterStatus === "regular") return !grades[student.id]?.is_irregular;
    if (filterStatus === "irregular") return grades[student.id]?.is_irregular;
    return true;
  });

  // Submit grades to database
  const handleSubmitGrades = async () => {
    const filteredGrades = Object.entries(grades).reduce((acc, [studentId, grade]) => {
      if (grade.midterm !== "" || grade.final !== "") acc[studentId] = grade;
      return acc;
    }, {});

    if (Object.keys(filteredGrades).length === 0) {
      Swal.fire("No grades entered!", "Please input grades before submitting.", "warning");
      return;
    }

    setLoading(true);

    try {
      const subject = subjects.find((sub) => sub.subject_code === selectedSubject);
      const res = await fetch("/api/ph_addgrades/addGrades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          semester,
          grades: filteredGrades,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Success!", data.message || "Grades submitted successfully!", "success");
      } else {
        Swal.fire("Error!", data.message || "Failed to submit grades.", "error");
      }
    } catch (err) {
      console.error("Error submitting grades:", err);
      Swal.fire("Error!", "Failed to submit grades.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-6">Add Grades by Subject</h2>

      {/* Show Department automatically */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Department:</label>
        <div className="flex items-center gap-4 p-3 border rounded w-full bg-gray-100">
          <FaGraduationCap className="text-blue-500 text-3xl" />
          <input
            type="text"
            value={programHead?.department || "Loading..."}
            disabled
            className="bg-gray-100 w-full outline-none"
          />
        </div>
      </div>

      {/* Year Level and Semester Select */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <select 
          value={yearLevel} 
          onChange={(e) => {
            setYearLevel(e.target.value);
            setSelectedSubject("");
            setStudents([]);
            setGrades({});
          }} 
          className="p-2 border rounded"
        >
          <option value="">Select Year Level</option>
          {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select 
          value={semester} 
          onChange={(e) => {
            setSemester(e.target.value);
            setSelectedSubject("");
            setStudents([]);
            setGrades({});
          }} 
          className="p-2 border rounded"
        >
          <option value="">Select Semester</option>
          {["1st Semester", "2nd Semester", "Summer"].map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>
      </div>

      {/* Subject Select */}
      {subjects.length > 0 && (
        <select 
          value={selectedSubject} 
          onChange={(e) => setSelectedSubject(e.target.value)} 
          className="p-2 border rounded mb-4 w-full"
        >
          <option value="">Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject.subject_id} value={subject.subject_code}>
              {subject.subject_name} ({subject.subject_code})
            </option>
          ))}
        </select>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Student Grades Input Table */}
      {students.length > 0 && selectedSubject && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold">Enter Grades:</h3>
            <div className="flex gap-4">
              <button 
                onClick={sortStudents}
                className="flex items-center gap-1 text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              >
                Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
                {sortOrder === "asc" ? <FiChevronDown /> : <FiChevronUp />}
              </button>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">All Students</option>
                <option value="regular">Regular Only</option>
                <option value="irregular">Irregular Only</option>
              </select>
            </div>
          </div>

          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Student Name</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Midterm</th>
                <th className="border p-2">Final</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="border p-2">{student.fullname}</td>
                  <td className="border p-2 text-center">
                    {grades[student.id]?.is_irregular ? (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        Irregular
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Regular
                      </span>
                    )}
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.01"
                      value={grades[student.id]?.midterm || ""}
                      onChange={(e) => handleGradeChange(student.id, "midterm", e.target.value)}
                      className="p-2 border rounded w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.01"
                      value={grades[student.id]?.final || ""}
                      onChange={(e) => handleGradeChange(student.id, "final", e.target.value)}
                      className="p-2 border rounded w-full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleSubmitGrades}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Grades"}
          </button>
        </div>
      )}
    </div>
  );
}



function ProgramStudents({ year }) {
  const [students, setStudents] = useState([]);
  const [programHead, setProgramHead] = useState(null);
  const [viewedStudent, setViewedStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load user data on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.user_type === "programhead") {
      setProgramHead(storedUser);
      if (storedUser.department && year) fetchStudents(storedUser.department, year);
    }
  }, [year]);

  // Fetch students by department and year
  const fetchStudents = async (department, year) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/ph_addgrades/getStudents?department=${department}&year_level=${year}`);
      const data = await response.json();
      if (data.students) setStudents(data.students);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open view student modal
  const handleView = (student) => setViewedStudent(student);

  // Close the student view modal
  const closeViewModal = () => setViewedStudent(null);

  return (
    <div className="mt-4 p-10 h-screen bg-white rounded shadow">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Student Management
        </h2>
        <p className="text-sm text-gray-600">
          {programHead?.department ? `${programHead.department} students` : "Department students"}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50 border-b">
          <div>
            <h3 className="font-medium text-gray-800">
              Year {year} Students
            </h3>
            <p className="text-xs text-gray-500">
              {students.length} total students
            </p>
          </div>
          <div className="w-full sm:w-64">
            <div className="relative">
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year & Course
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-medium">
                            {student.fullname.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {student.fullname}
                          </div>
                          <div className="text-xs text-gray-500">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {student.contact_number || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Year {student.year_level}
                      </div>
                      <div className="text-xs text-gray-500">
                        {student.course}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 inline-flex text-xs font-medium rounded 
                        ${student.status === 'Active' ? 'bg-green-100 text-green-800' : 
                          student.status === 'Inactive' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleView(student)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View details"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <svg
              className="mx-auto h-10 w-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchTerm ? 'No matching students found' : 'No students found'}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {searchTerm ? 'Try adjusting your search' : 'No students registered in this year level'}
            </p>
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {viewedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeViewModal}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-base font-medium text-gray-900">
                      Student Profile
                    </h3>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-gray-500">Full Name</p>
                        <p className="text-sm text-gray-900">{viewedStudent.fullname}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm text-gray-900">{viewedStudent.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Year Level</p>
                        <p className="text-sm text-gray-900">Year {viewedStudent.year_level}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Course</p>
                        <p className="text-sm text-gray-900">{viewedStudent.course}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="text-sm">
                          <span className={`px-2 py-0.5 inline-flex text-xs font-medium rounded 
                            ${viewedStudent.status === 'Active' ? 'bg-green-100 text-green-800' : 
                              viewedStudent.status === 'Inactive' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {viewedStudent.status}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Contact</p>
                        <p className="text-sm text-gray-900">{viewedStudent.contact_number || "-"}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="text-sm text-gray-900">{viewedStudent.address || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-3 py-2 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:ml-3 sm:w-auto"
                  onClick={closeViewModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

