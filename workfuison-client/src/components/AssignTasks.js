import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../stylesheets/taskassign/assigntask.css';
const AssignTask = () => {
  const [groups, setGroups] = useState([]);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const fetchGroups = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/groups');
      setGroups(response.data.group);
      
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };
  const navigate = useNavigate();
  const handleViewTask = (groupId) => {
    // Remove the previously stored group data ince MongoDB ObjectId is a string-like object, you can extract its string value using .toString().
    
    localStorage.removeItem("selectedGroupId");
    
    // Store the new group data in localStorage
    localStorage.setItem("selectedGroupId", groupId.toString());

    // Set a flag to trigger navigation after the render
    setShouldNavigate(true);
  };

  useEffect(() => {
    // Perform the navigation after the render phase
    if (shouldNavigate) {
      navigate('/manager-dashboard/members');
      setShouldNavigate(false); // Reset the flag to prevent infinite navigation
    }
  }, [shouldNavigate, navigate]); 
  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div>
      
      
      <ul>
        {groups.map((group) => (
          <div className="card" key={group._id}>
  
          <div className="card-body">
            <h5 className="card-title">{group.groupName}</h5>
            
            <button className='but1' onClick={() => handleViewTask(group._id)} >ViewTask</button>
            
            
          </div>
        </div>
        ))}
      </ul>
    </div>
  );
};

export default AssignTask;
