import React, { useState, useEffect } from "react";
import axios from "axios";

const STATUS_OPTIONS = [
  { label: "Yet to Start", value: "yetToStart" },
  { label: "In Progress", value: "inprogress" },
  { label: "Completed", value: "completed" },
];

const PRIORITY_OPTIONS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const EditTask = ({ task, onClose, refreshTasks }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "low",
    status: "yetToStart",
  });

  // Initialize form with selected task
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "low",
        status: task.status || "yetToStart",
      });
    }
  }, [task]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit updated task
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send only changed fields
      const updatedData = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== task[key]) {
          updatedData[key] = formData[key];
        }
      });

      // If no changes, just close modal
      if (Object.keys(updatedData).length === 0) {
        onClose();
        return;
      }

      const res = await axios.put(
        `http://localhost:5000/api/v1/tasks/${task._id}`,
        updatedData,
        { withCredentials: true }
      );

      if (res.status === 200) {
        refreshTasks();
        onClose();
      }
    } catch (err) {
      console.error("Error updating task:", err.response?.data || err.message);
      alert("Failed to update task. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Task Title"
            className="border p-2 rounded"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Task Description"
            className="border p-2 rounded"
          />
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;
