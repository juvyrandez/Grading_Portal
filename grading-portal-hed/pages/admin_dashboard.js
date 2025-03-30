import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {FiLogOut, FiMenu, FiBell} from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import Swal from "sweetalert2";
import { Bar } from "react-chartjs-2";
import { FaUserTie } from "react-icons/fa";
import { FaUserGraduate, FaChalkboardTeacher, FaBookOpen } from "react-icons/fa";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { MdLibraryBooks } from "react-icons/md";
import { FaHandsHelping } from "react-icons/fa";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


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
      <aside className={`bg-gradient-to-b from-sky-700 to-blue-950 text-white transition-all 
        ${isSidebarOpen ? "w-64 p-5" : "w-20 p-3"} min-h-screen fixed md:relative`}>
        <div className="flex items-center justify-between">
        {isSidebarOpen && <img src="/images/logo2.png" alt="Logo" className="h-20 w-auto" />}
          {/* Sidebar Toggle Button - Now Inside Sidebar */}
          <button className="text-white p-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FiMenu size={28} />
          </button>
        </div>

        <ul className="mt-6 space-y-3">
          <SidebarItem icon={MdDashboard} label="Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={FaUserFriends } label="Students" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={FaBook} label="ProgramHead" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={MdLibraryBooks } label="Subjects" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={FaHandsHelping} label="Help" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
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

            {/* Admin Profile Dropdown */}
<div className="relative">
  <button className="flex items-center gap-2" onClick={() => setDropdownOpen(!dropdownOpen)}>
    <span className="font-semibold">{admin?.username || "Admin"}</span>
    <FaUserTie className="w-10 h-10 p-2 text-gray-500 border-2 border-blue-500 rounded-full" />
  </button>


              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg">
                  <ul className="py-2">
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
          {activeTab === "Subjects" && <Subjects />}
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
  const [studentsCount, setStudentsCount] = useState(0);
  const [programHeadsCount, setProgramHeadsCount] = useState(0);
  const [subjectsCount, setSubjectsCount] = useState(0);
  const [departmentCounts, setDepartmentCounts] = useState({
    BSIT: 0,
    CJEP: 0,
    BSBA: 0,
    TEP: 0,
    HM: 0,
  });

  useEffect(() => {
    fetch("/api/getCounts")
      .then((res) => res.json())
      .then((data) => {
        setStudentsCount(data.students);
        setProgramHeadsCount(data.programHeads);
        setSubjectsCount(data.subjects);
      })
      .catch((err) => console.error("Error fetching counts:", err));

    fetch("/api/getDepartmentCounts")
      .then((res) => res.json())
      .then((data) => setDepartmentCounts(data))
      .catch((err) => console.error("Error fetching department counts:", err));
  }, []);

  // Chart Data
  const chartData = {
    labels: ["BSIT", "CJEP", "BSBA", "TEP", "HM"],
    datasets: [
      {
        label: "Students per Department",
        data: [
          departmentCounts.BSIT,
          departmentCounts.CJEP,
          departmentCounts.BSBA,
          departmentCounts.TEP,
          departmentCounts.HM,
        ],
        backgroundColor: ["#4CAF50", "#FF9800", "#03A9F4", "#E91E63", "#9C27B0"],
        borderRadius: 5,
      },
    ],
  };

  // Chart Options to resize and prevent it from being too long
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md text-center flex flex-col items-center">
          <FaUserGraduate className="text-blue-500 text-4xl mb-2" />
          <h3 className="text-lg font-medium">Total Students</h3>
          <p className="text-gray-700 text-2xl font-bold">{studentsCount}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md text-center flex flex-col items-center">
          <FaChalkboardTeacher className="text-green-500 text-4xl mb-2" />
          <h3 className="text-lg font-medium">Total Program Heads</h3>
          <p className="text-gray-700 text-2xl font-bold">{programHeadsCount}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md text-center flex flex-col items-center">
          <FaBookOpen className="text-yellow-500 text-4xl mb-2" />
          <h3 className="text-lg font-medium">Total Subjects</h3>
          <p className="text-gray-700 text-2xl font-bold">{subjectsCount}</p>
        </div>
      </div>

      {/* Department Analytics Chart */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-2">Department Analytics</h3>
        <div className="h-96 w-full"> {/* Increased height from h-64 to h-96 */}
  <Bar data={chartData} options={chartOptions} />
</div>
      </div>
    </div>
  );
}




