import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Header from "../components/Dashboard/Header";
import AddTask from "../components/Dashboard/AddTask";
import EditTask from "../components/Dashboard/EditTask";
import LoadingSpinner from "../components/Common/LoadingSpinner";

const TASK_STATUS = {
  YET_TO_START: "yetToStart",
  IN_PROGRESS: "inprogress",
  COMPLETED: "completed",
};

// Priority styles
const PRIORITY_STYLES = {
  high: {
    text: "text-red-700",
    bg: "bg-red-100",
    border: "border-red-300",
    label: "High 🔴",
  },
  medium: {
    text: "text-yellow-700",
    bg: "bg-yellow-100",
    border: "border-yellow-300",
    label: "Medium 🟡",
  },
  low: {
    text: "text-green-700",
    bg: "bg-green-100",
    border: "border-green-300",
    label: "Low 🟢",
  },
};

// TaskCard component
const TaskCard = ({ task, onEdit, onDelete }) => {
  const priorityKey = (task.priority || "low").trim().toLowerCase();
  const priorityStyle = PRIORITY_STYLES[priorityKey] || PRIORITY_STYLES.low;

  return (
    <div
      className={`p-4 rounded shadow border ${priorityStyle.bg} ${priorityStyle.border}`}
    >
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-700">{task.description}</p>

      {/* Priority Badge */}
      <span
        className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded ${priorityStyle.text}`}
      >
        {priorityStyle.label}
      </span>

      <div className="flex gap-2 mt-3">
        <button
          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>
        <button
          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => onDelete(task)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:5000/api/v1/tasks", {
        withCredentials: true,
      });

      const normalizedTasks = (res.data.tasks || []).map((task) => ({
        _id: task._id || task.id || Math.random().toString(36).substr(2, 9),
        title: task.title || "Untitled Task",
        description: task.description || "",
        priority: (task.priority || "low").toLowerCase(),
        status:
          task.status === "yetToStart" || task.status === "yettostart"
            ? TASK_STATUS.YET_TO_START
            : task.status === "inprogress"
            ? TASK_STATUS.IN_PROGRESS
            : TASK_STATUS.COMPLETED,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        user: task.user || null, // Include user for validation
      }));

      setTasks(normalizedTasks);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to load tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const getFilteredTasks = (status) =>
    tasks.filter((task) => task.status === status);

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setShowEditTask(true);
  };

  const handleDeleteTask = async (task) => {
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`))
      return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/tasks/${task._id}`, {
        withCredentials: true,
      });
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert("Failed to delete task. Please try again.");
    }
  };

  const isRecentlyUpdated = (updatedAt) => {
    if (!updatedAt) return false;
    return Date.now() - new Date(updatedAt).getTime() <
      24 * 60 * 60 * 1000;
  };

  // Drag & drop handler
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const task = tasks.find((t) => t._id === draggableId);
    const newStatus = destination.droppableId;

    try {
      // Send all required fields to satisfy backend validation
      await axios.put(
        `http://localhost:5000/api/v1/tasks/${task._id}`,
        {
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: newStatus,
          user: task.user,
        },
        { withCredentials: true }
      );
      fetchTasks();
    } catch (err) {
      console.error("Failed to update task status:", err);
      alert(
        err.response?.data?.message ||
          "Failed to move task. Please try again."
      );
    }
  };

  // Render each column
  const renderColumn = (title, status) => (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-lg">
        {title} ({getFilteredTasks(status).length})
      </h2>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-3 p-2 rounded-md ${
              snapshot.isDraggingOver ? "bg-zinc-100" : ""
            }`}
          >
            {getFilteredTasks(status).map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard
                      task={{
                        ...task,
                        highlight: isRecentlyUpdated(task.updatedAt),
                      }}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteTask}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );

  return (
    <div className="w-full relative">
      <Header setAddTaskDiv={() => setShowAddTask(true)} />

      {loading ? (
        <div className="py-4 flex justify-center items-center bg-zinc-100 min-h-[89vh]">
          <LoadingSpinner text="Loading tasks..." />
        </div>
      ) : error ? (
        <div className="py-4 flex flex-col justify-center items-center bg-zinc-100 min-h-[89vh]">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchTasks}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-100 min-h-[89vh] px-4">
            {renderColumn("Yet To Start", TASK_STATUS.YET_TO_START)}
            {renderColumn("In Progress", TASK_STATUS.IN_PROGRESS)}
            {renderColumn("Completed", TASK_STATUS.COMPLETED)}
          </div>
        </DragDropContext>
      )}

      {showAddTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-zinc-800 opacity-80"
            onClick={() => setShowAddTask(false)}
          />
          <AddTask
            onClose={() => setShowAddTask(false)}
            refreshTasks={fetchTasks}
          />
        </div>
      )}

      {showEditTask && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-zinc-800 opacity-80"
            onClick={() => setShowEditTask(false)}
          />
          <EditTask
            task={selectedTask}
            onClose={() => setShowEditTask(false)}
            refreshTasks={fetchTasks}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
