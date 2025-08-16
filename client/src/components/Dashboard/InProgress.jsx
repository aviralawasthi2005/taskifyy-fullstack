import React, { memo } from "react";
import PropTypes from "prop-types";
import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

// Utility function to normalize status strings
const normalizeStatus = (status) => status?.toLowerCase().replace(/\s+/g, "") || "";

const InProgress = memo(({ tasks, onEdit, onDelete }) => {
  const filteredTasks = tasks?.filter((task) => normalizeStatus(task.status) === "inprogress") || [];

  return (
    <Droppable droppableId="inprogress">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex flex-col gap-3 p-2 rounded-md ${
            snapshot.isDraggingOver ? "bg-purple-50" : ""
          }`}
        >
          {filteredTasks.length > 0 ? (
            filteredTasks.map((item, index) => (
              <TaskCard
                key={item._id || item.id}
                data={item}
                onEdit={onEdit}
                onDelete={onDelete}
                className="mb-2"
              />
            ))
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-zinc-400 italic">
                No tasks in "In Progress" category
              </p>
            </div>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
});

InProgress.propTypes = {
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

InProgress.defaultProps = {
  tasks: [],
  onEdit: () => {},
  onDelete: () => {},
};

export default InProgress;
