import React, { memo } from "react";
import PropTypes from "prop-types";
import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

// Utility function to normalize status
const normalizeStatus = (status) => status?.toLowerCase().replace(/\s+/g, "") || "";

const Completed = memo(({ tasks, onEdit, onDelete }) => {
  const filteredTasks = (tasks || []).filter((task) => normalizeStatus(task.status) === "completed");

  return (
    <Droppable droppableId="completed">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex flex-col gap-3 p-2 rounded-md ${
            snapshot.isDraggingOver ? "bg-emerald-50" : ""
          }`}
        >
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <TaskCard
                key={task._id || task.id}
                data={task}
                onEdit={onEdit}
                onDelete={onDelete}
                className="mb-2"
              />
            ))
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-zinc-400 italic">
                No tasks in "Completed" category
              </p>
            </div>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
});

Completed.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string,
      description: PropTypes.string,
      status: PropTypes.string,
      priority: PropTypes.string,
    })
  ),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

Completed.defaultProps = {
  tasks: [],
  onEdit: () => {},
  onDelete: () => {},
};

export default Completed;
