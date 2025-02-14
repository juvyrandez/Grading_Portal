import { useState } from "react";
import "@fontsource/poppins";

export default function SignupForm() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullname, email, username, password }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setFullname("");
      setEmail("");
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="font-poppins relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('images/loginbg.png')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 flex justify-center items-center h-full">
        <div className="bg-black bg-opacity-50 text-white p-8 rounded-lg shadow-lg w-96">
          <div className="text-center">
            <img src="/images/logo2.png" alt="HED Grading Portal Logo" className="mx-auto h-20 mb-4" />
            <h1 className="text-2xl font-bold mb-4">HED GRADING PORTAL</h1>
            <p className="text-sm mb-8">ST. RITA'S COLLEGE OF BALINGASAG</p>
          </div>
          {message && <p className="text-center text-green-400">{message}</p>}
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label htmlFor="fullname" className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                id="fullname"
                placeholder="Enter your full name"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold transition duration-300">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
