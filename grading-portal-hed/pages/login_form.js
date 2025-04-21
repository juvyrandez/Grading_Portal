import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("rememberedUsername");
    if (storedUsername) {
      setUsername(storedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const res = await fetch("/api/login/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  
    const data = await res.json();
    setMessage(data.message);
  
    if (res.ok) {
      let userMessage = "";
      
      switch (data.user.user_type) {
        case "admin":
          userMessage = "Welcome to the Admin Dashboard!";
          break;
        case "programhead":
          userMessage = "Welcome to the Program Head Panel!";
          break;
        default:
          userMessage = "Welcome to your Student Dashboard!";
      }
  
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: userMessage,
        showConfirmButton: false,
        timer: 2000,
      });
  
      localStorage.setItem("user", JSON.stringify(data.user));
  
      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
      } else {
        localStorage.removeItem("rememberedUsername");
      }
  
      // Redirect based on user_type
      switch (data.user.user_type) {
        case "admin":
          router.push("/admin_dashboard");
          break;
        case "programhead":
          router.push("/program_head");
          break;
        default:
          router.push("/user_dashboard");
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: data.message || "Invalid username or password",
      });
    }
  };

  return (
    <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('images/loginbg.png')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 flex justify-center items-center h-full">
        <div className="bg-black bg-opacity-50 text-white p-8 rounded-lg shadow-lg w-96">
          <div className="text-center">
            <img src="/images/logo2.png" alt="HED Grading Portal Logo" className="mx-auto h-20 mb-4" />
            <h1 className="text-2xl font-bold mb-4">HED GRADING PORTAL</h1>
          </div>
          {message && <p className="text-center text-red-400">{message}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
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
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="rememberMe" className="text-sm">Remember Me</label>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold">
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
