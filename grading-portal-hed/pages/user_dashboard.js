import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MdDashboard } from "react-icons/md";
import { FaHandsHelping } from "react-icons/fa";
import { FiBell, FiLogOut, FiMenu } from "react-icons/fi";
import "@fontsource/poppins";
import { FaBook } from "react-icons/fa";
import Swal from "sweetalert2";
import { FaUserCircle } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import { FaHome } from "react-icons/fa";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
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
          router.push("/");
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

        <ul className="font-poppins mt-6 space-y-3">
  <SidebarItem icon={MdDashboard} label="Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
  <SidebarItem icon={FaBook} label="Grades" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
  <SidebarItem icon={FaHandsHelping} label="Help" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />


          {/* Back to Home Button */}
          <li
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition cursor-pointer mt-6"
            onClick={() => router.push("/")}
          >
            <FaHome size={28} />
            {isSidebarOpen && <span>Back to Home</span>}
          </li>
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
  <button className="flex items-center gap-3" onClick={() => setDropdownOpen(!dropdownOpen)}>
    <span className="font-semibold">{user ? user.username : "User"}</span>
    <FaUserCircle className="w-10 h-10 text-gray-500 " />
  </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg p-2">
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200 rounded-md flex items-center gap-2">
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  </div>

  {/* Content Area - Render based on activeTab */}
  <div className="font-poppins">
  {activeTab === "Dashboard" && <Profile studentId={user?.id} />}
  {activeTab === "Grades" && user && <Grades studentId={user.id} />}
  {activeTab === "Help" && <Help />}
</div>
</main>
    </div>
  );
}

/* Sidebar Item Component */
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

/* Content Components */
function Profile({ studentId }) {
  const [student, setStudent] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch student data immediately
  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const res = await fetch(`/api/students_dashboard/getStudentProfile?studentId=${studentId}`);
        const data = await res.json();
        if (res.ok) setStudent(data);
        else console.error("Failed to fetch student profile:", data.error);
      } catch (err) {
        console.error("Error fetching student profile:", err);
      }
    };

    fetchStudentProfile();
  }, [studentId]);

  // Handle image selection
  const handleImageChange = (e) => setNewImage(e.target.files[0]);

  // Handle image upload
const handleUpload = async () => {
  if (!newImage)
    return Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Please select an image first!",
    });

  const formData = new FormData();
  formData.append("image", newImage);
  formData.append("studentId", studentId);

  try {
    const res = await fetch("/api/students_dashboard/uploadProfileImage", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setStudent((prev) => ({ ...prev, profile_img: data.profile_img }));

      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your profile picture has been updated successfully.",
        showConfirmButton: false,
        timer: 1500,
      });

      setIsEditing(false);
    } else {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: data.error || "Something went wrong. Please try again.",
      });
    }
  } catch (err) {
    console.error("Error uploading profile image:", err);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to upload the image. Please check your connection and try again.",
    });
  }
};

  if (!student) return <p>Loading...</p>;

  return (
    <div className="p-1 sm:p-2">
      <div className="h-6 sm:h-10"></div>
  
      {/* Profile Header */}
<div className="mt-4 sm:mt-6 bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
  <div className="relative">
    {student.profile_img ? (
      <img
        src={`/uploads/${student.profile_img}`}
        alt="Profile"
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-blue-500"
      />
    ) : (
      <FaUserCircle className="w-20 h-20 sm:w-24 sm:h-24 text-gray-500" />
    )}

    {/* Camera Icon to Trigger Edit Mode */}
    <button
      onClick={() => setIsEditing(!isEditing)}
      className="absolute bottom-1 right-1 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition"
    >
      <FaCamera />
    </button>
  </div>

  <div>
    <h2 className="text-lg sm:text-xl font-semibold">{student.fullname}</h2>
    <p className="text-gray-600">{`${student.course} - ${student.year_level} Year`}</p>
    <p className="text-gray-500">{student.email}</p>
  </div>
</div>

  
      {/* Change Profile Image Section (Hidden Initially) */}
      {isEditing && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
          <input type="file" accept="image/*" onChange={handleImageChange} className="mb-2 w-full" />
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 w-full sm:w-auto rounded-md hover:bg-blue-600 transition"
          >
            Upload New Profile Picture
          </button>
        </div>
      )}
  
      {/* Student Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-6">
        {[
          { label: "Gender", value: student.gender },
          { label: "Contact", value: student.contact_number || "N/A" },
          { label: "Birthdate", value: new Date(student.birthdate).toLocaleDateString() },
          {
            label: "Status",
            value: student.status,
            style: student.status === "Active" ? "text-green-500" : "text-red-500",
          },
        ].map((item, index) => (
          <div key={index} className="bg-white p-3 sm:p-4 rounded-lg shadow-md text-center">
            <h3 className="text-sm sm:text-lg font-semibold">{item.label}</h3>
            <p className={`text-blue-500 text-base sm:text-2xl font-bold ${item.style || ""}`}>{item.value}</p>
          </div>
        ))}
      </div>
  
      {/* Address */}
      <div className="mt-4 sm:mt-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Address</h3>
        <p className="text-gray-600">{student.address || "No address provided"}</p>
      </div>
  
      {/* Daily Inspiration */}
      <div className="mt-4 sm:mt-6 bg-blue-50 p-4 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold mb-1">Daily Inspiration</h2>
  
        {/* Decorative Line */}
        <div className="w-full h-1 bg-blue-200 mb-4"></div>
  
        {/* Inspirational Quotes */}
        {[
          { quote: "Commit to the Lord whatever you do, and He will establish your plans.", verse: "Proverbs 16:3" },
          { quote: "The fear of the Lord is the beginning of knowledge, but fools despise wisdom and instruction.", verse: "Proverbs 1:7" },
          { quote: "I can do all things through Christ who strengthens me.", verse: "Philippians 4:13" },
          { quote: "Let the wise listen and add to their learning, and let the discerning get guidance.", verse: "Proverbs 1:5" },
          { quote: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.", verse: "Colossians 3:23" },
        ].map((item, index) => (
          <p key={index} className="italic text-gray-600 mb-4 text-sm sm:text-base">
            "{item.quote}"
            <span className="block text-right text-xs sm:text-sm">— {item.verse}</span>
          </p>
        ))}
      </div>
    </div>
  );
}




