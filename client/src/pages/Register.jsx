import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate(); 

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const register = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/v1/register", values);

      alert(res.data.success); 
    

      navigate("/login"); 
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="w-[60vw] md:w-[50vw] lg:w-[30vw]">
        <h1 className="text-3xl font-bold text-center mb-1 text-yellow-800">
          Taskifyy
        </h1>
        <h3 className="text-center font-semibold text-zinc-900">
          Register with Taskifyy
        </h3>
      </div>

      <div className="w-[60vw] md:w-[50vw] lg:w-[30vw] mt-4">
        <form className="flex flex-col gap-4" onSubmit={register}>
          <input
            type="text"
            name="username"
            required
            placeholder="Username"
            className="border rounded px-4 py-1 border-zinc-400 w-full outline-none"
            value={values.username}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="border rounded px-4 py-1 border-zinc-400 w-full outline-none"
            value={values.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            className="border rounded px-4 py-1 border-zinc-400 w-full outline-none"
            value={values.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="bg-yellow-800 text-white font-semibold py-2 rounded hover:bg-yellow-700 transition duration-300"
          >
            Register
          </button>

          <p className="text-center font-semibold text-gray-900">
            Already have an account?{" "}
            <Link to="/login" className="text-yellow-800 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
