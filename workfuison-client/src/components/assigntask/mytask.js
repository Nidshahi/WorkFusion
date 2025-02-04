import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../stylesheets/taskassign/mytask.css';

const MyTask = () => {
  const [tasks, setTasks] = useState([]); // State to hold tasks data
  const [selectedStatus, setSelectedStatus] = useState({}); // Track the status of each task
  const token = localStorage.getItem('token');
  // Fetch tasks assigned to the employee from the server
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/tasks/assigned',{
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token here
          },
        }); // Replace with actual API endpoint
        setTasks(response.data);
        // Initialize selectedStatus with the current status of each task
        const initialStatus = {};
        response.data.forEach((task) => {
          initialStatus[task._id] = task.status; // Assume each task has a unique _id
        });
        setSelectedStatus(initialStatus);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  // Handle status change for a task
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Update status locally first
      setSelectedStatus({ ...selectedStatus, [taskId]: newStatus });

      // Send the updated status to the server
      await axios.put(`http://localhost:8000/api/tasks/${taskId}`, { status: newStatus },{
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token here
        },
      }); // Replace with actual API endpoint
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="mytasks">
      <h2>Your Assigned Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks assigned to you at the moment.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              <h4>{task.taskName}</h4> {/* Use taskName as per the schema */}
              {/* Assuming description exists in the task schema */}
              <div className="task-status">
                <label htmlFor={`status-${task._id}`}>Status:</label>
                <select
                  id={`status-${task._id}`}
                  value={selectedStatus[task._id]}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyTask;
