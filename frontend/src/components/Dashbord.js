import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import { getTasks } from '../services/Api';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchTasks();
    }
  }, [isAuthenticated, navigate, statusFilter]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await getTasks(statusFilter);
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = () => {
    fetchTasks();
  };

  const handleTaskUpdated = () => {
    fetchTasks();
  };

  const handleTaskDeleted = () => {
    fetchTasks();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFilterChange = (status) => {
    setStatusFilter(status);
  };

  return (
    <div>
      <div>
        <h2>Task Manager Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div>
        <h3>Create New Task</h3>
        <TaskForm onTaskCreated={handleTaskCreated} />
      </div>

      <div>
        <h3>Filter Tasks</h3>
        <div>
          <button onClick={() => handleFilterChange('')}>All</button>
          <button onClick={() => handleFilterChange('todo')}>Todo</button>
          <button onClick={() => handleFilterChange('in-progress')}>In Progress</button>
          <button onClick={() => handleFilterChange('done')}>Done</button>
        </div>
      </div>

      <div>
        <h3>Tasks ({tasks.length})</h3>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {loading ? (
          <div>Loading tasks...</div>
        ) : (
          <TaskList
            tasks={tasks}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;