import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {FiLogOut, FiMenu, FiBell,FiSearch,FiPlus,FiEdit2,FiTrash2,FiEye,FiChevronLeft,FiChevronRight,FiAlertTriangle,FiX,FiBook,FiXCircle } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import Swal from "sweetalert2";
import { Bar } from "react-chartjs-2";
import { FaUserTie } from "react-icons/fa";
import { FaUserGraduate, FaChalkboardTeacher, FaBookOpen } from "react-icons/fa";
import { FaEye, FaEdit, FaTrash ,FaTrashAlt } from "react-icons/fa";
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
      router.push("/login_form"); // Redirect to login form if not authenticated
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
    fetch("/api/admin_programhead/getCounts")
      .then((res) => res.json())
      .then((data) => {
        setStudentsCount(data.students);
        setProgramHeadsCount(data.programHeads);
        setSubjectsCount(data.subjects);
      })
      .catch((err) => console.error("Error fetching counts:", err));

    fetch("/api/admin_programhead/getDepartmentCounts")
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
      backgroundColor: [
        "#800000", // Maroon for BSIT
        "#03A9F4", // Blue for CJEP (assuming CTEP is same as CJEP)
        "#FFC107", // Yellow for BSBA
        "#64B5F6", // Light blue for TEP (not too dark)
        "#4CAF50", // Green for HM
      ],
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
  const studentsPerPage = 10;
  
  // Subjects state
  const [irregularSubjects, setIrregularSubjects] = useState({
    available: [],
    assigned: []
  });
  const [newIrregularSubject, setNewIrregularSubject] = useState({
    subject_id: '',
    semester: '1st Semester'
  });
  const [selectedDepartment, setSelectedDepartment] = useState("");

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

  // Enhanced handleView to fetch subjects data including dropped subjects
  const handleView = async (student) => {
    setSelectedStudent(student);
    
    try {
      const res = await fetch(`/api/students_dashboard/studentSubjects?studentId=${student.id}`);
      const data = await res.json();
      
      // Filter out dropped subjects from regular subjects
      const droppedSubjectIds = data.droppedRegularSubjects?.map(sub => sub.subject_id) || [];
      const filteredRegularSubjects = data.regularSubjects?.filter(
        subject => !droppedSubjectIds.includes(subject.subject_id)
      ) || [];
      
      setSelectedStudent({
        ...student,
        regularSubjects: filteredRegularSubjects,
        irregularSubjects: data.irregularSubjects || [],
        droppedSubjects: data.droppedRegularSubjects || []
      });
      
      setIsViewModalOpen(true);
    } catch (error) {
      console.error('Error fetching student subjects:', error);
      setSelectedStudent(student);
      setIsViewModalOpen(true);
    }
  };

  const handleEdit = async (student) => {
    setEditFormData({
      ...student,
      password: '' // Clear password field when opening modal
    });
    setIsEditModalOpen(true);
    setSelectedDepartment("");
    await fetchIrregularSubjects(student.id);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  // Fetch irregular subjects for a student with department filter
  const fetchIrregularSubjects = async (studentId) => {
    try {
      const url = `/api/students_dashboard/irregularSubjects?studentId=${studentId}${
        selectedDepartment ? `&department=${selectedDepartment}` : ''
      }`;
      const res = await fetch(url);
      const data = await res.json();
      setIrregularSubjects({
        available: data.availableSubjects || [],
        assigned: data.assignedSubjects || []
      });
    } catch (error) {
      console.error('Error fetching irregular subjects:', error);
    }
  };

  // Add department filter effect
  useEffect(() => {
    if (isEditModalOpen && editFormData.id) {
      fetchIrregularSubjects(editFormData.id);
    }
  }, [selectedDepartment]);

  // Add irregular subject
  const handleAddIrregularSubject = async () => {
    try {
      const response = await fetch('/api/students_dashboard/irregularSubjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: editFormData.id,
          subject_id: newIrregularSubject.subject_id,
          semester: newIrregularSubject.semester
        }),
      });

      if (response.ok) {
        fetchIrregularSubjects(editFormData.id);
        setNewIrregularSubject({
          subject_id: '',
          semester: '1st Semester'
        });
        Swal.fire({
          icon: 'success',
          title: 'Subject Added',
          text: 'Irregular subject has been assigned to the student',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error adding irregular subject:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add irregular subject',
      });
    }
  };

  // Remove irregular subject
  const handleRemoveIrregularSubject = async (subjectId) => {
    try {
      const response = await fetch(
        `/api/students_dashboard/irregularSubjects?student_id=${editFormData.id}&subject_id=${subjectId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        fetchIrregularSubjects(editFormData.id);
        Swal.fire({
          icon: 'success',
          title: 'Subject Removed',
          text: 'Irregular subject has been removed',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error removing irregular subject:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to remove irregular subject',
      });
    }
  };

  // Handle dropping a subject (regular or irregular)
  const handleDropSubject = async (subjectId, subjectType) => {
    if (!selectedStudent?.id) return;
  
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `This will drop the ${subjectType} subject from the student`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, drop it!'
    });
  
    if (result.isConfirmed) {
      try {
        let endpoint, method, body;
  
        if (subjectType === 'regular') {
          endpoint = '/api/students_dashboard/dropRegularSubject';
          method = 'POST';
          body = {
            student_id: selectedStudent.id,
            subject_id: subjectId
          };
        } else {
          endpoint = '/api/students_dashboard/irregularSubjects';
          method = 'DELETE';
          body = {
            student_id: selectedStudent.id,
            subject_id: subjectId
          };
        }
  
        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to drop subject');
        }
  
        Swal.fire({
          icon: 'success',
          title: 'Subject Dropped',
          text: `The ${subjectType} subject has been moved to dropped subjects`,
          timer: 2000,
          showConfirmButton: false
        });
        
        // Refresh the student data
        handleView(selectedStudent);
      } catch (error) {
        console.error(`Error dropping ${subjectType} subject:`, error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || `Failed to drop ${subjectType} subject`,
        });
      }
    }
  };

  // Handle Update
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Create a copy of editFormData without the password if it's empty
      const dataToSend = { ...editFormData };
      if (!dataToSend.password || dataToSend.password.trim() === '') {
        delete dataToSend.password;
      }

      const res = await fetch("/api/students/updateStudent", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
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
          const res = await fetch(`/api/students/deleteStudent?id=${id}`, {
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
      const res = await fetch("/api/students/students");
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
  
      const res = await fetch("/api/students/addStudent", {
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

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedDepartment(""); // Clear department filter when closing modal
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 flex flex-col md:flex-row justify-between items-center rounded-lg shadow-lg">
        <h2 className="text-xl text-black mb-3 md:mb-0">Student Management</h2>
        <div className="flex gap-3">
          <select
            className="bg-white bg-opacity-90 border border-blue-200 p-2 rounded-lg text-gray-700 cursor-pointer shadow-sm focus:ring-2 focus:ring-white focus:border-white"
            onChange={(e) => setSelectedYear(e.target.value)}
            value={selectedYear}
          >
            <option value="" className="text-gray-500">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
          <select
            className="bg-white bg-opacity-90 border border-blue-200 p-2 rounded-lg text-gray-700 cursor-pointer shadow-sm focus:ring-2 focus:ring-white focus:border-white"
            onChange={(e) => setSelectedCourse(e.target.value)}
            value={selectedCourse}
          >
            <option value="" className="text-gray-500">All Courses</option>
            <option value="BSIT">BSIT</option>
            <option value="CJEP">CJEP</option>
            <option value="BSBA">BSBA</option>
            <option value="TEP">TEP</option>
            <option value="HM">HM</option>
          </select>
        </div>
      </div>
  
      {/* Search & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search students..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 whitespace-nowrap"
          onClick={() => setIsModalOpen(true)}
        >
          <FiPlus className="w-5 h-5" />
          Add Student
        </button>
      </div>
  
      {error && (
        <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
  
      {/* Student Table */}
      <div className="mt-6 overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year Level
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentStudents.length > 0 ? (
              currentStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.fullname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {student.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {student.year_level}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      student.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleView(student)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleEdit(student)}
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                        title="Edit"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No students found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  
      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} students
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
              currentPage === 1 
                ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700"
            } transition-colors`}
          >
            <FiChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.ceil(filteredStudents.length / studentsPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentPage === i + 1 
                    ? "bg-blue-600 text-white" 
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } transition-colors`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={nextPage}
            disabled={currentPage === Math.ceil(filteredStudents.length / studentsPerPage)}
            className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
              currentPage === Math.ceil(filteredStudents.length / studentsPerPage)
                ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700"
            } transition-colors`}
          >
            <span>Next</span>
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Enhanced View Student Modal with Subjects */}
      {isViewModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Student Details</h2>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* Personal Info Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <p><strong>Full Name:</strong> {selectedStudent.fullname}</p>
                    <p><strong>Email:</strong> {selectedStudent.email}</p>
                    <p><strong>Username:</strong> {selectedStudent.username}</p>
                    <p><strong>Course:</strong> {selectedStudent.course}</p>
                    <p><strong>Year Level:</strong> {selectedStudent.year_level}</p>
                    <p><strong>Gender:</strong> {selectedStudent.gender}</p>
                    <p><strong>Birthdate:</strong> {selectedStudent.birthdate?.split("T")[0]}</p>
                    <p><strong>Contact Number:</strong> {selectedStudent.contact_number}</p>
                    <p><strong>Address:</strong> {selectedStudent.address}</p>
                    <p>
                      <strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        selectedStudent.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedStudent.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Subjects Column */}
              <div className="space-y-6">
                <h3 className="font-medium text-lg">Subjects</h3>
                
                {/* Regular Subjects */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <FiBook className="mr-2" /> Regular Subjects
                    <span className="ml-auto text-sm text-gray-500">
                      {selectedStudent.course} - Year {selectedStudent.year_level}
                    </span>
                  </h4>
                  
                  {selectedStudent.regularSubjects && selectedStudent.regularSubjects.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Code</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Subject</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Units</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Semester</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedStudent.regularSubjects.map((subject) => (
                            <tr key={subject.subject_id}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{subject.subject_code}</td>
                              <td className="px-4 py-2 text-sm">{subject.subject_name}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{subject.units}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{subject.semester}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                <button
                                  onClick={() => handleDropSubject(subject.subject_id, 'regular')}
                                  className="text-red-500 hover:text-red-700"
                                  title="Drop subject"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No active regular subjects for this student</p>
                  )}
                </div>
                
                {/* Irregular Subjects */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <FiAlertTriangle className="mr-2" /> Irregular Subjects
                  </h4>
                  
                  {selectedStudent.irregularSubjects && selectedStudent.irregularSubjects.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Code</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Subject</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Units</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Semester</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedStudent.irregularSubjects.map((subject) => (
                            <tr key={`irregular-${subject.subject_id}`}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{subject.subject_code}</td>
                              <td className="px-4 py-2 text-sm">{subject.subject_name}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{subject.units}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{subject.semester}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                <button
                                  onClick={() => handleDropSubject(subject.subject_id, 'irregular')}
                                  className="text-red-500 hover:text-red-700"
                                  title="Remove subject"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No irregular subjects assigned to this student</p>
                  )}
                </div>

                {/* Dropped Subjects */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <FiXCircle className="mr-2" /> Dropped Subjects
                  </h4>
                  
                  {selectedStudent.droppedSubjects && selectedStudent.droppedSubjects.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Code</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Subject</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Units</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Semester</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Dropped On</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedStudent.droppedSubjects.map((subject) => (
                            <tr key={`dropped-${subject.subject_id}`}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{subject.subject_code}</td>
                              <td className="px-4 py-2 text-sm">{subject.subject_name}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{subject.units}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{subject.semester}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                {new Date(subject.dropped_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No dropped subjects</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end p-6 border-t">
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal with Irregular Subjects */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Edit Student</h2>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    name="fullname" 
                    value={editFormData.fullname} 
                    className="border p-2 rounded w-full" 
                    onChange={handleEditChange} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={editFormData.email} 
                    className="border p-2 rounded w-full" 
                    onChange={handleEditChange} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input 
                    type="text" 
                    name="username" 
                    value={editFormData.username} 
                    className="border p-2 rounded w-full" 
                    onChange={handleEditChange} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password (optional)</label>
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="Leave blank to keep current" 
                    className="border p-2 rounded w-full" 
                    onChange={handleEditChange}
                    value={editFormData.password || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                  <select 
                    name="course" 
                    value={editFormData.course} 
                    className="border p-2 rounded w-full" 
                    onChange={handleEditChange}
                  >
                    <option value="BSIT">BSIT</option>
                    <option value="CJEP">CJEP</option>
                    <option value="BSBA">BSBA</option>
                    <option value="TEP">TEP</option>
                    <option value="HM">HM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year Level</label>
                  <select 
                    name="year_level" 
                    value={editFormData.year_level} 
                    className="border p-2 rounded w-full" 
                    onChange={handleEditChange}
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select 
                    name="gender" 
                    value={editFormData.gender} 
                    className="border p-2 rounded w-full" 
                    onChange={handleEditChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
                  <input 
                    type="date" 
                    name="birthdate" 
                    value={editFormData.birthdate} 
                    className="border p-2 rounded w-full" 
                    onChange={handleEditChange} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="text"
                    name="contact_number"
                    value={editFormData.contact_number || ""}
                    className="border p-2 rounded w-full"
                    onChange={handleEditContactNumberChange}
                  />
                  {editFormData.contact_number && editFormData.contact_number.length !== 11 && (
                    <span className="text-red-500 text-sm">Contact number must be 11 digits.</span>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea 
                    name="address" 
                    value={editFormData.address} 
                    className="border p-2 rounded w-full" 
                    onChange={handleEditChange} 
                    rows="3"
                  ></textarea>
                </div>
              </div>

              {/* Irregular Subjects Section */}
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">Irregular Subject Management</h3>
                
                {/* Department Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Department:</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="border p-2 rounded w-full"
                  >
                    <option value="">All Departments</option>
                    <option value="BSIT">BSIT</option>
                    <option value="CJEP">CJEP</option>
                    <option value="BSBA">BSBA</option>
                    <option value="TEP">TEP</option>
                    <option value="HM">HM</option>
                  </select>
                </div>

                {/* Current Irregular Subjects */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Currently Assigned Subjects:</h4>
                  {irregularSubjects.assigned.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                      {irregularSubjects.assigned.map(subject => (
                        <div key={subject.subject_id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <span className="font-medium">{subject.subject_code}</span> - {subject.subject_name} 
                            <span className="text-sm text-gray-500 ml-2">({subject.semester})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveIrregularSubject(subject.subject_id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove subject"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No irregular subjects assigned</p>
                  )}
                </div>
                
                {/* Add New Irregular Subject */}
                <div className="flex flex-col sm:flex-row gap-2 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Update Subject</label>
                    <select
                      value={newIrregularSubject.subject_id}
                      onChange={(e) => setNewIrregularSubject({
                        ...newIrregularSubject,
                        subject_id: e.target.value
                      })}
                      className="border p-2 rounded w-full"
                    >
                      <option value="">Select Subject</option>
                      {irregularSubjects.available.map(subject => (
                        <option key={subject.subject_id} value={subject.subject_id}>
                          {subject.subject_code} - {subject.subject_name} 
                          (Dept: {subject.department}, Year: {subject.year_level}, Sem: {subject.semester})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full sm:w-auto">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                    <select
                      value={newIrregularSubject.semester}
                      onChange={(e) => setNewIrregularSubject({
                        ...newIrregularSubject,
                        semester: e.target.value
                      })}
                      className="border p-2 rounded w-full"
                    >
                      <option value="1st Semester">1st Semester</option>
                      <option value="2nd Semester">2nd Semester</option>
                      <option value="Summer">Summer</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddIrregularSubject}
                    disabled={!newIrregularSubject.subject_id}
                    className={`px-4 py-2 rounded w-full sm:w-auto ${
                      newIrregularSubject.subject_id 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Update Subject
                  </button>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button 
                  type="button" 
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  onClick={handleCloseEditModal}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">Add New Student</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Column 1 */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input 
                          type="text" 
                          name="first_name" 
                          placeholder="First Name" 
                          required 
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onChange={handleChange} 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                        <input 
                          type="text" 
                          name="middle_name" 
                          placeholder="Middle Name" 
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                          onChange={handleChange} 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input 
                          type="text" 
                          name="last_name" 
                          placeholder="Last Name" 
                          required 
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                          onChange={handleChange} 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="student@example.com" 
                        required 
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange} 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input 
                        type="text" 
                        name="username" 
                        placeholder="Username" 
                        required 
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange} 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input 
                        type="password" 
                        name="password" 
                        placeholder="••••••••" 
                        required 
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange} 
                      />
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                        <select 
                          name="course" 
                          required 
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                          onChange={handleChange}
                        >
                          <option value="">Select Course</option>
                          <option value="BSIT">BSIT</option>
                          <option value="CJEP">CJEP</option>
                          <option value="BSBA">BSBA</option>
                          <option value="TEP">TEP</option>
                          <option value="HM">HM</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year Level</label>
                        <select 
                          name="year_level" 
                          required 
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                          onChange={handleChange}
                        >
                          <option value="">Select Year</option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                        <select 
                          name="gender" 
                          required 
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                          onChange={handleChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
                        <input 
                          type="date" 
                          name="birthdate" 
                          required 
                          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                          onChange={handleChange} 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                      <input
                        type="text"
                        name="contact_number"
                        placeholder="09XXXXXXXXX"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={formData.contact_number || ""}
                        onChange={handleContactNumberChange}
                      />
                      {formData.contact_number && formData.contact_number.length !== 11 && (
                        <span className="text-red-500 text-xs mt-1">Contact number must be 11 digits</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea 
                        name="address" 
                        placeholder="Full address" 
                        rows="3"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button 
                    type="button" 
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



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
      const res = await fetch("/api/admin_programhead/program-head");
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
      const res = await fetch("/api/admin_programhead/program-head", {
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
        fetchProgramHeads(); 
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
    const response = await fetch("/api/admin_programhead/program-head", {
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
        const response = await fetch(`/api/admin_programhead/program-head?id=${id}`, { method: "DELETE" });
  
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
      <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 flex justify-between items-center rounded-lg shadow-lg">
        <h2 className="text-lg md:text-xl text-black">Manage Program Head</h2>
      </div>
  
      {/* Search & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search program heads..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
          onClick={() => setIsModalOpen(true)}
        >
          <FiPlus className="w-5 h-5" />
          <span>Add New Program Head</span>
        </button>
      </div>
  
      {/* Program Head Table */}
      <div className="mt-6 overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProgramHeads.length > 0 ? (
              filteredProgramHeads.map((head, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {head.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {head.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {head.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      head.department_type === 'Academic' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {head.department_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      head.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {head.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleEdit(head)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Edit"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(head.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No program heads found
                </td>
              </tr>
            )}
          </tbody>
        </table>

      {/* Edit Modal */}
    {isEditModalOpen && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 rounded-t-lg">
            <h2 className="text-xl font-semibold text-white">Edit Program Head</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={editingHead.name}
                onChange={(e) => setEditingHead({ ...editingHead, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={editingHead.email}
                onChange={(e) => setEditingHead({ ...editingHead, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={editingHead.department}
                onChange={(e) => setEditingHead({ ...editingHead, department: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Department</option>
                <option value="BSIT">BSIT</option>
                <option value="CJEP">CJEP</option>
                <option value="BSBA">BSBA</option>
                <option value="TEP">TEP</option>
                <option value="HM">HM</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department Type</label>
              <select
                value={editingHead.department_type}
                onChange={(e) => setEditingHead({ ...editingHead, department_type: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Academic">Academic</option>
                <option value="Non-Academic">Non-Academic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={editingHead.status}
                onChange={(e) => setEditingHead({ ...editingHead, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password (Optional)</label>
              <input
                type="password"
                placeholder="Leave blank to keep current password"
                value={editingHead.newPassword || ''}
                onChange={(e) => setEditingHead({ ...editingHead, newPassword: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
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
                <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg bg-white-300 text-gray px-4 py-2 rounded" onClick={() => setIsModalOpen(false)}>
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
      fetch(`/api/admin_subjects/fetchSubjects?department=${department}&yearLevel=${yearLevel}&semester=${semester}`)
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
      const response = await fetch("/api/admin_subjects/addSubjects", {
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
