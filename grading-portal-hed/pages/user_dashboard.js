import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FiUser, FiBook, FiBell, FiSettings, FiLogOut, FiMenu, FiHome } from "react-icons/fi";
import "@fontsource/poppins";

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
    localStorage.removeItem("user");
    router.push("/");
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
          <SidebarItem icon={FiUser} label="Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={FiBook} label="Grades" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={FiBell} label="Schedule" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
          <SidebarItem icon={FiSettings} label="Help" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />

          {/* Back to Home Button */}
          <li
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition cursor-pointer mt-6"
            onClick={() => router.push("/")}
          >
            <FiHome size={28} />
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
          <img src="/images/naz.jpg" alt="User" className="w-10 h-10 rounded-full border" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg p-2">
            <button onClick={() => setActiveTab("Profile")} className="w-full text-left px-4 py-2 hover:bg-gray-200 rounded-md flex items-center gap-2">
              <FiUser /> Profile
            </button>
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
    {activeTab === "Dashboard" && <Profile />}
    {activeTab === "Grades" && user && <Grades studentId={user.id} />}
    {activeTab === "Schedule" && <Schedule />}
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
function Profile() {
  return (
    <div className="p-6">
      {/* Profile Header */}
      <div className="bg-blue-100 p-4 rounded-lg shadow-md flex items-center gap-4">
        <img
          src="/images/naz.jpg" // Replace with actual profile image source
          alt="Profile"
          className="w-24 h-24 rounded-full border-2 border-blue-500"
        />
        <div>
          <h2 className="text-xl font-semibold">Tactless God of Dota2</h2>
          <p className="text-gray-600">Bachelor of Science in IT - 3rd Year</p>
          <p className="text-gray-500">naz@email.com</p>
        </div>
      </div>

      {/* Student Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">GPA</h3>
          <p className="text-blue-500 text-2xl font-bold">3.8</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Completed Subjects</h3>
          <p className="text-blue-500 text-2xl font-bold">32</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Ongoing Subjects</h3>
          <p className="text-blue-500 text-2xl font-bold">5</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Attendance</h3>
          <p className="text-blue-500 text-2xl font-bold">98%</p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Recent Activities</h3>
        <ul className="space-y-2 text-gray-600">
          <li>✔️ Submitted assignment for "Web Development" on Feb 12</li>
          <li>📅 Attended "Database Management" lecture on Feb 14</li>
          <li>📝 Scored 92% in "Software Engineering" midterm exam</li>
          <li>🔔 Reminder: Final project submission due on March 1</li>
        </ul>
      </div>
    </div>
  );
}


function Grades({ studentId }) {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState("1st Sem");

  // Fetch grades when studentId or selectedSemester changes
  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/getGrades?studentId=${studentId}&semester=${selectedSemester}`
        );
        if (!response.ok) throw new Error("Failed to fetch grades");

        const data = await response.json();

        const updatedGrades = data.grades.map((grade) => ({
          ...grade,
          remarks:
            grade.final_grade === null || grade.final_grade > 3.0
              ? "Failed"
              : "Passed",
        }));

        setGrades(updatedGrades);
      } catch (err) {
        console.error("Error fetching grades:", err);
        setError("Failed to load grades.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [studentId, selectedSemester]);

  // Export grades to CSV file
  const handleExport = () => {
    const csvRows = [
      ["Subject Code", "Descriptive Title", "Units", "Midterm", "Final", "Remarks"],
      ...grades.map((grade) => [
        grade.subject_code,
        grade.subject_description,
        grade.units,
        grade.midterm_grade || "N/A",
        grade.final_grade || "N/A",
        grade.remarks,
      ]),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((row) => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Grades_${selectedSemester}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p className="text-gray-500">Loading grades...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg mt-8">
      {/* Header and Semester Dropdown */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Grades - {selectedSemester}</h2>
        <div className="flex gap-3">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="1st Sem">1st Sem</option>
            <option value="2nd Sem">2nd Sem</option>
            <option value="Summer">Summer</option>
          </select>
          <button
            onClick={handleExport}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Grades Table */}
      {grades.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-sky-800 text-white">
            <tr>
              <th className="border p-2">Code</th>
              <th className="border p-2">Descriptive</th>
              <th className="border p-2">Units</th>
              <th className="border p-2">Midterm</th>
              <th className="border p-2">Final</th>
              <th className="border p-2">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade.id} className="hover:bg-sky-200 transition">
                <td className="border p-2">{grade.subject_code}</td>
                <td className="border p-2">{grade.subject_description}</td>
                <td className="border p-2">{grade.units}</td>
                <td className="border p-2">{grade.midterm_grade || "N/A"}</td>
                <td className="border p-2">{grade.final_grade || "N/A"}</td>
                <td
                  className={`border p-2 font-semibold ${
                    grade.remarks === "Passed" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {grade.remarks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No grades recorded for this semester.</p>
      )}
    </div>
  );
}



function Schedule() {
  return <div>Announcements Content</div>;
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