import "@fontsource/poppins"; // Default weight (400)

export default function LoginForm() {
    return (
      <div className="font-poppins relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('images/loginbg.png')" }}>
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
  
        {/* Form container */}
        <div className="relative z-10 flex justify-center items-center h-full">
          <div className="bg-black bg-opacity-50 text-white p-8 rounded-lg shadow-lg w-96">
            <div className="text-center">
              <img src="/images/logo2.png" alt="HED Grading Portal Logo" className="mx-auto h-20 mb-4" />
              <h1 className="text-2xl font-bold mb-4">HED GRADING PORTAL</h1>
              <p className="text-sm mb-8">ST. RITA'S COLLEGE OF BALINGASAG</p>
            </div>
            <form>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Remember me
                </label>
                <a href="#" className="text-blue-500 hover:underline text-sm">Forgot Password?</a>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold transition duration-300"
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  