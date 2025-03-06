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
          <SidebarItem icon={FiBell} label="Announcements" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
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

        <div className="font-poppins">
          {activeTab === "Dashboard" && <Profile />}
          {activeTab === "Grades" && <Grades />}
          {activeTab === "Announcements" && <Announcements />}
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



function Grades() {
  const tempData = [
    { id: 1, code: "GEE AH", description: "Understanding the Self", units: 3, midterm: 1.75, final: 2.00, remarks: "Passed" },
    { id: 2, code: "GEE SC", description: "Science, Technology & Society", units: 3, midterm: 2.00, final: 2.25, remarks: "Passed" },
    { id: 3, code: "GEE MA", description: "Mathematics in the Modern World", units: 3, midterm: 1.50, final: 1.75, remarks: "Passed" },
    { id: 4, code: "GEE EN", description: "English for Academic Purposes", units: 3, midterm: 2.25, final: 2.50, remarks: "Passed" },
    { id: 5, code: "GEE HI", description: "Readings in Philippine History", units: 3, midterm: 1.75, final: 2.00, remarks: "Passed" },
    { id: 6, code: "GEE IT", description: "Introduction to Computing", units: 3, midterm: 2.00, final: 2.25, remarks: "Passed" },
    { id: 7, code: "GEE PE", description: "Physical Education 1", units: 2, midterm: "A", final: "A", remarks: "Passed" },
  ];

  return (
    <div className="p-6">
      {/* Header with Buttons */}
      <div className="bg-blue-100 p-4 flex justify-between items-center flex-wrap rounded-lg shadow-md">
        <h2 className="text-lg md:text-xl">REPORT OF GRADES</h2>
        <div className="flex gap-4 text-sm md:text-base">
          <span className="text-gray-700 cursor-pointer hover:underline">View Prospectus</span>
          <div className="relative">
            <select className="bg-white border border-gray-300 p-2 rounded-md text-gray-700 cursor-pointer">
              <option>2024-2025 2nd Semester</option>
              <option>2024-2025 1st Semester</option>
              <option>2023-2024 2nd Semester</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-5">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-200">
              <th className="border border-gray-400 px-4 py-2">#</th>
              <th className="border border-gray-400 px-4 py-2">Code</th>
              <th className="border border-gray-400 px-4 py-2">Descriptive</th>
              <th className="border border-gray-400 px-4 py-2">Units</th>
              <th className="border border-gray-400 px-4 py-2">Midterm</th>
              <th className="border border-gray-400 px-4 py-2">Final</th>
              <th className="border border-gray-400 px-4 py-2">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {tempData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="border border-gray-400 px-4 py-2">{row.id}</td>
                <td className="border border-gray-400 px-4 py-2">{row.code}</td>
                <td className="border border-gray-400 px-4 py-2">{row.description}</td>
                <td className="border border-gray-400 px-4 py-2">{row.units}</td>
                <td className="border border-gray-400 px-4 py-2">{row.midterm}</td>
                <td className="border border-gray-400 px-4 py-2">{row.final}</td>
                <td className="border border-gray-400 px-4 py-2">{row.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function Announcements() {
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