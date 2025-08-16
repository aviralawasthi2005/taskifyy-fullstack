import React, { useState } from "react";
import axios from "axios";

const AddTask = ({ onClose, refreshTasks }) => {
  const [values, setValues] = useState({
    title: "",
    description: "",
    priority: "low",
    status: "yetToStart",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const addTask = async (e) => {
    e.preventDefault();
    setError(null);

    if (!values.title.trim()) return setError("Title is required");
    if (!values.description.trim()) return setError("Description is required");

    setIsSubmitting(true);

    try {
      // Normalize status to match backend enum
      let status = values.status.toLowerCase().replace(/\s/g, "");
      if (status === "yettostart") status = "yetToStart";
      else if (status === "inprogress") status = "inprogress";
      else status = "completed";

      const payload = {
        title: values.title.trim(),
        description: values.description.trim(),
        priority: values.priority.toLowerCase(),
        status,
      };

      await axios.post("http://localhost:5000/api/v1/tasks", payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      setValues({
        title: "",
        description: "",
        priority: "low",
        status: "yetToStart",
      });

      if (typeof refreshTasks === "function") {
        await refreshTasks();
      }

      onClose();
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to add task";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded px-4 py-4 w-[90%] max-w-[500px] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-center font-semibold text-xl">Add Task</h1>
        <hr className="mb-4 mt-2" />

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={addTask}>
          <input
            type="text"
            name="title"
            value={values.title}
            placeholder="Task title*"
            className="border px-3 py-2 rounded border-zinc-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
            onChange={handleChange}
            disabled={isSubmitting}
            autoFocus
          />

          <textarea
            name="description"
            value={values.description}
            placeholder="Description*"
            className="border px-3 py-2 rounded border-zinc-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all min-h-[120px]"
            onChange={handleChange}
            disabled={isSubmitting}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                name="priority"
                value={values.priority}
                className="w-full border px-3 py-2 rounded border-zinc-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={values.status}
                className="w-full border px-3 py-2 rounded border-zinc-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="yetToStart">Yet to Start</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-all disabled:opacity-60 flex justify-center items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">↻</span>
                  Adding...
                </>
              ) : (
                "Add Task"
              )}
            </button>
            <button
              type="button"
              className="flex-1 border border-zinc-300 px-4 py-2 rounded hover:bg-zinc-50 transition-all disabled:opacity-60"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
