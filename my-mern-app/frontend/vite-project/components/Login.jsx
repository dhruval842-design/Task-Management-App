import React from 'react'
import Navbar from '../components/Navbar'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Login.css'

const Login = () => {
  
  const [user,setUser] = useState({
    email:"",
    password:""
  });
  const navigate = useNavigate();

  const handleChange = (e) =>{
    const {name,value} = e.target;
    setUser({
      ...user,
      [name]:value
    });
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/users/login",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(user)
      });
      if(response.ok){
        const responseData = await response.json();
        console.log(responseData);
        setUser({
          email:"",  
          password:""
        });
        localStorage.setItem('token',responseData.token);
        localStorage.setItem('userId',responseData.userId);
        alert("Login Successful!");   
        navigate('/');
      }
      else{
        const errorData = await response.json();
        alert(errorData.message || "Login Failed!");
        console.error("Error inside response (HTTP status not OK):",response.status,errorData)
      }
    } catch (error) {
      console.error("Internal server error during login in catch block",error)
      alert("Login Failed! Internal server error during login in catch block");
    }
  }
  
  return (
    <div>
      <Navbar/>
      <h1 className='Login-heading'>Log In</h1>
      <div className="login-main-container">
        <form className="login-form-data" onSubmit={handleSubmit}>
          <input type="text" 
                 placeholder='Email'
                 required
                 value={user.email}
                 onChange={handleChange}
                 name='email'
          />
          <input type="password" 
                 placeholder='Password'
                 required
                 value={user.password}
                 onChange={handleChange}
                 name='password'
          />
          <button type="submit" className='login-btn'>
           Log In
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
