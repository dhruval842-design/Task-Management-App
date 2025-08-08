import React from 'react'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Signup.css'


const Signup = () => {
  
const [user,setUser]=useState({
    firstname:"",
    lastname:"",
    email:"",
    username:"",
    password:"",
});
const navigate = useNavigate();

const handleChange = (e) => {

  let {name,value} = e.target;
  
  setUser({
    ...user,
    [name] : value
  });
};

const handleSubmit = async (e) =>{
  e.preventDefault();
  console.log(user);
  try {
    const response = await fetch("http://localhost:5000/api/users/signup",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(user)
    });
    if(response.ok){
      const responseData = await response.json();
      console.log("Response after response.ok : ",responseData);
      alert("Signup Successful!");
      setUser({
        firstname:"",
        lastname:"",
        email:"",
        username:"",
        password:"",
      });
      navigate('/login');
    }
    else{
      const errorData = await response.json();
      alert(errorData.message || "Signup failed! Please try again");
      console.error("Error inside response (HTTP status not OK):",response.status,errorData);
    }
  } catch (error) {
    console.error("Internal server error occur during signup",error);
    alert("Signup Failed! Internal server error occur during signup in catch block");
  }
}


return (
    <div>
      <Navbar/>
      <div className="signup-main-container">
        <h1 className='signup-heading'>Sign up</h1>
        <form className='form-container' onSubmit={handleSubmit}>
           <input type="text"
                  placeholder='Enter firstname'
                  required
                  name="firstname"
                  onChange={handleChange}
                  value={user.firstname}
           />
           <input type="text"
                  placeholder='Enter lastname'
                  required
                  name="lastname"
                  onChange={handleChange}
                  value={user.lastname}
           />
           <input type="email"
                  placeholder='Enter email'
                  required
                  name="email"
                  onChange={handleChange}
                  value={user.email}
           />
           <input type="text"
                  placeholder='Enter username'
                  required
                  name="username"
                  onChange={handleChange}
                  value={user.username}
           />
           <input type="password"
                  placeholder='Enter password'
                  required
                  name="password"
                  onChange={handleChange}
                  value={user.password}
           />
           <button type="submit" className='signup-btn'>
            Sign up
           </button>

        </form>
      </div>
    </div>
  )
}

export default Signup
