import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/login", 
        values,
        { withCredentials: true } // to send cookies
      );

      
      localStorage.setItem("userloggedIn", "yes"); 

      navigate("/dashboard"); 

    } catch (error) {
      console.error("Login error:", error);
      alert(
        error.response?.data?.error || 
        error.message || 
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-[90vw] sm:w-[70vw] md:w-[50vw] lg:w-[30vw] p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-yellow-800">
          Taskifyy
        </h1>
        <h3 className="text-center font-semibold text-gray-700 mb-6">
          Login to your account
        </h3>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="border rounded px-4 py-2 border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-yellow-600"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="border rounded px-4 py-2 border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-yellow-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`bg-yellow-700 text-white font-semibold py-2 rounded hover:bg-yellow-600 transition duration-300 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link 
              to="/register" 
              className="text-yellow-700 hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
