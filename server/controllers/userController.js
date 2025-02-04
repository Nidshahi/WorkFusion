import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Manager from '../models/manager.js';
import Employee from '../models/employee.js';
import generateRandomNumber from "e-generate-random";
import dotenv from 'dotenv';
import Mongoose from 'mongoose';
import Group from '../models/group.js';
import Task from '../models/task.js';
dotenv.config();

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ msg: "User does not exist" });

  const isMatch = await bcrypt.compare(password, user.password); 

  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }

  const token = jwt.sign(
    { userId: user.role === 'employee' ? user.employee_id : user.manager_id, role: user.role,email:user.email },
    process.env.JWT_SECRET_KEY, 
     { expiresIn: '1h' }
  );

  return res.status(200).json({ message: 'Login successful', token, role: user.role });
};
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Create the new user
    const user = new User({ name, email, password, role });
    const savedUser = await user.save();

    if (role === 'employee') {
      // If the user is an employee, create the employee document
      let employee = await Employee.findOne({ email });
      let managerId=employee.managerId;
      if (employee) {
        // If employee exists, add managerId reference to the employee
        employee.managerId = managerId; // Set managerId as before
        await employee.save();
      } else {
        // Create a new employee if one doesn't exist
        employee = new Employee({
          name,
          email,
          department,
          phone,
          id: generateRandomNumber(100, 299)
        });
        await employee.save();
      }

      // Update the user with the employee_id
      savedUser.employee_id = employee._id;
      await savedUser.save();
    } else if (role === 'manager') {
      // If the user is a manager, create the manager document
      let manager = await Manager.findOne({ email });
      if (!manager) {
        manager = new Manager({
          name,
          email,
          password,
          employees: [],
        });
        await manager.save();
      }

      // Update the user with the manager_id
      savedUser.manager_id = manager._id;
      await savedUser.save();
    }
    console.log('maanger/employeeid is',savedUser.employee_id);
    console.log('userid is',savedUser._id);
    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const insertEmpData=async(req,res)=>{
  try {
    const employees = req.body;

    if (!Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({ message: 'No employee data provided' });
    }

    // Validate managerId from token or data
    const managerId = req.userId; // Assuming `verifyToken` attaches `userId` to req
    if (!managerId) {
      return res.status(401).json({ message: 'Unauthorized: Manager ID missing' });
    }

    // Process employee data
    const newEmployees = employees.map((emp) => ({
      ...emp,
      manager: managerId, // Link to the manager who uploaded
    }));

    // Bulk insert or update
    const bulkOps = newEmployees.map((emp) => ({
      updateOne: {
        filter: { email: emp.email }, // Match by email
        update: emp, // Update fields
        upsert: true, // Insert if not found
      },
    }));

    await Employee.bulkWrite(bulkOps);

    // Optionally: Update the manager's employee list
    await Manager.findByIdAndUpdate(
      managerId,
      { $addToSet: { employees: { $each: newEmployees.map((emp) => emp._id) } } },
      { new: true }
    );

    res.status(200).json({ message: 'Employees uploaded successfully' });
  } catch (error) {
    console.error('Error in uploading employees:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const departmentlist=async(req,res)=>{
  try {
    const departments = await Employee.distinct("department");
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
const empData = async (req, res) => {
  console.log("empData function called"); 
  const { department, name, id } = req.query;

  try {
    // Create filter object for the query
    let filter = {};

    // If a department is provided, add it to the filter
    if (department) {
      filter.department = department;
    }

    // If a name is provided, add it to the filter (case-insensitive search)
    if (name) {
      filter.name = { $regex: name, $options: "i" }; // Case-insensitive search by name
    }

    // If an id is provided, add it to the filter (parse to a number if necessary)
    if (id) {
      // If id is numeric, convert it to number
      filter.id =  Number(id);
    }

   

    // Find employees based on the filter
    const employees = await Employee.find(filter);
    
    // Send the result as the response
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const makeGroup= async (req, res) => {
  const { groupName, employeeIds } = req.body;
console.log('employeeids',employeeIds);
  // Assuming req.user contains the logged-in user's data (manager's info)
  const createdBy = req.userId; // Get manager's ID (stored in req.user._id)
console.log('APT',createdBy);
  try {
    // Convert employee IDs to ObjectId (assuming employeeIds are passed as strings)
    const employeeObjectIds = employeeIds.map((id) => new Mongoose.Types.ObjectId(id));

console.log('empobjid',employeeObjectIds);
    // Create a new group document
    const newGroup = new Group({
      groupName,
      employeeIds: employeeObjectIds,
      createdBy,  // Add manager's ID as createdBy
    });
const nGroup=await newGroup.save();
    // Save the group to the database
    console.log('new Group information i slike ',nGroup);

    // Respond with success message
    res.status(201).json({
      message: 'Group created successfully',
      group: newGroup,
    });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getgdata = async (req, res) => {
  try {
    const groups = await Group.find({}).populate('employeeIds','createdBy');
    if (!groups || groups.length === 0) {
      return res.status(404).json({ message: 'No groups found' });
    }
    res.status(201).json({ message: 'Successfully loaded', group: groups });
  } catch (e) {
    console.log('Failed to load group data', e);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getEdata=async(req,res)=>{
  try {
    console.log('m bhi pohonch gya')
    const employeeId = req.params.empId; // Get the employee ID from the URL parameter
     console.log('employee id received',employeeId)
    // Find the employee in the database using the ID
    const employee = await Employee.findById(employeeId).populate('tasks', 'taskName');
    console.log('employee::::',employee);
    // If the employee is not found, send a 404 error
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found'});
    }

    // Return the employee information
    res.status(200).json(employee);
  } catch (error) {
    console.error('Error fetching employee data:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
const getgbyid = async (req, res) => {
  try {
    console.log('Reached getgbyid');
    const id = req.params.id;
    console.log('Received group ID:', id);
    const group = await Group.findById(id).populate('employeeIds');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    console.log('Group data:', group);
    res.status(200).json({ message: 'Successfully loaded', group });
  } catch (e) {
    console.log('Failed to load group data:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const Tasks=async(req,res)=>{
  try {
    const { taskName, deadline, managerId, employeeId } = req.body; // Extract data from the request body
console.log('on server side req',req.body);
    // Validate required fields
    if (!taskName || !deadline || !managerId || !employeeId) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    // Create the new task
    const newTask = new Task({
      taskName,
      deadline,
      managerId,
      employeeId,
    });

    // Save the task to the database
    const savedTask = await newTask.save();
    console.log('task saved:',savedTask);
     employee.tasks.push(savedTask._id);
     await employee.save();
    

    res.status(201).json({ message: 'Task created successfully.', task: savedTask });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}
const taskAssign = async (req, res) => {
  try {
    const userId = req.userId; // Extract userId from the token
    console.log('Logged-in user ID:', userId);

    // Check if the logged-in user is an employee or a manager
    const employee = await Employee.findById(userId); // Retrieve the user object
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    let tasks;
    
      // For employee, use employeeId to fetch tasks
      tasks = await Task.find({ employeeId: userId }) // Fetch tasks for the employee
        .populate('employeeId', 'name email')
        ; // Optionally populate manager details
   
    console.log('tasks assifgned at last',tasks);
    // Respond with the tasks
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching assigned tasks:', error);
    res.status(500).json({ message: 'Server Error: Unable to fetch tasks.' });
  }
};
const statusUpdate = async (req, res) => {
  const { taskId } = req.params; // Get taskId from the URL
  const { status } = req.body; // Get the new status from the request body

  try {
    // Check if the status is valid
    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find the task by ID and update its status
    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update the task status
    task.status = status;
    await task.save(); // Save the updated task

    res.status(200).json({ message: 'Task status updated successfully', task });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ message: 'Server Error: Unable to update status.' });
  }
};
const userController = {
  loginUser,
  registerUser,
  insertEmpData,
  departmentlist,
  empData,
  makeGroup,
  getgdata,
  getEdata,
  getgbyid,
  Tasks,
  taskAssign,
  statusUpdate
};

export default userController;
