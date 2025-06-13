import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });
  const [editingId, setEditingId] = useState(null);

  // Load tasks and stats on component mount
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [filter, sortBy]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filter === 'completed') params.append('completed', 'true');
      if (filter === 'pending') params.append('completed', 'false');
      if (sortBy !== 'date') params.append('sort', sortBy);

      const response = await axios.get(`${API_URL}/tasks?${params}`);
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`);
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/tasks/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(`${API_URL}/tasks`, formData);
      }
      
      setFormData({ title: '', description: '', priority: 'medium' });
      setError('');
      fetchTasks();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save task');
    }
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority
    });
    setEditingId(task._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`${API_URL}/tasks/${id}`);
        fetchTasks();
        fetchStats();
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  const toggleComplete = async (task) => {
    try {
      await axios.put(`${API_URL}/tasks/${task._id}`, {
        ...task,
        completed: !task.completed
      });
      fetchTasks();
      fetchStats();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', priority: 'medium' });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#26de81';
      default: return '#ffa502';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Task Manager</h1>
        <div className="stats">
          <div className="stat-card">
            <h3>Total</h3>
            <p>{stats.total || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p>{stats.completed || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p>{stats.pending || 0}</p>
          </div>
        </div>
      </header>

      <main className="main-content">
        {error && <div className="error-message">{error}</div>}

        {/* Task Form */}
        <div className="task-form-container">
          <h2>{editingId ? 'Edit Task' : 'Add New Task'}</h2>
          <form onSubmit={handleSubmit} className="task-form">
            <div className="form-row">
              <input
                type="text"
                placeholder="Task title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <textarea
              placeholder="Task description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="3"
            />
            <div className="form-actions">
              <button type="submit">
                {editingId ? 'Update Task' : 'Add Task'}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="cancel-btn">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Filters and Sorting */}
        <div className="controls">
          <div className="filter-controls">
            <label>Filter:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="sort-controls">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date">Date Created</option>
              <option value="title">Title</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        <div className="task-list">
          {loading ? (
            <div className="loading">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="no-tasks">
              {filter === 'all' ? 'No tasks yet. Create your first task!' : `No ${filter} tasks found.`}
            </div>
          ) : (
            tasks.map(task => (
              <div key={task._id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                <div className="task-header">
                  <div className="task-title-section">
                    <h3 className={task.completed ? 'completed-title' : ''}>{task.title}</h3>
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <div className="task-actions">
                    <button
                      onClick={() => toggleComplete(task)}
                      className={`toggle-btn ${task.completed ? 'completed' : ''}`}
                    >
                      {task.completed ? '✓' : '○'}
                    </button>
                    <button onClick={() => handleEdit(task)} className="edit-btn">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(task._id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </div>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                <div className="task-meta">
                  <small>Created: {formatDate(task.createdAt)}</small>
                  {task.updatedAt !== task.createdAt && (
                    <small>Updated: {formatDate(task.updatedAt)}</small>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;