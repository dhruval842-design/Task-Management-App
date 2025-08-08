import React from 'react'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Signup from '../components/Signup';
import Home from '../components/Home';
import Login from '../components/Login'
import CreateTask from '../components/CreateTask'
import './App.css'

const App = () => {
  return (
    <div className='app-main-container'>
      <BrowserRouter>
        <Routes>
           <Route path="/" element={<Home/>}/>
           <Route path="/signup" element={<Signup/>}/>
           <Route path="/login" element={<Login/>}/>
           <Route path="/CreateTask" element={<CreateTask/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