// STUDENTS
function Students() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [editFormData, setEditFormData] = useState({});
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
const studentsPerPage = 10
  
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    course: "",
    year_level: "",
    gender: "",
    birthdate: "",
    contact_number: "",
    address: "",
  });

  const handleView = (student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const handleEdit = (student) => {
    setEditFormData(student);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };
  

  // Handle Update
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const res = await fetch("/api/updateStudent", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update student");
  
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Student information has been updated.",
        showConfirmButton: false,
        timer: 2000,
      });
  
      setIsEditModalOpen(false);
      fetchStudents();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Failed to update student.",
      });
      setError(error.message);
    }
  };
  

  // Handle Delete
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/deleteStudent?id=${id}`, {
            method: "DELETE",
          });
  
          if (!res.ok) throw new Error("Failed to delete student");
  
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The student has been removed.",
            showConfirmButton: false,
            timer: 2000,
          });
  
          fetchStudents();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to delete student.",
          });
          console.error("Error deleting student:", error);
        }
      } else {
        Swal.fire({
          icon: "info",
          title: "Cancelled",
          text: "The student was not deleted.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };
  

  // Filter students based on search, year level, and course
useEffect(() => {
  let filtered = students;

  if (searchQuery) {
    filtered = filtered.filter(
      (student) =>
        student.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (selectedYear) {
    filtered = filtered.filter((student) => student.year_level == selectedYear);
  }

  if (selectedCourse) {
    filtered = filtered.filter((student) => student.course === selectedCourse);
  }

  setFilteredStudents(filtered);
  setCurrentPage(1); // Reset to first page on filter change
}, [searchQuery, selectedYear, selectedCourse, students]);

useEffect(() => {
  fetchStudents();
}, []);

const fetchStudents = async () => {
  try {
    const res = await fetch("/api/students");
    const data = await res.json();
    setStudents(data);
    setFilteredStudents(data);
  } catch (error) {
    console.error("Error fetching students:", error);
  }
};


// Pagination logic
const indexOfLastStudent = currentPage * studentsPerPage;
const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

const nextPage = () => {
  if (currentPage < Math.ceil(filteredStudents.length / studentsPerPage)) {
    setCurrentPage(currentPage + 1);
  }
};

const prevPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};






  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  // Handle Adding
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      // Show loading spinner
      Swal.fire({
        title: "Adding student...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
  
      const res = await fetch("/api/addStudent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.message || "Failed to add student");
  
      // Success message
      Swal.fire({
        icon: "success",
        title: "Student added successfully!",
        showConfirmButton: false,
        timer: 2000,
      });
  
      setIsModalOpen(false);
      fetchStudents();
    } catch (error) {
      setError(error.message);
  
      // Error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong while adding the student.",
      });
    }
  };

  const handleContactNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value)) {
      setFormData({ ...formData, contact_number: value });
    }
  };

  const handleEditContactNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value)) {
      setEditFormData({ ...editFormData, contact_number: value });
    }
  };
  

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="bg-blue-100 p-4 flex justify-between items-center flex-wrap rounded-lg shadow-md">
        <h2 className="text-lg md:text-xl">View Students</h2>
        <div className="flex gap-4 text-sm md:text-base">
          <select
            className="bg-white border border-gray-300 p-2 rounded-md text-gray-700 cursor-pointer"
            onChange={(e) => setSelectedYear(e.target.value)}
            value={selectedYear}
          >
            <option value="">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
          <select
            className="bg-white border border-gray-300 p-2 rounded-md text-gray-700 cursor-pointer"
            onChange={(e) => setSelectedCourse(e.target.value)}
            value={selectedCourse}
          >
            <option value="">All Courses</option>
            <option value="BSIT">BSIT</option>
            <option value="CJEP">CJEP</option>
            <option value="BSBA">BSBA</option>
            <option value="TEP">TEP</option>
            <option value="HM">HM</option>
          </select>
        </div>
      </div>
  
      {/* Search & Add Button */}
      <div className="flex justify-between items-center mt-4">
        <input
          type="text"
          placeholder="Search for student"
          className="border border-gray-300 p-2 rounded-md w-60"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="bg-gray-200 px-4 py-2 rounded-md flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <span>➕</span> Add Student Account
        </button>
      </div>
  
      {error && <p className="text-red-500 mt-2">{error}</p>}
  
      {/* Student Table */}
<table className="w-full border-collapse mt-4">
  <thead className="bg-gray-200">
    <tr>
      <th className="p-2 border text-left">Name</th>
      <th className="p-2 border text-left">Email</th>
      <th className="p-2 border">Course</th>
      <th className="p-2 border">Year Level</th>
      <th className="p-2 border">Status</th>
      <th className="p-2 border">Actions</th>
    </tr>
  </thead>
  <tbody>
    {currentStudents.length > 0 ? (
      currentStudents.map((student) => (
        <tr key={student.id} className="border">
          <td className="p-2 border text-left">{student.fullname}</td>
          <td className="p-2 border text-left">{student.email}</td>
          <td className="p-2 border text-center">{student.course}</td>
          <td className="p-2 border text-center">{student.year_level}</td>
          <td className="p-2 border text-center">{student.status}</td>
          <td className="p-2 border flex justify-center gap-2">
            <button className="text-blue-500 hover:text-blue-700" onClick={() => handleView(student)}>
              <FaEye className="w-5 h-5" />
            </button>
            <button className="hover:text-yellow-700" onClick={() => handleEdit(student)}>
              <FaEdit className="w-5 h-5" />
            </button>
            <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(student.id)}>
              <FaTrashAlt className="w-5 h-5" />
            </button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="6" className="text-center p-4 text-gray-500">
          No students found.
        </td>
      </tr>
    )}
  </tbody>
</table>
  
      {/* Pagination Controls */}
<div className="flex justify-end items-center mt-4 gap-2">
  <button
    onClick={prevPage}
    disabled={currentPage === 1}
    className={`px-3 py-2 rounded-md flex items-center ${
      currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
    }`}
  >
    <FaArrowLeft className="w-5 h-5" />
  </button>
  <span className="text-gray-700">
    Page {currentPage} of {Math.ceil(filteredStudents.length / studentsPerPage)}
  </span>
  <button
    onClick={nextPage}
    disabled={currentPage === Math.ceil(filteredStudents.length / studentsPerPage)}
    className={`px-3 py-2 rounded-md flex items-center ${
      currentPage === Math.ceil(filteredStudents.length / studentsPerPage) ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
    }`}
  >
    <FaArrowRight className="w-5 h-5" />
  </button>
</div>

{/* View Student Modal */}
{isViewModalOpen && selectedStudent && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-lg font-semibold mb-4">Student Details</h2>
      <p><strong>Full Name:</strong> {selectedStudent.fullname}</p>
      <p><strong>Email:</strong> {selectedStudent.email}</p>
      <p><strong>Username:</strong> {selectedStudent.username}</p>
      <p><strong>Course:</strong> {selectedStudent.course}</p>
      <p><strong>Year Level:</strong> {selectedStudent.year_level}</p>
      <p><strong>Gender:</strong> {selectedStudent.gender}</p>
      <p><strong>Birthdate:</strong> {selectedStudent.birthdate.split("T")[0]}</p> {/* Removes time part */}
      <p><strong>Contact Number:</strong> {selectedStudent.contact_number}</p>
      <p><strong>Address:</strong> {selectedStudent.address}</p>
      <p><strong>Status:</strong> {selectedStudent.status}</p>
      <div className="flex justify-end mt-4">
        <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setIsViewModalOpen(false)}>
          Close
        </button>
      </div>
    </div>
  </div>
)}



{isEditModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-lg font-semibold mb-4">Edit Student</h2>
      <form onSubmit={handleEditSubmit} className="flex flex-col gap-2">
        <input type="text" name="fullname" value={editFormData.fullname} className="border p-2 rounded" onChange={handleEditChange} />
        <input type="email" name="email" value={editFormData.email} className="border p-2 rounded" onChange={handleEditChange} />
        <input type="text" name="username" value={editFormData.username} className="border p-2 rounded" onChange={handleEditChange} />

        {/* Add Password Field */}
        <input type="password" name="password" placeholder="New Password (optional)" className="border p-2 rounded" onChange={handleEditChange} />

        <select name="course" value={editFormData.course} className="border p-2 rounded" onChange={handleEditChange}>
          <option value="BSIT">BSIT</option>
          <option value="CJEP">CJEP</option>
          <option value="BSBA">BSBA</option>
          <option value="TEP">TEP</option>
          <option value="HM">HM</option>
        </select>

        <select name="year_level" value={editFormData.year_level} className="border p-2 rounded" onChange={handleEditChange}>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        <select name="gender" value={editFormData.gender} className="border p-2 rounded" onChange={handleEditChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input type="date" name="birthdate" value={editFormData.birthdate} className="border p-2 rounded" onChange={handleEditChange} />

        {/* Contact Number Validation */}
        <input
          type="text"
          name="contact_number"
          value={editFormData.contact_number || ""}
          className="border p-2 rounded"
          onChange={handleEditContactNumberChange}
        />
        {editFormData.contact_number && editFormData.contact_number.length !== 11 && (
          <span className="text-red-500 text-sm">Contact number must be 11 digits.</span>
        )}

        <textarea name="address" value={editFormData.address} className="border p-2 rounded" onChange={handleEditChange}></textarea>

        <div className="flex justify-between mt-4">
          <button type="button" className="bg-red-400 text-white px-4 py-2 rounded" onClick={() => setIsEditModalOpen(false)}>
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Update Student
          </button>
        </div>
      </form>
    </div>
  </div>
)}




{isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-lg font-semibold mb-4">Add Student</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="text" name="first_name" placeholder="First Name" required className="border p-2 rounded" onChange={handleChange} />
        <input type="text" name="middle_name" placeholder="Middle Name" className="border p-2 rounded" onChange={handleChange} />
        <input type="text" name="last_name" placeholder="Last Name" required className="border p-2 rounded" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" required className="border p-2 rounded" onChange={handleChange} />
        <input type="text" name="username" placeholder="Username" required className="border p-2 rounded" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" required className="border p-2 rounded" onChange={handleChange} />

        {/* Course Selection Dropdown */}
        <select name="course" required className="border p-2 rounded" onChange={handleChange}>
          <option value="">Select Course</option>
          <option value="BSIT">BSIT</option>
          <option value="CJEP">CJEP</option>
          <option value="BSBA">BSBA</option>
          <option value="TEP">TEP</option>
          <option value="HM">HM</option>
        </select>

        {/* Year Level Selection Dropdown */}
        <select name="year_level" required className="border p-2 rounded" onChange={handleChange}>
          <option value="">Select Year Level</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        <select name="gender" required className="border p-2 rounded" onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input type="date" name="birthdate" required className="border p-2 rounded" onChange={handleChange} />

        {/* Contact Number Validation */}
        <input
          type="text"
          name="contact_number"
          placeholder="Contact Number"
          className="border p-2 rounded"
          value={formData.contact_number || ""}
          onChange={handleContactNumberChange}
        />
        {formData.contact_number && formData.contact_number.length !== 11 && (
          <span className="text-red-500 text-sm">Contact number must be 11 digits.</span>
        )}

        <textarea name="address" placeholder="Address" className="border p-2 rounded" onChange={handleChange}></textarea>

        <div className="flex justify-between mt-4">
          <button type="button" className="bg-red-400 text-white px-4 py-2 rounded" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Student
          </button>
        </div>
      </form>
    </div>
  </div>
)}
</div>
);}



// PROGRAM HEAD
function ProgramHead() {
  const [editingHead, setEditingHead] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [programHeads, setProgramHeads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    department_type: "Academic",
    status: "Active",
  });

  useEffect(() => {
    fetchProgramHeads();
  }, []);

  const fetchProgramHeads = async () => {
    try {
      const res = await fetch("/api/program-head");
      const data = await res.json();
      setProgramHeads(data);
    } catch (error) {
      console.error("Error fetching program heads:", error);
    }
  };

  // Handle Adding
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch("/api/program-head", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const result = await res.json();
  
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Program Head added successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
  
        setIsModalOpen(false);
        fetchProgramHeads(); // Refresh data
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: result.message || "Failed to add Program Head.",
        });
      }
    } catch (error) {
      console.error("Error adding program head:", error);
  
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong while adding the Program Head.",
      });
    }
  };
  
  // Open the edit modal with selected program head data
  const handleEdit = (head) => {
    setEditingHead({ ...head });
    setIsEditModalOpen(true);
  };

  // Save the edited data
  const handleSaveEdit = async () => {
    const response = await fetch("/api/program-head", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingHead),
    });
  
    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Program Head updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      fetchProgramHeads();
      setIsEditModalOpen(false);
    } else {
      const errorData = await response.json();
      Swal.fire({
        icon: "error",
        title: "Update Failed!",
        text: `Failed to update: ${errorData.message}`,
      });
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(`/api/program-head?id=${id}`, { method: "DELETE" });
  
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Program Head deleted successfully.",
            timer: 2000,
            showConfirmButton: false,
          });
          fetchProgramHeads();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Failed to delete Program Head.",
          });
        }
      } else {
        Swal.fire({
          icon: "info",
          title: "Cancelled",
          text: "Deletion was cancelled.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // Filter program heads based on search query
  const filteredProgramHeads = programHeads.filter((head) =>
    head.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="bg-blue-100 p-4 flex justify-between items-center rounded-lg shadow-md">
        <h2 className="text-lg md:text-xl">Program Heads</h2>
      </div>

      {/* Search & Add Button */}
      <div className="flex justify-between items-center mt-4">
        <input
          type="text"
          placeholder="Search for program head"
          className="border border-gray-300 p-2 rounded-md w-60"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="bg-gray-200 px-4 py-2 rounded-md" onClick={() => setIsModalOpen(true)}>
          ➕ Add New Program Head
        </button>
      </div>

      {/* Program Head Table */}
      <div className="overflow-x-auto mt-5">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-200">
              <th className="border border-gray-400 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-400 px-4 py-2">Department</th>
              <th className="border border-gray-400 px-4 py-2">Department Type</th>
              <th className="border border-gray-400 px-4 py-2">Status</th>
              <th className="border border-gray-400 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProgramHeads.length > 0 ? (
              filteredProgramHeads.map((head, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="border border-gray-400 px-4 py-2">{head.name}</td>
                  <td className="border border-gray-400 px-4 py-2">{head.email}</td>
                  <td className="border border-gray-400 px-4 py-2">{head.department}</td>
                  <td className="border border-gray-400 px-4 py-2">{head.department_type}</td>
                  <td className="border border-gray-400 px-4 py-2">{head.status}</td>
                  <td className="border border-gray-400 px-4 py-2 flex justify-center gap-2">
                    <button onClick={() => handleEdit(head)} className="hover:text-yellow-500">
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(head.id)} className="text-red-500 hover:text-red-600">
                      <FaTrashAlt className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No program heads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

      {/* Edit Modal */}
{isEditModalOpen && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-5 rounded shadow-lg w-1/3">
      <h2 className="text-xl font-bold mb-4">Edit Program Head</h2>

      <label className="block mb-2">Name:</label>
      <input
        type="text"
        value={editingHead.name}
        onChange={(e) => setEditingHead({ ...editingHead, name: e.target.value })}
        className="w-full border border-gray-300 rounded p-2 mb-2"
      />

      <label className="block mb-2">Email:</label>
      <input
        type="email"
        value={editingHead.email}
        onChange={(e) => setEditingHead({ ...editingHead, email: e.target.value })}
        className="w-full border border-gray-300 rounded p-2 mb-2"
      />

      <label className="block mb-2">Department:</label>
      <input
        type="text"
        value={editingHead.department}
        onChange={(e) => setEditingHead({ ...editingHead, department: e.target.value })}
        className="w-full border border-gray-300 rounded p-2 mb-2"
      />

      <label className="block mb-2">Department Type:</label>
      <select
        value={editingHead.department_type}
        onChange={(e) => setEditingHead({ ...editingHead, department_type: e.target.value })}
        className="w-full border border-gray-300 rounded p-2 mb-2"
      >
        <option value="Academic">Academic</option>
        <option value="Non-Academic">Non-Academic</option>
      </select>

      <label className="block mb-2">Status:</label>
      <select
        value={editingHead.status}
        onChange={(e) => setEditingHead({ ...editingHead, status: e.target.value })}
        className="w-full border border-gray-300 rounded p-2 mb-4"
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      {/* New Password Field (Optional) */}
      <label className="block mb-2">New Password (Optional):</label>
      <input
        type="password"
        placeholder="Leave blank to keep the current password"
        onChange={(e) => setEditingHead({ ...editingHead, newPassword: e.target.value })}
        className="w-full border border-gray-300 rounded p-2 mb-4"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setIsEditModalOpen(false)}
          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveEdit}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
</div>

      {/* Add Program Head Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Add Program Head</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <input type="text" name="name" placeholder="Full Name" required className="border p-2 rounded" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <input type="email" name="email" placeholder="Email" required className="border p-2 rounded" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <input type="password" name="password" placeholder="Password" required className="border p-2 rounded" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              
              <select name="department" required className="border p-2 rounded" onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                <option value="">Select Department</option>
                <option value="BSIT">BSIT</option>
                <option value="CJEP">CJEP</option>
                <option value="BSBA">BSBA</option>
                <option value="BEED">TEP</option>
                <option value="HM">HM</option>
              </select>

              <select name="department_type" required className="border p-2 rounded" onChange={(e) => setFormData({ ...formData, department_type: e.target.value })}>
                <option value="Academic">Academic</option>
                <option value="Non-Academic">Non-Academic</option>
              </select>

              <select name="status" required className="border p-2 rounded" onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div className="flex justify-between mt-4">
                <button type="button" className="bg-red-400 text-white px-4 py-2 rounded" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Add Program Head
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


// SUBJECTS
function Subjects() {
  const [department, setDepartment] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState([{ subjectCode: "", subjectName: "", units: "" }]);
  const [subjectList, setSubjectList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch subjects from the database with filters
  const fetchSubjects = () => {
    if (department && yearLevel && semester) {
      setLoading(true);
      fetch(`/api/fetchSubjects?department=${department}&yearLevel=${yearLevel}&semester=${semester}`)
        .then((res) => res.json())
        .then((data) => setSubjectList(data))
        .catch((err) => console.error("Error fetching subjects:", err))
        .finally(() => setLoading(false));
    }
  };

  // Call fetchSubjects on filter change
  useEffect(() => {
    fetchSubjects();
  }, [department, yearLevel, semester]);

  // Add a new empty row for subjects input
  const addNewSubjectRow = () => setSubjects([...subjects, { subjectCode: "", subjectName: "", units: "" }]);

  // Handle input changes for each subject row
  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  // Add subjects to the database
  const handleAddSubjects = async () => {
    if (!department || !yearLevel || !semester) {
      alert("Please select Department, Year Level, and Semester.");
      return;
    }

    const incompleteSubjects = subjects.some((subject) => !subject.subjectCode || !subject.subjectName || !subject.units);

    if (incompleteSubjects) {
      alert("Please fill in all subject fields.");
      return;
    }

    try {
      const response = await fetch("/api/addSubjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          department,
          yearLevel,
          semester,
          subjects,
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Subjects added successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        setSubjects([{ subjectCode: "", subjectName: "", units: "" }]);
        fetchSubjects(); // ✅ Refresh the subject list after adding
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to add subjects",
          text: data.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error adding subjects:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="mt-10 p-8 pt-8 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-3xl font-bold mb-4">Add & View Subjects</h2>
  
      {/* Department, Year Level, Semester Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select value={department} onChange={(e) => setDepartment(e.target.value)} className="p-2 border rounded-lg shadow-sm">
          <option value="">Select Department</option>
          {["BSIT", "CJEP", "BSBA", "TEP", "HM"].map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
  
        <select value={yearLevel} onChange={(e) => setYearLevel(e.target.value)} className="p-2 border rounded-lg shadow-sm">
          <option value="">Select Year Level</option>
          {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
  
        <select value={semester} onChange={(e) => setSemester(e.target.value)} className="p-2 border rounded-lg shadow-sm">
          <option value="">Select Semester</option>
          {["1st Semester", "2nd Semester", "Summer"].map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>
      </div>
  
      {/* Subject Inputs */}
      <div className="space-y-3">
        {subjects.map((subject, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Subject Code"
              value={subject.subjectCode}
              onChange={(e) => handleSubjectChange(index, "subjectCode", e.target.value)}
              className="p-2 border rounded-lg shadow-sm"
            />
            <input
              type="text"
              placeholder="Subject Name"
              value={subject.subjectName}
              onChange={(e) => handleSubjectChange(index, "subjectName", e.target.value)}
              className="p-2 border rounded-lg shadow-sm"
            />
            <input
              type="number"
              placeholder="Units"
              value={subject.units}
              onChange={(e) => handleSubjectChange(index, "units", e.target.value)}
              className="p-2 border rounded-lg shadow-sm"
            />
          </div>
        ))}
      </div>
  
      {/* Buttons */}
      <div className="flex gap-4 mt-3">
        <button onClick={addNewSubjectRow} className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600">
          + Add Another Subject
        </button>
  
        <button onClick={handleAddSubjects} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
          Save All Subjects
        </button>
      </div>
  
      {/* Display Subject Table */}
      {loading ? (
        <p className="text-center mt-4 text-gray-500">Loading subjects...</p>
      ) : subjectList.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 mt-4 shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 text-sm">Subject Code</th>
              <th className="border p-3 text-sm">Subject Name</th>
              <th className="border p-3 text-sm">Units</th>
            </tr>
          </thead>
          <tbody>
            {subjectList.map((sub, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border p-3 text-center text-sm">{sub.subject_code}</td>
                <td className="border p-3 text-center text-sm">{sub.subject_name}</td>
                <td className="border p-3 text-center text-sm">{sub.units}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center mt-4 text-gray-500">No subjects found for this selection.</p>
      )}
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
