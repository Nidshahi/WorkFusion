import { useState, useEffect } from "react";
import axios from "axios";
import '../../stylesheets/taskassign/gData.css';

const GData = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const[groupName,setGroupName] =useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState("");
  const[empTask,setEmpTask]=useState("");

  useEffect(() => {
    const fetchgData = async () => {
      try {
        const id = localStorage.getItem("selectedGroupId");

        if (!id) {
          console.error("Group ID not found in localStorage");
          setError("Group ID not found in localStorage");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:8000/api/groups/${id}`);

        if (!response.data || !response.data.group) {
          console.error("Invalid response format", response.data);
          setError("Invalid response format");
          setLoading(false);
          return;
        }

        const group = response.data.group;
        setGroupName(group);
        const employeeIds = group.employeeIds || [];

        if (employeeIds.length === 0) {
          console.log("No employees found in this group.");
          setLoading(false);
          return;
        }

        const employees = await Promise.all(
          employeeIds.map(async (emp) => {
            try {
              const empId = emp._id;
              const employeeResponse = await axios.get(`http://localhost:8000/api/employees/${empId}`);
              return employeeResponse.data;
            } catch (err) {
              console.error("Failed to fetch employee data for ID:", err);
              return null;
            }
          })
        );

        const validEmployees = employees.filter((emp) => emp !== null);
        const managerId=validEmployees[0].manager;
        localStorage.setItem('managerId',managerId.toString());
        setEmployeeList(validEmployees);
      } catch (e) {
        console.error("Something went wrong with data", e);
        setError("Something went wrong with data");
      } finally {
        setLoading(false);
      }
    };

    fetchgData();
  }, []);

  const handleTaskClick = (employee) => {
    setSelectedEmployee(employee);
    setOpenDialog(true);
  };

  const handleTaskSubmit = async () => {
    if (!taskName || !deadline || !selectedEmployee) {
      alert("Please fill all fields");
      return;
    }
  
    const today = new Date().toISOString().split('T')[0];
    if (new Date(deadline) < new Date(today)) {
      alert("Deadline cannot be in the past");
      return;
    }
  
    try {
      const taskData = {
        taskName,
        deadline,
        employeeId: selectedEmployee._id,
        managerId: localStorage.getItem("managerId"),
      };
      console.log('task data',taskData);
      const response = await axios.post("http://localhost:8000/api/tasks", taskData);
      if (response.status === 200 || response.status === 201) {
        alert("Task assigned successfully");
        const newTaskId=response.data.task._id;
        setEmployeeList((prev) =>
          prev.map((emp) =>
            
            emp._id === selectedEmployee._id
              ? { ...emp,
                tasks: [...(emp.tasks || []), newTaskId] }
              : emp
            

          )
          
        );
        setOpenDialog(false);
        setTaskName("");
        setDeadline("");
        window.location.reload()
      } else {
        alert("Failed to assign task");
      }
    } catch (error) {
      console.error("Error assigning task:", error);
      setOpenDialog(false);
      alert("An error occurred while assigning the task.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 style={{textAlign:'center'}}>{groupName.groupName}</h1>
      <table>
     
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Assign Task</th>
          </tr>
        </thead>
        <tbody>
          {employeeList.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
              <td
                className="assign-task-cell"
                onClick={() => handleTaskClick(employee)}
              >
                  {employee.tasks && employee.tasks.length > 0 ? (
    employee.tasks.map((task, index) => (
      <div key={index}>{task.taskName}</div> // Display each task's name
    ))
  ) : (
    "Click to assign"
  )}
              </td>
            </tr>
          ))}
        </tbody>
        
      </table>

      {/* Task Assignment Dialog */}
      {openDialog && (
        <div className="dialog">
          <h3>Assign Task to {selectedEmployee.name}</h3>
          <form>
            <div>
              <label>Task Name:</label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </div>
            <div>
              <label>Deadline:</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <button type="button" onClick={handleTaskSubmit}>
              Assign
            </button>
            <button type="button" onClick={() => setOpenDialog(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GData;
