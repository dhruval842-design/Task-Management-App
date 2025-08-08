import React from 'react'
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  
  return (
    <div className="navbar" >
          
          <li>
            <ul><Link to="/" className='navbar-link-tag'>Home</Link></ul>
            <ul><Link to="/signup" className='navbar-link-tag'>Signup</Link></ul>
            <ul><Link to="/login" className='navbar-link-tag'>Login</Link></ul>
            <ul><Link to="/CreateTask" className='navbar-link-tag'>Create Task</Link></ul>
          </li>
       
    </div>
  )
}

export default Navbar
