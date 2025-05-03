"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FiUser } from "react-icons/fi";
import ScrollToTop from "../components/ScrollToTop";
import "@fontsource/poppins";
import { FaUserCircle } from "react-icons/fa";
import { FaUser } from 'react-icons/fa';


export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  

  return (
    <div>
      {/* Header */}
      <header className="font-poppins bg-white text-sky-800 fixed top-0 left-0 w-full shadow-md z-50">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          {/* Logo */}
          <div>
            <img
              src="/images/about_logo.png"
              className="h-16 mb:h-16 w-55"
              alt="Logo"
            />
          </div>

          {/* Desktop Navbar */}
          <nav className="font-poppins hidden md:flex space-x-10">
            <a href="#home" className="hover:underline">HOME</a>
            <a href="#about" className="hover:underline">ABOUT US</a>
            <a href="#services" className="hover:underline">SERVICES</a>
            <a href="#contact" className="hover:underline">CONTACT US</a>
          </nav>

          {/* Login/Profile Section */}
          <div className="hidden md:flex items-center relative">
            {user ? (
              // Show Profile Dropdown if logged in
              <div className="relative">
                <button className="flex items-center gap-3" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <span className="font-semibold">{user.username}</span>
                  <FaUserCircle className="w-10 h-10 text-gray-500" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg p-2">
                    <button
                      onClick={() => router.push(user.user_type === "admin" ? "/admin_dashboard" : "/user_dashboard")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-200 rounded-md flex items-center gap-2"
                    >
                      <FiUser /> Profile
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Show Login/Signup if not logged in
              <>
  <Link href="/login_form" className="hover:underline flex items-center gap-1">
    <FaUser className="text-sm" />
    Log In
  </Link>
</>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-3xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
                                                                                                                         
        {/* Mobile Navbar */}
        {menuOpen && (
          <nav className="font-poppins md:hidden bg-white shadow-md p-4 text-center">
            <a href="#home" className="block py-2 hover:underline">HOME</a>
            <a href="#about" className="block py-2 hover:underline">ABOUT US</a>
            <a href="#services" className="block py-2 hover:underline">SERVICES</a>
            <a href="#contact" className="block py-2 hover:underline">CONTACT US</a>

            <div className="mt-4">
              {user ? (
                <button
                  onClick={() => router.push(user.user_type === "admin" ? "/admin_dashboard" : "/user_dashboard")}
                  className="w-full py-2 hover:underline"
                >
                  Profile
                </button>
              ) : (
                <>
                  <Link href="/login_form" className="block py-2 hover:underline">
                    Log In
                  </Link>
                  <Link href="/signup_form" className="block py-2 hover:underline">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </header>


      {/* Hero Section */}
<section
  id="home"
  className="bg-cover bg-center h-screen text-white flex items-center justify-center px-6 sm:items-start sm:justify-start sm:pl-40 sm:pt-48 relative mt-20"
  style={{ backgroundImage: "url('/images/mainbg.jpg')" }}
>
  {/* Left Arrow */}
  <button className="hidden sm:block absolute left-4 sm:left-16 top-1/2 transform -translate-y-1/2 text-white text-4xl sm:text-5xl">
    &#10094;
  </button>

  <div className="font-poppins w-full max-w-5xl text-center sm:text-left">
    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
      Welcome to the St. Rita’s College of Balingasag Higher Education Grading Portal
    </h1>
    <p className="text-base sm:text-xl md:text-2xl mb-6 sm:mb-8">
      The official grading portal for St. Rita’s College of Balingasag. This platform allows students to easily view their grades, track academic progress, and stay updated on course performance. Faculty can also upload and manage grades efficiently. We’re here to support your academic journey every step of the way.
    </p>
    <a href="#services">
  <button className="font-poppins bg-sky-900 hover:bg-blue-800 px-6 sm:px-8 py-3 sm:py-4 text-lg sm:text-xl rounded-md border border-white">
    Get Started
  </button>
</a>
</div>

  {/* Right Arrow */}
  <button className="hidden sm:block absolute right-4 sm:right-16 top-1/2 transform -translate-y-1/2 text-white text-4xl sm:text-5xl">
    &#10095;
  </button>
</section>




      {/* About Section */}
<section
  id="about"
  className="font-poppins py-40 text-white" // Increased padding to make the background taller
  style={{
    backgroundImage: "url('/images/about.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <div className="container mx-auto text-center">
    <h2 className="text-3xl font-bold mb-8">ABOUT US</h2>
    
    {/* Image */}
    <div className="md:w-1/3 mx-auto mb-6">
      <img src="/images/about_logo2.png" alt="HED Grading Portal Logo" className="w-75 h-40 mx-auto" />
    </div>

    {/* Text Content */}
    <div className="md:w-2/3 mx-auto px-6">
      <p className="text-lg">
        The Higher Education Grading Portal at St. Rita’s College of Balingasag is designed to enhance the academic experience for students. 
        As part of our commitment to academic excellence and transparency, this portal allows students to access their grades and monitor 
        their progress in real time. With easy-to-use features and instant updates, the portal ensures that students can manage their academic 
        performance efficiently, supporting their success at every step.
      </p>
    </div>
  </div>
</section>


      {/* Our Services Section */}
<section
  id="services"
  className="font-poppins py-10 text-center text-white"
  style={{
    backgroundImage: "url('/images/dd.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  <h2 className="text-3xl font-bold mb-8 text-white">OUR SERVICES</h2> {/* Ensure Title is White */}
  
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-10">
    {[
      { title: "Grade Tracking", icon: "📊" },
      { title: "Faculty Uploads", icon: "📤" },
      { title: "Academic Progress", icon: "🎓" },
      { title: "Course Management", icon: "📝" }
    ].map((service, index) => (
      <div 
        key={index} 
        className="bg-white p-6 rounded-md shadow-md h-96 flex flex-col justify-center border-b-4 border-sky-600"
      >
        {/* Icon */}
        <div className="flex justify-center text-4xl text-blue-500">{service.icon}</div>

        {/* Title (Centered Below Icon) */}
        <h3 className="text-2xl font-semibold my-4 text-black">{service.title}</h3> {/* Set Title to Black Inside Box */}

        {/* Description */}
        <p className="text-lg text-gray-700">
          {service.title === "Grade Tracking" ? "Easily track and view your grades throughout the semester with real-time updates." :
            service.title === "Faculty Uploads" ? "Faculty members can efficiently upload and manage grades for all courses." :
              service.title === "Academic Progress" ? "Track your academic progress and ensure you meet graduation requirements." :
                "Easily manage and enroll in courses with streamlined course selection."}
        </p>
      </div>
    ))}
  </div>
</section>



{/* Contact US Service */}
<section
  id="contact"
  className="font-poppins py-20 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: `url('/images/contact.jpg')`, // Replace with your image path
  }}
>
  <div className="container mx-auto flex flex-col md:flex-row items-start px-6">
    {/* Contact Details */}
    <div
      className="md:w-1/2 text-left pr-6"
      style={{
        marginLeft: '20px', // Adjust this value as needed
      }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center md:text-left text-black">CONTACT US</h2>
      <p className="text-lg mb-4 text-black">We'd love to hear from you</p>
      <p className="mb-2 text-black">
        <strong>Address:</strong> Tres Martires St., Barangay 3, Balingasag, Misamis Oriental
      </p>
      <p className="mb-2 text-black">
        <strong>Email Address:</strong> ritarian@srcb.edu.ph
      </p>
      
      <p className="mb-2 text-black"><strong>Offices:</strong></p>
      <ul className="mb-4 list-disc list-inside text-black">
        <li>Registrar's Office: srcbregistrar@srcb.edu.ph</li>
        <li>Human Resources Office: hroffice@srcb.edu.ph</li>
      </ul>

      <p className="mb-2 text-black">
        <strong>Telephone Number:</strong> (088) 323-7159
      </p>
      
      <p className="mb-2 text-black"><strong>Mobile Numbers:</strong></p>
      <ul className="mb-4 list-disc list-inside text-black">
        <li>0929-734-0012 / 0953-260-20904</li>
        <li>Finance Office: 0975-637-9948</li>
        <li>Registrar's Office: 0926-495-184</li>
      </ul>
      
      <p className="mb-2 text-black">
        <strong>Facebook Page:</strong> 
        <a
          href="https://www.facebook.com/srcbofficial"
          className="text-blue-700 underline"
        >
          https://www.facebook.com/srcbofficial
        </a>
      </p>
    </div>

    {/*CONTACT US*/}
    <div className="font-poppins md:w-1/2 bg-gray-200/80 p-6 rounded-md shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-center text-black">Get in touch with us</h3>
      <form>
        <input
          type="text"
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
          placeholder="Full Name"
        />
        <input
          type="email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
          placeholder="Email Address"
        />
        <input
          type="text"
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
          placeholder="Phone Number"
        />
        <textarea
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
          placeholder="Message"
          rows="4"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-sky-700 hover:bg-blue-800 text-white px-6 py-3 rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
</section>




{/*FOOTER*/}

<footer className="font-poppins bg-gradient-to-b from-sky-700 to-blue-950 text-white py-10">
  <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
    {/* Left Section: Logo and Tagline */}
    <div className="flex flex-col items-center md:items-start">
      <img src="/images/logo2.png" alt="Logo" className="mb-4 h-25 w-15" />
      <p className="text-center md:text-left font-medium">
        Nurturing Faith, Passion for Excellence & Commitment for Humble Service.
      </p>
      <div className="flex justify-center md:justify-start mt-4 space-x-4">
        <a href="#">
          <img src="/images/facebook.png" alt="Facebook" className="w-6" />
        </a>
        <a href="#">
          <img src="/images/twitter.png" alt="Twitter" className="w-6" />
        </a>
        <a href="#">
          <img src="/images/instagram.png" alt="Instagram" className="w-6" />
        </a>
        <a href="#">
          <img src="/images/youtube.png" alt="YouTube" className="w-6" />
        </a>
      </div>
    </div>


    {/* Center Section: Useful Links */}
    <div className="flex flex-col items-center md:items-start">
      <h3 className="font-bold text-lg mb-4">Useful Links</h3>
      <ul className="space-y-2">
        <li>
          <a href="#" className="hover:underline">
            About Us
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            Hedgradingportal
          </a>
        </li>
      </ul>
      <p className="mt-4 text-sm">
        Reg. Number: 105-87-73167
        <br />
        Tel: +82-2-323-6850
        <br />
        Address: 2001, Geumcheon-gu, Seoul
      </p>
    </div>

    {/* Right Section: Contact Details */}
    <div className="flex flex-col items-center md:items-start">
      <h3 className="font-bold text-lg mb-4">Contact Us</h3>
      <p className="text-sm">
        <strong>Mobile Phone:</strong>
        <br />
        0929-734-0012 (SMART)
        <br />
        0953-260-2090 (TM)
      </p>
      <p className="text-sm mt-4">
        <strong>Telephone:</strong>
        <br />
        (088) 323-7159
      </p>
      <p className="text-sm mt-4">
        <strong>Email Address:</strong>
        <br />
        ritarian@srcb.edu.ph
      </p>
      <p className="text-sm mt-4">
        <strong>Address:</strong>
        <br />
        St. Rita’s College of Balingasag
        <br />
        Balingasag, Misamis Oriental
        <br />
        9005 Philippines
      </p>
    </div>
  </div>
  <div className="border-t border-blue-950 mt-10 pt-2">
    <p className="text-center text-sm">
      © 2025 HED GRADING PORTAL. ALL RIGHTS RESERVED
    </p>
  </div>
</footer>

    

    {/* Scroll-to-Top Button */}
    <ScrollToTop />
    </div>
  );
}
