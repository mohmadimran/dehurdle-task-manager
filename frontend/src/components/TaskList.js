import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onTaskUpdated, onTaskDeleted }) {
  if (tasks.length === 0) {
    return <div>No tasks found. Create your first task!</div>;
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onTaskUpdated={onTaskUpdated}
          onTaskDeleted={onTaskDeleted}
        />
      ))}
    </div>
  );
}

export default TaskList;