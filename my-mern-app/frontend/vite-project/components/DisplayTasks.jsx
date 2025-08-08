import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './DisplayTasks.css';


const DisplayTasks = () => {


  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    status: ""
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();


  useEffect(() => {
    fetchTasks();
  }, [filterStatus])


  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You are not logged in!, please log in to view Tasks");
      navigate('/login');
      return;
    }
    try {
      const url = filterStatus === 'all' ?
        `http://localhost:5000/api/tasks` :
        `http://localhost:5000/api/tasks?status=${filterStatus}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTasks(data);
      }
      else {
        const errorData = await response.json();
        alert(errorData.message || "Error during fetch tasks");
        console.error("Error during fetch tasks", response.status, errorData);
      }
    } catch (error) {
      console.error("Internal server error during fetch Tasks in catch block", error);
      alert("Internal server error during fetch Tasks in catch block");
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setEditFormData({ title: task.title, description: task.description, status: task.status });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    })
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You are not logged in! ");
      navigate('/login');
      return;
    };
    try {
      const url = `http://localhost:5000/api/tasks/edit/${editingTask._id}`

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        const data = await response.json();
        alert("Task updated successfully!")
        setEditingTask(null);
        fetchTasks();
      }
      else {
        const errorData = await response.json();
        alert(errorData.message || "Error during updating tasks");
        console.error("Failed to update task!", response.status, errorData)
      }
    } catch (error) {
      console.error('Network error during updating task:', error);
      alert('Failed to connect to the server to update task.');
    }
  };

  const handleCompleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You are not logged in! Login first");
      navigate('/login');
      return;
    }
    try {
      const url = `http://localhost:5000/api/tasks/complete/${taskId}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (response.ok) {
        alert("Task marked as completed!");
        fetchTasks();
      }
      else {
        const errorData = await response.json();
        console.error("Failed to complete task:", response.status, errorData);
        alert(errorData.message || "Failed to complete task!");

      }

    } catch (error) {
      console.error('Network error during completing task:', error);
      alert('Failed to connect to the server to complete task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You are not logged in! Login first");
      navigate('/login');
      return;
    }
    try {
      const url = `http://localhost:5000/api/tasks/delete/${taskId}`;

      if (!window.confirm("Are you sure want to delete this task")) {
        return;
      }

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("Task deleted successfully!");
        fetchTasks();
      }
      else {
        const errorData = await response.json();
        console.error("Error during deleting a task", response.status, errorData);
        alert(errorData.message || "Error during deleting a task");
      }
    } catch (error) {
      console.error('Network error during deleting task:', error);
      alert('Failed to connect to the server to deleting task.');
    }
  };



  return (
    <div className='main-container'>
      
      <div className="content-container">

        <div className="filter-container">


          <button className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}>
            All
          </button >

          <button className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}>
            Completed
          </button>

          <button className={`filter-btn ${filterStatus === 'in-progress' ? 'active' : ''}`}
            onClick={() => setFilterStatus('in-progress')}>
            In-progress
          </button>

          <button className={`filter-btn ${filterStatus === 'archived' ? 'active' : ''}`}
            onClick={() => setFilterStatus('archived')}>
            Archived
          </button>

          <button className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}>
            Pending
          </button>

        </div>

        <div className="user-task-container">

          {tasks.length === 0

            ? (<div className="no-task-message">
              <h3>No task found.Create a new task!</h3>
            </div>)

            : (<div className="task-grid">

              {tasks.map((task) => (

                <div className="task-data" key={task._id}>

                  <h2>{task.title}</h2>

                  <p>{task.description}</p>

                  <div className="task-info">
                    <span>Status: <span className={`status-badge-${task.status}`}>{task.status}</span></span>
                    <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="task-actions">
                    <button className='action-btn edit-btn' onClick={() => { handleEditClick(task) }} >
                      Edit
                    </button>
                    {task.status !== "completed" && (
                      <button className='action-btn complete-btn' onClick={() => { handleCompleteTask(task._id) }} >
                        Complete
                      </button>
                    )}
                    <button className='action-btn delete-btn' onClick={() => { handleDeleteTask(task._id) }} >
                      Delete
                    </button>
                  </div>

                </div>

              ))}

            </div>)}
        </div>
        {editingTask && (
        <div className="task-edit-form">
          
            <div className="edit-task-form">

              <form onSubmit={handleUpdateTask}>

                <label>
                  Title:
                  <input type="text"
                    name="title"
                    onChange={handleEditFormChange}
                    value={editFormData.title}
                    required />
                </label>

                <label>
                  Description:
                  <textarea type="text"
                    name="description"
                    rows={7}
                    onChange={handleEditFormChange}
                    value={editFormData.description}
                    required />
                </label>

                <label>
                  Status:
                  <select name="status" type="text" value={editFormData.status} onChange={handleEditFormChange}>
                    <option>Status</option>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In-progress</option>
                    <option value="archived">Archived</option>
                    <option value="pending">Pending</option>
                  </select>
                </label>

                <div className="edit-form-actions">

                  <button className='editform-save-btn' type="submit" >
                    Save Changes
                  </button>

                  <button className='editform-cancel-btn' type="button" onClick={() => { setEditingTask(null) }}>
                    Cancel
                  </button>

                </div>


              </form>
            </div>

          
        </div>
        )}
      </div>

    </div>
  )
}

export default DisplayTasks
