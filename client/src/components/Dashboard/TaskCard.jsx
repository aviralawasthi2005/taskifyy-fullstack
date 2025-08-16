import React, { memo } from "react";
import PropTypes from "prop-types";

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

const TaskCard = memo(({ data, onEdit, onDelete }) => {
  if (!data) return null;

  const { title, description, priority } = data;

  // Normalize priority (case-insensitive + fallback)
  const normalizedPriority = priority?.toLowerCase?.() || "low";
  const priorityStyle = PRIORITY_STYLES[normalizedPriority] || PRIORITY_STYLES.low;

  return (
    <div
      className={`p-4 mb-4 rounded-lg shadow-md border ${priorityStyle.bg} ${priorityStyle.border}`}
    >
      {/* Title */}
      <h3 className="text-lg font-bold mb-1">{title}</h3>

      {/* Description */}
      <p className="text-gray-700 mb-2">{description}</p>

      {/* Priority Badge */}
      <span
        className={`inline-block px-2 py-1 text-xs font-semibold rounded ${priorityStyle.text}`}
      >
        {priorityStyle.label}
      </span>

      {/* Actions */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onEdit(data)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(data)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
});

TaskCard.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    priority: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

TaskCard.defaultProps = {
  onEdit: () => {},
  onDelete: () => {},
};

export default TaskCard;
