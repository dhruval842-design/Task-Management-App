import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom';
import './CreateTask.css'

const CreateTask = () => {
  
  const[task,setTask] = useState({
    title:"",
    description:"",
    status:""
  });
  const navigate = useNavigate();

  const handleChange = (e) =>{
    const {name,value} = e.target;
    setTask({
      ...task,
      [name] : value
    });
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const userToken = localStorage.getItem('token');
    if(!userToken){
      alert("You have to log in first to create or add any task ");
      navigate('/login')
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/tasks/create",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${userToken}`
        },
        body:JSON.stringify(task)
      });
      if(response.ok){
        const responseData = await response.json();
        console.log("Task created successfully",responseData);
        alert("Task created Successfully!");
        setTask({
          title:"",
          description:"",
          status:""
        });
        navigate('/');
      }
      else{
        const errorData = await response.json();
        console.error("Error during creation of task!",response.status,errorData);
        alert(errorData.message || "Error during creation of task!");
      }
    } catch (error) {
       console.error("Internal server error during creation of task in catch block",error);
       alert("Internal server error during creation of task in catch block");
    }
  }
  
  
  
  
  
  return (
    <div>  
      <Navbar/>
      <div className="task-main-container">
        <h1 className='task-heading'> Create Task </h1>
          <form  className='task-form-data'  onSubmit={handleSubmit} >
             <input type="text" 
                    name="title"
                    placeholder='Title'
                    required
                    value={task.title}
                    onChange={handleChange}
             />
             <textarea type="text" 
                       name="description"
                       placeholder='Description'
                       required
                       value={task.description}
                       onChange={handleChange}
                       rows={7}
             />
             <select name="status" type="text" placeholder="status" value={task.status} onChange={handleChange}>
                  <option>Status</option>
                  <option>completed</option>
                  <option>in-progress</option>
                  <option>archived</option>
                  <option>pending</option>
             </select>
             <button type="submit" className='task-create-btn'>
              Add Task
             </button>     
          </form>
      </div>
      
    </div>
  )
}

export default CreateTask
