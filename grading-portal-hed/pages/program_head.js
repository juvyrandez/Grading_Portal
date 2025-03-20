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
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [viewedStudent, setViewedStudent] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("1st Sem");
  const [allGrades, setAllGrades] = useState([]);
  const [gradeData, setGradeData] = useState({
    subjectCode: "",
    description: "",
    units: "",
    midterm: "",
    final: "",
    remarks: "",
    semester: "1st Sem", // Default semester
  });
  

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


  // 🗑️ Delete student
  const handleDelete = async (studentId) => {
    const confirmDelete = confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/removeStudent?id=${studentId}`, { method: "DELETE" });
      const data = await response.json();

      if (response.ok) {
        alert("Student removed successfully!");
        setStudents((prev) => prev.filter((s) => s.id !== studentId));
      } else {
        alert(data.error || "Failed to remove student.");
      }
    } catch (error) {
      console.error("Error removing student:", error);
      alert("Failed to remove student.");
    }
  };

  // ✏️ Open the grade modal
const handleAddGrade = (student) => {
  setSelectedStudent(student);
  setShowGradeModal(true);
  setGradeData({
    subjectCode: "",
    description: "",
    units: "",
    midterm: "",
    final: "",
    remarks: "",
    semester: "1st Sem",
  });
};

// 📌 Handle grade submission
const submitGrade = async () => {
  const { subjectCode, description, units, midterm, final, remarks, semester } = gradeData;

  if (!subjectCode || !description || !units || !semester) {
    alert("Please fill in the subject details, units, and semester.");
    return;
  }

  try {
    const response = await fetch("/api/addGrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: selectedStudent.id,
        subjectCode,
        description,
        units,
        midterm: midterm || null, // Allow empty midterm
        final: final || null, // Allow empty final
        remarks: remarks || "Pending",
        semester,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(`Grade added successfully for ${selectedStudent.fullname}!`);
      setShowGradeModal(false);
      setGradeData({
        subjectCode: "",
        description: "",
        units: "",
        midterm: "",
        final: "",
        remarks: "",
        semester: "1st Sem",
      });
    } else {
      alert(data.error || "Failed to add grade.");
    }
  } catch (error) {
    console.error("Error adding grade:", error);
    alert("Failed to add grade.");
  }
};

const handleUpdateGrades = async (student) => {
  setSelectedStudent(student);
  try {
    const response = await fetch(`/api/getAllGrades?studentId=${student.id}`);
    const data = await response.json();
    setAllGrades(data.grades);
    setShowUpdateModal(true);
  } catch (error) {
    console.error("Error loading grades:", error);
    alert("Failed to load grades.");
  }
};

const handleGradeChange = (index, field, value) => {
  const updatedGrades = [...allGrades];
  updatedGrades[index][field] = value;
  updatedGrades[index].remarks = calculateRemarks(
    updatedGrades[index].midterm_grade,
    updatedGrades[index].final_grade
  );
  setAllGrades(updatedGrades);
};

const calculateRemarks = (midterm, final) => {
  const average = (parseFloat(midterm) + parseFloat(final)) / 2;
  if (isNaN(average)) return "Incomplete";
  return average <= 3.0 ? "Passed" : "Failed";
};

const submitUpdatedGrades = async () => {
  try {
    const response = await fetch("/api/updateGrades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: selectedStudent.id, grades: allGrades }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Grades updated successfully!");
      setShowUpdateModal(false);
    } else {
      alert(data.error || "Failed to update grades.");
    }
  } catch (error) {
    console.error("Error updating grades:", error);
    alert("Failed to update grades.");
  }
};


return (
  <div>
    <h3 className="font-bold mb-4">
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
                  className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
                  onClick={() => handleView(student)}
                >
                  View
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                  onClick={() => handleDelete(student.id)}
                >
                  Delete
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                  onClick={() => handleAddGrade(student)}
                >
                  Add Grade
                </button>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded text-sm"
                  onClick={() => handleUpdateGrades(student)}
                >
                  Update Grades
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p className="text-gray-500">No students found for this year level.</p>
    )}



{showUpdateModal && selectedStudent && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded shadow-lg w-[80%] max-w-4xl">
      <h2 className="text-lg font-bold mb-4 text-center">
        Update Grades for {selectedStudent.fullname}
      </h2>

      {/* Dropdown for Semester Selection */}
      <div className="mb-4 text-center">
        <label htmlFor="semester" className="mr-2 font-semibold">
          Select Semester:
        </label>
        <select
          id="semester"
          className="p-2 border rounded"
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
        >
          <option value="1st Sem">1st Semester</option>
          <option value="2nd Sem">2nd Semester</option>
          <option value="Summer">Summer</option>
        </select>
      </div>

      {allGrades.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {allGrades
            .filter((grade) => grade.semester === selectedSemester)
            .map((grade, index) => (
              <div key={index} className="p-2 border rounded shadow-sm bg-gray-50">
                <h3 className="font-semibold text-center mb-2">{grade.semester}</h3>
                <input
                  type="text"
                  placeholder="Subject Code"
                  value={grade.subject_code}
                  onChange={(e) => handleGradeChange(index, "subject_code", e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Midterm Grade"
                  value={grade.midterm_grade || ""}
                  onChange={(e) => handleGradeChange(index, "midterm_grade", e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Final Grade"
                  value={grade.final_grade || ""}
                  onChange={(e) => handleGradeChange(index, "final_grade", e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="text"
                  value={grade.remarks}
                  readOnly
                  className="w-full mb-2 p-2 border bg-gray-200 rounded"
                />
              </div>
            ))}
        </div>
      ) : (
        <p className="text-center">No grades available to update.</p>
      )}

      {/* Buttons */}
      <div className="flex justify-end mt-4 gap-2">
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          onClick={() => setShowUpdateModal(false)}
        >
          Cancel
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={submitUpdatedGrades}
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}



{showGradeModal && selectedStudent && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded shadow-lg w-96">
      <h2 className="text-lg font-bold mb-4">Add Grade for {selectedStudent.fullname}</h2>
      <select
        value={gradeData.semester}
        onChange={(e) => setGradeData({ ...gradeData, semester: e.target.value })}
        className="w-full mb-2 p-2 border"
      >
        <option value="1st Sem">1st Sem</option>
        <option value="2nd Sem">2nd Sem</option>
        <option value="Summer">Summer</option>
      </select>
      <input
        type="text"
        placeholder="Subject Code"
        value={gradeData.subjectCode}
        onChange={(e) => setGradeData({ ...gradeData, subjectCode: e.target.value })}
        className="w-full mb-2 p-2 border"
      />
      <input
        type="text"
        placeholder="Descriptive Title"
        value={gradeData.description}
        onChange={(e) => setGradeData({ ...gradeData, description: e.target.value })}
        className="w-full mb-2 p-2 border"
      />
      <input
        type="number"
        placeholder="Units"
        value={gradeData.units}
        onChange={(e) => setGradeData({ ...gradeData, units: e.target.value })}
        className="w-full mb-2 p-2 border"
      />
      <input
        type="text"
        placeholder="Midterm Grade"
        value={gradeData.midterm}
        onChange={(e) => setGradeData({ ...gradeData, midterm: e.target.value })}
        className="w-full mb-2 p-2 border"
      />
      <input
        type="text"
        placeholder="Final Grade"
        value={gradeData.final}
        onChange={(e) => setGradeData({ ...gradeData, final: e.target.value })}
        className="w-full mb-4 p-2 border"
      />
      <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={() => setShowGradeModal(false)}>
        Cancel
      </button>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={submitGrade}>
        Add Grade
      </button>
    </div>
  </div>
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

