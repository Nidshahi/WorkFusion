import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "../stylesheets/login.css";


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    try {
      console.log('Sending email:', email);
      console.log('Sending password:', password);
      const response = await axios.post('http://localhost:8000/api/login', { email, password });
      console.log('Login successful:');
      if (response.data.token) {
        // Store the JWT token and role in localStorage
        localStorage.setItem('token', response.data.token);  // Store the JWT token
        localStorage.setItem('role', response.data.role);  // Store the user's role
      
        if (response.data.role === 'manager') {
          navigate('/manager-dashboard');
        } else if (response.data.role === 'employee') {
          navigate('/employee-dashboard');
        }
      }
    }
    catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'Something went wrong';
      console.error('Login failed:', errorMessage);
      console.log('error details', error);
      alert(errorMessage);
    }
  };

  

  return (

    <div style={{backgroundColor:"#7AB7BE"}} className='body'>
      <div className="container text-center section1">
        <div className="row">
          <div className="col-1">

          </div>
          <div className="col-6">
            <div className="card" style={{ width: "35rem", height: '30rem' }}>
              <div className="card-body card_body">
                <div className='imag'>
                <img src="/logo.png" alt="Icon" className="card-icon" />
                <h5 className="card-title card_title">Login Form</h5>
                </div>
              

                <form onSubmit={handleLogin} >
                  <div className=" email_section">
                    <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleFormControlInput1" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email" required />
                  </div>
                  <div className=" email_section">
                    <label htmlFor="inputPassword5" className="form-label">Password</label>
                    <input type="password" id="inputPassword5" className="form-control " value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      aria-describedby="passwordHelpBlock" required />
                    <div id="passwordHelpBlock" className="form-text">
                      Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                    </div>
                  </div>
                  <button className='login_button' type="submit">Login</button>
                </form>
                <p className='text-Primary'>Don't have an account? <Link to="/register" style={{fontWeight:"400"}}>Register here</Link></p>

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

export default Login;
