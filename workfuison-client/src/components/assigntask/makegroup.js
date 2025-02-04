import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../stylesheets/taskassign/makegroup.css'

const MakeGroup = () => {
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [groupName, setGroupName] = useState("");
 useEffect(()=>{
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/employees", {
        params: {
          department,
          name: employeeName,
          id: employeeId,
        },
      });
      setEmployees(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  if (department || employeeName || employeeId) {
    fetchEmployees();
  } else {
    setEmployees([]); // Clear employees if no filters are applied
  }
}, [department, employeeName, employeeId]);
 


  useEffect(() => {
    // Fetch departments when the component mounts
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/departments'); // Change URL as needed
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);
  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployees(prevSelected => {
      if (prevSelected.includes(employeeId)) {
        // If the employee is already selected, remove it from the list
        return prevSelected.filter(id => id !== employeeId);
      } else {
        // Otherwise, add it to the selected list
        return [...prevSelected, employeeId];
      }
    });
  };
  const handleCreateGroup = async () => {
    const token = localStorage.getItem("token");
    if (!groupName || selectedEmployees.length === 0) {
      alert("Please provide a group name and select employees.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/groups", {
        groupName,
        employeeIds: selectedEmployees,
      },{
        headers:{Authorization:`Bearer ${token}`}
      });
      alert("Group created successfully!");
      console.log(response.data);
      setGroupName("");
      setSelectedEmployees([]);
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group. Please try again.");
    }
  };
  return (
    <div className='div'>
      <div className="container text-center ">
  <div className="row">
    <div className="col">
    <div className='sec1'>
          <label htmlFor='dep'>Department:</label>
          
          <select className="form-select" aria-label="Disabled select example" value={department}
            onChange={(e) => setDepartment(e.target.value)} id='dep'>
<option value="" disabled >Select Department</option>
{departments.map((dep, index) => (
                  <option key={index} value={dep}>{dep}</option>
                ))}
            
</select>
        </div>
    </div>
    <div className="col">
    <div className='sec1'>
          <label htmlFor='name'>Name:</label>
          <input type="text" className="form-control"  aria-label="Username" aria-describedby="basic-addon1"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          placeholder="Enter name"
          id='name'/>
          

        </div>
    </div>
    <div className="col">
    <div className='sec1'>
          <label htmlFor='id' style={{ display: 'inline-block', marginRight: '10px' }}>Emp ID:</label>
          
          <input type="number" className="form-control"  aria-label="Username" aria-describedby="basic-addon1"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          placeholder="Enter Id"
          id='id'
          style={{ display: 'inline-block' }}/>
          
        </div>
    </div>
  </div>
</div>
      
<div>
        
        {employees.length ? (
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id}>
                  <td>
                    <input
                      type="checkbox"
                      name="employee"
                      checked={selectedEmployees.includes(employee._id)}
                      onChange={() => handleSelectEmployee(employee._id)}
                    />
                  </td>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>
            
<p>No employee found with above details</p>
          </div>
         
        )}
      </div>
      <div className="footer">
        
        <div>
        <label htmlFor='gname'>Group name:</label>
        <input
          type="text"
          placeholder="Enter group name"
          value={groupName}
          id="gname"
          onChange={(e) => setGroupName(e.target.value)}
        />
        <button className='but' onClick={handleCreateGroup}>Make Group</button>
        </div>
        
        
      </div>
    </div>
      
  

        );
};

        export default MakeGroup;