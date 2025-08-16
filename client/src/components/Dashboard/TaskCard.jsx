import React, { memo } from "react";
import PropTypes from "prop-types";

const PRIORITY_STYLES = {
  high: { text: "text-red-700", bg: "bg-red-50", border: "border-red-100", icon: "🔴" },
  medium: { text: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-100", icon: "🟡" },
  low: { text: "text-green-700", bg: "bg-green-50", border: "border-green-100", icon: "🟢" },
  default: { text: "text-gray-700", bg: "bg-gray-50", border: "border-gray-100", icon: "⚪" },
};

const STATUS_STYLES = {
  yettostart: "bg-blue-50 text-blue-700",
  inprogress: "bg-purple-50 text-purple-700",
  completed: "bg-emerald-50 text-emerald-700",
  default: "bg-gray-50 text-gray-700",
};

const STATUS_LABELS = {
  yettostart: "Yet to Start",
  inprogress: "In Progress",
  completed: "Completed",
};

const formatDate = (dateStr) => (dateStr ? new Date(dateStr).toLocaleDateString() : null);

const TaskCard = memo(({ data, onClick, onEdit, onDelete, className = "" }) => {
  if (!data) return null;

  const { _id, id, title = "Untitled Task", description = "", priority = "low", status = "not-set", createdAt, updatedAt } = data;
  const taskId = _id || id;

  const normalizedPriority = priority.toLowerCase();
  const normalizedStatus = status.toLowerCase().replace(/\s/g, "");

  const priorityConfig = PRIORITY_STYLES[normalizedPriority] || PRIORITY_STYLES.default;
  const statusClass = STATUS_STYLES[normalizedStatus] || STATUS_STYLES.default;
  const formattedStatus = STATUS_LABELS[normalizedStatus] || status;
  const formattedPriority = priority.charAt(0).toUpperCase() + priority.slice(1);

  const formattedDates = [
    createdAt && `Created: ${formatDate(createdAt)}`,
    updatedAt && updatedAt !== createdAt && `Updated: ${formatDate(updatedAt)}`
  ].filter(Boolean);

  return (
    <div
      className={`bg-white rounded-lg p-4 w-full shadow-sm hover:shadow-md transition-all duration-200 border border-zinc-100 mb-3 cursor-pointer ${className}`}
      onClick={(e) => { e.stopPropagation(); onClick?.(data); }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-zinc-800 truncate" title={title}>{title}</h2>
          {description && <p className="text-sm text-zinc-600 line-clamp-3 mt-1" title={description}>{description}</p>}
        </div>

        <div className={`text-xs px-2.5 py-1 rounded-full border ${priorityConfig.bg} ${priorityConfig.border} ${priorityConfig.text}`}>
          <span className="mr-1">{priorityConfig.icon}</span>{formattedPriority}
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2">
        <span className={`inline-block text-xs px-2 py-1 rounded ${statusClass}`}>Status: {formattedStatus}</span>
        <div className="flex gap-2">
          {onEdit && <button onClick={(e) => { e.stopPropagation(); onEdit(data); }} className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50">Edit</button>}
          {onDelete && <button onClick={(e) => { e.stopPropagation(); if(window.confirm("Delete task?")) onDelete(data); }} className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50">Delete</button>}
        </div>
        {formattedDates.length > 0 && <div className="text-xs text-zinc-400 w-full mt-1">{formattedDates.join(" • ")}</div>}
      </div>
    </div>
  );
});

TaskCard.propTypes = {
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  className: PropTypes.string,
};

export default TaskCard;
