import React, { useEffect, useState } from 'react'
import './taskView.css'
import Tasks from './Tasks'
import AddTask from './AddTask'
import { getAllTasks, getAllTasksForAdmin, getTasksForUser } from '../services/fetchTasks'
import { useFormState } from 'react-dom'
import getCurrentUserID from '../services/getUserID'
import KanbanView from './KanbanView'
import TaskFilters from './TaskFilters'
import { filterDataByEmployee, filterDataByPriority, filterDataBySearch, filterDataByStatus } from '../helpers/filterData'
import CalendarView from './CalendarView'
import ViewToggle from './ViewToggle'



const TaskView = ({isAdmin, currentUser, companyId, companyName, logoLink}) => {

  
    const [modalShow, setModalShow] = useState(false);
    const [allTasks, setAllTasks] = useState([])   
    const [toggleView, setToggleView]=useState('tasks') //State for switiching view
    const [triggerRefresh, setTriggerRefresh]=useState(false)
    const [displayTasks, setDisplayTasks] = useState([])
    const [statusFilter, setStatusFilter] = useState('All')  
    const [searchText, setSearchText]=useState('')  
    const [filterEmployee, setFilterEmployee]=useState('All')
    const [priorityFilter, setPriorityFilter]=useState('All')
    const [user,setUser]=useState()  

    console.log(logoLink);
    

    
    // useEffect(() => { 
    //  const interval = setInterval(() => {
    //     setTriggerRefresh(prev => !prev);
    //   }, 100);
    
    //   return () => clearInterval(interval);
    // }, []); //No idea whytf I did this
    
    
   
    
    useEffect(() => {
      let filteredTasks = [...allTasks];
      
      if (statusFilter) {
        filteredTasks = filterDataByStatus(filteredTasks, statusFilter);
      }
    
      if (searchText) {
        filteredTasks = filterDataBySearch(filteredTasks, searchText);
      }
    
      if (filterEmployee) {
        filteredTasks = filterDataByEmployee(filteredTasks, filterEmployee);
      }

      if (priorityFilter) {
        filteredTasks = filterDataByPriority(filteredTasks, priorityFilter);
      }
    
      setDisplayTasks(filteredTasks);
    }, [ statusFilter, searchText, filterEmployee, priorityFilter]);
    
  
    useEffect(() => {
        const fetchUser = async () => {
          const currentUser = await getCurrentUserID();
          setUser(currentUser);
          
    
          if (!currentUser) {
            navigate("/login"); // Redirect if not logged in
          }
        };
    
        fetchUser();
      }, []);
    
      useEffect(() => {
        const fetchTasks = async () => {    
          console.log(isAdmin, currentUser, companyId);
            
         const tasksRef=await getAllTasks(isAdmin, currentUser, companyId)   
         setAllTasks(tasksRef)
         setDisplayTasks(tasksRef)
        };
        fetchTasks();
      }, [user,triggerRefresh,isAdmin,companyId]);
      

    return (
        <>
        <AddTask currentUser={currentUser} show={modalShow} onHide={() => setModalShow(false)} setTriggerRefresh={setTriggerRefresh} triggerRefresh={triggerRefresh} isAdmin={isAdmin}/>
            <div className='taskView' style={modalShow?{filter:'brightness(0.5)'}:{filter:'brightness(1)'}}>
                  <h2 className='company-name'>  {companyName}</h2>
                <div className='taskHead'>
                    <div className='taskheadLeft'>
                      <i className="fa-solid fa-list-check"></i>
                      <h1>Tasks</h1>
                      {isAdmin&&
                          <div style={{marginLeft:'10px'}}>
                          <i onClick={() => setModalShow(true)} title='Add a new task' className="fa-solid fa-square-plus"></i>
                      </div>}
                    </div>
                           {/* Filters */}
                <TaskFilters setStatusFilter={setStatusFilter} setSearchText={setSearchText} setFilterEmployee={setFilterEmployee} setPriorityFilter={setPriorityFilter}/>
                {/* <img width={'50px'} src={calendar} alt="" />  */}

                </div> 
                <ViewToggle currentView={toggleView} onChangeView={setToggleView} />

                <hr />
                

               {toggleView=='tasks'&& <div className='cardHead'>
              <h3>Assigned On</h3>
          
                  <h3>Task</h3>
      
              <h3>
                  Due on
              </h3>
          </div>}
                {toggleView =='tasks'&&
                    <Tasks isAdmin={isAdmin} displayTasks={displayTasks} setTriggerRefresh={setTriggerRefresh} triggerRefresh={triggerRefresh} searchText={searchText} companyId={companyId}/>}
                {toggleView=='kanban' &&
                    <KanbanView isAdmin={isAdmin} statusFilter={statusFilter} displayTasks={displayTasks} setTriggerRefresh={setTriggerRefresh} triggerRefresh={triggerRefresh} companyId={companyId}/>}
                {toggleView=='calendar' &&<CalendarView isAdmin={isAdmin} displayTasks={displayTasks} setTriggerRefresh={setTriggerRefresh} triggerRefresh={triggerRefresh} searchText={searchText} companyId={companyId}/>} 
            </div>
        </>
    )
}

export default TaskView