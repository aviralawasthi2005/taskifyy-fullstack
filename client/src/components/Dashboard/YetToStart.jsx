import React, { memo } from "react";
import PropTypes from "prop-types";
import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

// Utility function
const normalizeStatus = (status) => status?.toLowerCase().replace(/\s/g, "") || "";

const YetToStart = memo(({ tasks, onEdit, onDelete }) => {
  const filteredTasks = tasks?.filter((task) => normalizeStatus(task.status) === "yettostart") || [];

  return (
    <Droppable droppableId="yettostart">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex flex-col gap-3 p-2 rounded-md ${
            snapshot.isDraggingOver ? "bg-blue-50" : ""
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
                No tasks in "Yet To Start" category
              </p>
            </div>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
});

YetToStart.propTypes = {
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

YetToStart.defaultProps = {
  tasks: [],
  onEdit: () => {},
  onDelete: () => {},
};

export default YetToStart;
