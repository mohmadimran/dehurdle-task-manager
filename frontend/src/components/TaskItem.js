import React, { useState } from 'react';
import { updateTask, deleteTask } from '../services/Api';

function TaskItem({ task, onTaskUpdated, onTaskDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [editedStatus, setEditedStatus] = useState(task.status);
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      await updateTask(task._id, { status: newStatus });
      onTaskUpdated();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      try {
        await deleteTask(task._id);
        onTaskDeleted();
      } catch (error) {
        console.error('Failed to delete task:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      await updateTask(task._id, {
        title: editedTitle,
        description: editedDescription,
        status: editedStatus,
        dueDate: editedDueDate || undefined,
      });
      setIsEditing(false);
      onTaskUpdated();
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      todo: '🔴',
      'in-progress': '🟡',
      done: '🟢',
    };
    return colors[status] || '⚪';
  };

  if (isEditing) {
    return (
      <div style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Status:</label>
          <select value={editedStatus} onChange={(e) => setEditedStatus(e.target.value)}>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label>Due Date:</label>
          <input
            type="date"
            value={editedDueDate}
            onChange={(e) => setEditedDueDate(e.target.value)}
          />
        </div>
        <div>
          <button onClick={handleEdit} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button onClick={() => setIsEditing(false)} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
      <div>
        <h4>{getStatusColor(task.status)} {task.title}</h4>
        <p>Description: {task.description || 'No description'}</p>
        <p>Status: {task.status}</p>
        {task.dueDate && <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>}
        <p>Created: {new Date(task.createdAt).toLocaleDateString()}</p>
      </div>
      <div>
        <div>
          <label>Update Status:</label>
          <select
            value={task.status}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            disabled={loading}
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <button onClick={() => setIsEditing(true)} disabled={loading}>
            Edit Details
          </button>
          <button onClick={handleDelete} disabled={loading} style={{ backgroundColor: 'red', color: 'white' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;