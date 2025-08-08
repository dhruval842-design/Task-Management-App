import React from 'react'
import Navbar from '../components/Navbar'
import './Home.css'
import DisplayTasks from '../components/DisplayTasks';

const Home = () => {
  
  const token = localStorage.getItem('token');

  return (

    <div className='home-main-container'>
      <Navbar/>
      {token && (
         <DisplayTasks/>
      )}
    </div>
  )
}

export default Home
