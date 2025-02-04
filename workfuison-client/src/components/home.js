import React, { use } from "react";
import { Link ,useNavigate} from 'react-router-dom';
const Home=()=>{
  const navigate=useNavigate();
  const handleClickEvent=()=>{
    navigate('/login')
  }
  return(
    <div>
     <div className="card" style={{width: "18rem"}}>
  <img src="logo.png" className="card-img-top" alt="..."/>
  <div className="card-body">
    <h5 className="card-title"> WorkFusion</h5>
    <p className="card-text">Make managing work form home easy</p>
    <button className="login-button" onClick={handleClickEvent}>Login</button>
  </div>
</div>
    
  </div>
    
    
    
    
  );
};
export default Home;
