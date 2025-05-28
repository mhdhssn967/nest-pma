import React, { useEffect, useState } from 'react'
import './TaskFilters.css'
import getCurrentUserID from '../services/getUserID'
import getEmployeeDetails from '../services/getEmployeeDetails'
const adminId = import.meta.env.VITE_ADMIN_ID

const TaskFilters = ({setStatusFilter, setSearchText, setFilterEmployee, setPriorityFilter}) => {
  

  const [selected, setSelected] =useState('')
  const [user, setUser]=useState()
  const [employees, setEmployees]=useState([])
  const [prioritySelected,setPrioritySelected]=useState({high:false,medium:false,low:false})
  

  const handlePriority = (priority) => {
    setPriorityFilter((prev) => {
      const newFilter = prev === priority ? 'All' : priority;
  
      if (newFilter === 'high') {
        setPrioritySelected({ high: true, medium: false, low: false });
      } else if (newFilter === 'medium') {
        setPrioritySelected({ high: false, medium: true, low: false });
      } else if (newFilter === 'low') {
        setPrioritySelected({ high: false, medium: false, low: true });
      } else {
        setPrioritySelected({ high: false, medium: false, low: false });
      }
  
      return newFilter;
    });
  };
  
  
  
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUserID();
      setUser(currentUser);
    };
    fetchUser();
  }, []);
  
  useEffect(()=>{
    const fetchAllEmployees=async()=>{
      const allEmployess=await getEmployeeDetails()
      setEmployees(allEmployess.filter(data => data.userName !== 'admin')
      .map(data => data.userName))
    };fetchAllEmployees()
  },[])

  return (
    <>
<div style={{display:'flex',alignItems:'center',margin:'auto 2%'}} className='search-div'>
<i className="fa-solid fa-magnifying-glass" ></i>
  <input onChange={(e)=>setSearchText(e.target.value)} className='search-box' type="text" style={{width:'400px'}} placeholder='Search Tasks'/>
</div>

    {/* Chips */}
  
          <div className="filter-chips">
    {['All', 'To do', 'Pending', 'In Progress','On hold', 'Completed'].map(status => (
      <button 
        key={status} 
        className={`chip ${selected === status ? 'active' : ''}`} 
        onClick={() => {setSelected(status);setStatusFilter(status)}}
      >
        {status}
      </button>
    ))}
    
  </div>

  <div >
  {/* Set priority filter */}
  <div className='priority-filter'>
    <h4>Priority</h4>
      <div title='High' style={prioritySelected.high?{filter:'drop-shadow(0px 0px 4px red)',transform:'scale(1.1)',background:'linear-gradient(to bottom right, white, red)',background: 'linear-gradient(to bottom right, red 30%, white)'}:{}} className='high-priority priority-light' onClick={()=>handlePriority('high')}></div>
      <div title='Medium' style={prioritySelected.medium?{filter:'drop-shadow(0px 0px 4px orange)',transform:'scale(1.1)',background: 'linear-gradient(to bottom right, orange 30%, white)'}:{border:'none'}} className='medium-priority priority-light' onClick={()=>handlePriority('medium')}></div>
      <div title='Low' style={prioritySelected.low?{filter:'drop-shadow(0px 0px 4px rgb(66, 201, 12))',transform:'scale(1.1)',background: 'linear-gradient(to bottom right, green 30%, white)'}:{border:'none'}} className='low-priority priority-light' onClick={()=>handlePriority('low')}></div>
  </div>
        </div>

{/* Employee filter */}
{user==adminId&&
  <div className='filterEmployee'>
    <select name="" id="" onChange={(e)=>setFilterEmployee(e.target.value)}>
      <option value="All" defaultValue>All</option>
      {employees.map((employee)=>
      <option value={employee}>{employee}</option>)
      }
    </select>
  </div>}


    </>
  )
}

export default TaskFilters