function Grades({ studentId }) {
  const [subjects, setSubjects] = useState([]);
  const [semester, setSemester] = useState("1st Semester");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const res = await fetch(`/api/students_dashboard/getStudentInfo?studentId=${studentId}`);
        const data = await res.json();
        if (res.ok) {
          setCourse(data.course);
          setYearLevel(data.year_level);
        }
      } catch (error) {
        console.error("Failed to fetch student info:", error);
      }
    };

    fetchStudentInfo();
  }, [studentId]);

  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoading(true);
      try {
        // Fetch all subjects data in parallel
        const [regularRes, irregularRes, droppedRes] = await Promise.all([
          fetch(`/api/students_dashboard/gettingSubjects?studentId=${studentId}&semester=${semester}`),
          fetch(`/api/students_dashboard/getIrregularSubjects?studentId=${studentId}&semester=${semester}`),
          fetch(`/api/students_dashboard/getDroppedSubjects?studentId=${studentId}`)
        ]);

        const regularSubjects = await regularRes.json();
        const irregularSubjects = await irregularRes.json();
        const droppedSubjects = await droppedRes.json();

        // Get list of dropped subject IDs
        const droppedSubjectIds = droppedSubjects.map(sub => sub.subject_id);

        // Process all subjects and mark dropped ones
        const allSubjects = [...regularSubjects, ...irregularSubjects].map((subject) => {
          const isDropped = droppedSubjectIds.includes(subject.subject_id);
          
          if (isDropped) {
            return {
              ...subject,
              midterm: "Dropped",
              final: "Dropped",
              remarks: "Dropped"
            };
          }

          const hasGrades = subject.midterm !== null && subject.final !== null;
          const isPassed = hasGrades && subject.midterm <= 3.0 && subject.final <= 3.0;
          
          return {
            ...subject,
            midterm: subject.midterm ?? "Pending",
            final: subject.final ?? "Pending",
            remarks: hasGrades 
              ? (isPassed ? "Passed" : "Failed")
              : "Pending",
          };
        });

        setSubjects(allSubjects);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (course && yearLevel) {
      fetchSubjects();
    }
  }, [studentId, semester, course, yearLevel]);

  const exportToCSV = () => {
    const csvContent = [
      ["Subject Code", "Subject Name", "Units", "Midterm", "Final", "Remarks"],
      ...subjects.map((subject) => [
        subject.subject_code,
        subject.subject_name,
        subject.units,
        subject.midterm,
        subject.final,
        subject.remarks,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Grades_${semester}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRemarksStyle = (remarks) => {
    switch (remarks) {
      case "Passed": return "text-green-600 font-semibold";
      case "Failed": return "text-red-600 font-semibold";
      case "Dropped": return "text-gray-500 font-semibold italic";
      default: return "text-yellow-600 font-semibold"; // "Pending"
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white mt-10 rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">Your Subjects</h2>
  
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2 sm:gap-4">
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="p-2 w-full sm:w-auto border rounded-lg shadow-sm text-sm"
        >
          {["1st Semester", "2nd Semester", "Summer"].map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>
  
        <button
          onClick={exportToCSV}
          className="bg-blue-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-blue-600 text-sm w-full sm:w-auto"
        >
          Export to CSV
        </button>
      </div>
  
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : subjects.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 shadow-md text-sm">
            <thead>
              <tr className="bg-gray-200 text-xs sm:text-sm">
                <th className="border p-2 sm:p-3">Code</th>
                <th className="border p-2 sm:p-3">Subject Name</th>
                <th className="border p-2 sm:p-3">Units</th>
                <th className="border p-2 sm:p-3">Midterm</th>
                <th className="border p-2 sm:p-3">Final</th>
                <th className="border p-2 sm:p-3">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr 
                  key={subject.subject_id} 
                  className={`text-center text-xs sm:text-sm ${
                    subject.remarks === "Dropped" ? "bg-gray-50" : ""
                  }`}
                >
                  <td className="border p-2 sm:p-3">{subject.subject_code}</td>
                  <td className="border p-2 sm:p-3">{subject.subject_name}</td>
                  <td className="border p-2 sm:p-3">{subject.units}</td>
                  <td className="border p-2 sm:p-3">{subject.midterm}</td>
                  <td className="border p-2 sm:p-3">{subject.final}</td>
                  <td className={`border p-2 sm:p-3 ${getRemarksStyle(subject.remarks)}`}>
                    {subject.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-4">No subjects found for this semester.</p>
      )}
    </div>
  );
}



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
        <AccordionItem index={3} openIndex={openIndex} title="WALA KOY LABOT NIMOO!!" toggleAccordion={toggleAccordion} />
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