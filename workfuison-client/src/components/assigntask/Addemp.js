import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Import xlsx library
import axios from 'axios';
import '../../stylesheets/taskassign/addemp.css';
import {jwtDecode} from "jwt-decode"; // Corrected import for jwt-decode
import generateRandomNumber from "e-generate-random";

const AddEmployee = () => {
  const divStyle = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: "end"
  };

  const [file, setFile] = useState(null);

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set the file when selected
  };

  // Fetch manager ID from JWT token
  const getManagerId = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found, please login first.");
      return null;
    }

    // Decode the JWT token
    const decodedToken = jwtDecode(token);

    // Extract managerId from the decoded token
    const managerId = decodedToken.userId;
    if (!managerId) {
      alert("Manager not authenticated");
      return null;
    }
    return managerId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const managerId = getManagerId(); // Fetch managerId
    if (!managerId) return; // Exit if managerId is not found

    const token = localStorage.getItem("token"); // Retrieve token here

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      // Assuming the data is in the first sheet of the Excel file
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Add managerId and random id to each employee record
      const formattedData = jsonData.map((employee) => {
        return { ...employee, managerId, id: generateRandomNumber(300, 999) };  // Attach the managerId
      });

      // Send formatted data to the backend
      try {
        const response = await axios.post('http://localhost:8000/api/uploadEmployees', formattedData, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log('Response:', response); // Logging the response
        alert('Employees uploaded successfully!');
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={divStyle}>
      <div className="input-group mb-3">
        <label className="input-group-text" htmlFor="inputGroupFile01">Upload</label>
        <input
          type="file"
          className="form-control"
          id="inputGroupFile01"
          onChange={handleFileChange} // Bind the file change handler
        />
      </div>

      <div>
        <input
          className="btn btn-primary"
          type="submit"
          value="Submit"
          onClick={handleSubmit}
        />
      </div>

      <div style={{
        position: 'absolute',
        fontSize: '78px',
        left: '95px',
        top: '215px',
        color: 'gray',
        fontWeight: '100',
        opacity: '0.5'
      }}>
        Upload a file in excel sheet
      </div>
    </div>
  );
};

export default AddEmployee;
