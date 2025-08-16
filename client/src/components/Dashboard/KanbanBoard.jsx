import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

const initialColumns = {
  yettostart: { name: "Yet To Start", items: [
    { id: "1", title: "Task A", description: "This is task A", priority: "high", status: "yettostart" },
    { id: "2", title: "Task B", description: "This is task B", priority: "medium", status: "yettostart" },
  ]},
  inprogress: { name: "In Progress", items: [
    { id: "3", title: "Task C", description: "This is task C", priority: "low", status: "inprogress" },
  ]},
  completed: { name: "Completed", items: [] },
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const sourceItems = Array.from(sourceCol.items);
    const destItems = Array.from(destCol.items);

    const [moved] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, moved);
      setColumns({ ...columns, [source.droppableId]: { ...sourceCol, items: sourceItems } });
    } else {
      destItems.splice(destination.index, 0, moved);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, items: sourceItems },
        [destination.droppableId]: { ...destCol, items: destItems },
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 p-4 overflow-x-auto">
        {Object.entries(columns).map(([colId, col]) => (
          <Droppable key={colId} droppableId={colId}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`bg-zinc-50 rounded-lg p-3 min-w-[250px] flex-shrink-0 transition-colors duration-200 ${snapshot.isDraggingOver ? "bg-blue-50" : "bg-zinc-50"}`}
              >
                <h2 className="font-bold text-lg mb-3">{col.name}</h2>

                {col.items.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${snapshot.isDragging ? "shadow-lg" : "shadow-sm"} mb-3`}
                      >
                        <TaskCard data={task} />
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
