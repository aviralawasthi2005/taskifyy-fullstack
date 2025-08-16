import axios from "axios";
import React from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Header = ({ setAddTaskDiv }) => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/logout",
        {},
        { withCredentials: true }
      );
      alert(res.data.message || "Logged out successfully");
      localStorage.removeItem("userLoggedIn");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Error logging out. Redirecting to login.");
      navigate("/login");
    }
  };

  return (
    <div className="flex px-12 py-4 items-center justify-between border-b">
      <div>
        <h1 className="text-2xl text-yellow-800 font-semibold">Taskifyy</h1>
      </div>
      <div className="flex gap-8 items-center">
        <button
          className="hover:text-orange-800 transition-all duration-300"
          onClick={() => setAddTaskDiv("block")}
        >
          Add Task
        </button>
        <button
          className="text-2xl hover:text-red-600 transition-all duration-300"
          onClick={logout}
        >
          <IoLogOutOutline />
        </button>
      </div>
    </div>
  );
};

export default Header; 