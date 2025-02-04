import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../stylesheets/register.css";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('employee');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  
  const navigate = useNavigate();


  
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/register', { name, email, password, role,department,phone });
      alert('You have registered successfully:');
      if(response.data.message==='Registration successful'){
      if (role==='manager'){
        navigate('/manager-dashboard');
      }
      else if(role==='employee'){
        navigate('/employee-dashboard');
      }
    }
      // Redirect to login page or show a success message (use React Router or window.location)
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'Something went wrong';
      console.error('Registration failed', errorMessage);
      console.log(error);
      alert(errorMessage);
    }
  };
  const cardStyle = {
    width: "35rem",
    height: role === 'employee' ? '45rem' : '39rem', // Increase height when employee role is selected
  };
  
  return ( 
    <div  className='body'>
      <div className="container  section1">
        <div className="row">
          <div className="col-1">

          </div>
          <div className="col-6">
            <div className="card" style={cardStyle}>
              <div className="card-body card_body" >
                <div className='imag'>
                  <img src="/logo.png" alt="Icon" className="card-icon" />
                  <h5 className="card-title card_title" style={{ marginTop:role === 'employee' ? '0rem' : '0.5rem'}}> Register</h5>
                </div>


                <form onSubmit={handleRegister} >
                 
                  <div className=" email_section" style={{ marginBottom: role === 'employee' ? '-15px' : '0px' }}>
                    <label htmlFor="exampleFormControlInput1" className="form-label">Username</label>
                    <input type="text" className="form-control" id="exampleFormControlInput1" value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Write your name" required />
                  </div>
                  <div className=" email_section" style={{ marginBottom: role === 'employee' ? '-15px' : '0px' }}>
                    <label htmlFor="exampleFormControlInput2" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleFormControlInput2" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email" required />
                  </div>
                  <div className=" email_section" style={{ marginBottom: role === 'employee' ? '-15px' : '0px' }}>
                    <label htmlFor="inputPassword5" className="form-label">Password</label>
                    <input type="password" id="inputPassword5" className="form-control " value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      aria-describedby="passwordHelpBlock" required />
                    <div id="passwordHelpBlock" className="form-text">
                      Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                    </div>
                  </div>
                 
          <div className="email_section" style={{ marginBottom: role === 'employee' ? '-15px' : '0px' }}>
          <select className="form-select select1" aria-label="Disabled select example" value={role} onChange={(e) => setRole(e.target.value)} 
        required>
  
  <option value={"employee"}>Employee</option>
      <option value={"manager"}>Manager/Head</option>
</select>
          </div>

   
{role === 'employee' && (
          <>
            <div className="email_section condition" style={{ marginBottom: role === 'employee' ? '-15px' : '0px' }}>
              <label>Department</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>

            <div className="email_section" style={{ marginBottom: role === 'employee' ? '-15px' : '0px' }}>
              <label>Phone Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            
            
          </>
        )}

                 
                  <button className='login_button mt-4' style={{margin: role === 'employee' ? '0rem' : '0.5rem'}}type="submit">Register</button>
                </form>
                {/* <a href="/" onClick={HandleNavigation}>Go to Dashboard</a> */}

              </div>
            </div>

          </div>
          <div className="col-3">

          </div>
        </div>


      </div>

    </div>
  );
};


export default Register;