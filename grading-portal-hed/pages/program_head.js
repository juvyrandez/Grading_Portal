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
  return (
    <div className="p-4 bg-white rounded shadow-md">
      {/* Welcome Header */}
      <h1 className="text-2xl font-bold mb-2">Welcome, Program Head</h1>
      <p className="text-gray-700 mb-4">Guide and empower your students today.</p>

      {/* Daily Inspiration */}
      <div className="p-2 border rounded shadow-sm mb-2">
        <h2 className="text-xl font-semibold mb-1">Daily Inspiration</h2>
        <p className="italic text-gray-600">
          "Commit to the Lord whatever you do, and He will establish your plans."  
          <span className="block text-right text-sm">— Proverbs 16:3</span>
        </p>
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

  // Load logged-in Program Head data
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.user_type === "programhead") setProgramHead(storedUser);
  }, []);

  // Fetch subjects based on Program Head's department, year level, and semester
  useEffect(() => {
    if (programHead && yearLevel && semester) {
      fetch(`/api/getSubjects?department=${programHead.department}&yearLevel=${yearLevel}&semester=${semester}`)
        .then((res) => res.json())
        .then(setSubjects)
        .catch((err) => console.error("Error fetching subjects:", err));
    }
  }, [programHead, yearLevel, semester]);

  // Fetch students after selecting a subject
  useEffect(() => {
    if (programHead && selectedSubject) {
      fetch(`/api/filterStudents?department=${programHead.department}&yearLevel=${yearLevel}`)
        .then((res) => res.json())
        .then((data) => {
          setStudents(data);

          // Initialize grades for each student
          const initialGrades = data.reduce((acc, student) => {
            acc[student.id] = { midterm: "", final: "" };
            return acc;
          }, {});
          setGrades(initialGrades);
        })
        .catch((err) => console.error("Error fetching students:", err));
    }
  }, [programHead, selectedSubject]);

  // Handle grade input per student
  const handleGradeChange = (studentId, field, value) => {
    setGrades({
      ...grades,
      [studentId]: { ...grades[studentId], [field]: value },
    });
  };

  // Submit grades to database
  const handleSubmitGrades = async () => {
    const filteredGrades = Object.entries(grades).reduce((acc, [studentId, grade]) => {
      if (grade.midterm !== "" || grade.final !== "") acc[studentId] = grade; // Only keep filled grades
      return acc;
    }, {});

    if (Object.keys(filteredGrades).length === 0) {
      Swal.fire("No grades entered!", "Please input grades before submitting.", "warning");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/addGrades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subjects.find((sub) => sub.subject_code === selectedSubject),
          semester,
          grades: filteredGrades,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Success!", data.message || "Grades submitted successfully!", "success");
        setGrades({});
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
        <FaGraduationCap className="text-blue-500 text-3xl" /> {/* Larger icon */}
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
        <select value={yearLevel} onChange={(e) => setYearLevel(e.target.value)} className="p-2 border rounded">
          <option value="">Select Year Level</option>
          {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select value={semester} onChange={(e) => setSemester(e.target.value)} className="p-2 border rounded">
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
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="p-2 border rounded mb-4">
          <option value="">Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject.subject_id} value={subject.subject_code}>
              {subject.subject_name} ({subject.subject_code})
            </option>
          ))}
        </select>
      )}

      {/* Student Grades Input Table */}
      {students.length > 0 && selectedSubject && (
        <div>
          <h3 className="text-md font-semibold mb-2">Enter Grades:</h3>
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Student Name</th>
                <th className="border p-2">Midterm</th>
                <th className="border p-2">Final</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="border p-2">{student.fullname}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={grades[student.id]?.midterm || ""}
                      onChange={(e) => handleGradeChange(student.id, "midterm", e.target.value)}
                      className="p-2 border rounded w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
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
    try {
      const response = await fetch(`/api/getStudents?department=${department}&year_level=${year}`);
      const data = await response.json();
      if (data.students) setStudents(data.students);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  // 🔍 Open view student modal
const handleView = (student) => setViewedStudent(student);

// ❌ Close the student view modal
const closeViewModal = () => setViewedStudent(null);


return (
  <div>
  <h3 className="font-bold mt-4 p-2 bg-white rounded shadow">
    Students in {programHead?.department || "your department"}
  </h3>

    {students.length > 0 ? (
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead className="bg-sky-800 text-white">
          <tr>
            <th className="border p-2">Full Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Year Level</th>
            <th className="border p-2">Course</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
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
              <td className="border p-2 flex gap-2 justify-center">
  <button
    className="text-blue-500 hover:text-green-600"
    onClick={() => handleView(student)}
  >
    <FaEye className="w-5 h-5" />
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p className="text-gray-500">No students found for this year level.</p>
    )}


      {/* 🎉 View Student Modal */}
{viewedStudent && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded shadow-lg w-96">
      <h2 className="text-xl font-bold mb-2">Student Details</h2>
      <p><strong>Full Name:</strong> {viewedStudent.fullname}</p>
      <p><strong>Email:</strong> {viewedStudent.email}</p>
      <p><strong>Year Level:</strong> {viewedStudent.year_level}</p>
      <p><strong>Course:</strong> {viewedStudent.course}</p>
      <p><strong>Status:</strong> {viewedStudent.status}</p>
      <p><strong>Contact:</strong> {viewedStudent.contact_number || "N/A"}</p>
      <p><strong>Address:</strong> {viewedStudent.address || "N/A"}</p>

      <button
        className="mt-4 bg-gray-400 hover:bg-red-600 text-white py-1 px-3 rounded"
        onClick={closeViewModal}
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
}

