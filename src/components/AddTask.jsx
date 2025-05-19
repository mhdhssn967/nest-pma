import React, { useEffect, useState } from 'react';
import './addTask.css';
import saveTasks from '../services/saveTasks';
import { fetchAllEmployees } from '../services/getEmployeeDetails';


const AddTask = ({ show, onHide, setTriggerRefresh, triggerRefresh, currentUser }) => {

  if (!show) return null;
  const [tasks, setTasks] = useState({ userID: '', taskName: '', priority: 'low', assignee: '', status: 'To do', dueDate: '', description: '', remarks: '' })

  const [empDetails, setEmpDetails] = useState([]);
  console.log(empDetails);


  const handleSubmit = async (e) => {
    await saveTasks(tasks, e, currentUser)
    onHide()
    console.log("New task added succesfully");
    setTriggerRefresh(!triggerRefresh)
  }

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await fetchAllEmployees(currentUser);
      setEmpDetails(allUsers)
    };

    fetchUsers();
  }, [triggerRefresh, currentUser]);

  return (
    <div className="custom-modal">
      <div className="custom-modal-header">
        <h2>Assign a New Task</h2>
        <span className="close-button" onClick={onHide}>
          <i className="fa-solid fa-close"></i>
        </span>
      </div>

      <div className="custom-modal-body">
        <form className="task-form" >
          <div className='formInputs'>
            <div className='formInner'>
              <label>
                <p><i className="fa-solid fa-thumbtack"></i> Task Name</p>
                <input type="text" name="taskName" placeholder="Enter task name" onChange={(e) => setTasks({ ...tasks, taskName: e.target.value })} />
              </label>

              <label>
                <p><i className="fa-solid fa-user"></i> Assigned To</p>
                <select
                  name="assignedTo"
                  value={tasks.userID}
                  onChange={(e) => {
                    const selectedUID = e.target.value;
                    const selectedUser = empDetails.find(user => user.uid === selectedUID);

                    if (selectedUser) {
                      setTasks({
                        ...tasks,
                        assignee: selectedUser.empName,
                        userID: selectedUser.uid
                      });
                    }
                  }}
                >

                  <option value="" disabled>Select Employee</option>
                  {empDetails && empDetails.map((details) => (
                    <option key={details.uid} value={details.uid}>
                      {details.empName}
                    </option>
                  ))}
                </select>


              </label>
            </div>

            <div className='formInner'>
              <label>
                <p><i className="fa-solid fa-bolt"></i> Priority</p>
                <select name="priority" onChange={(e) => setTasks({ ...tasks, priority: e.target.value })}>
                  <option value="">Select</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </label>

              <label>
                <p> <i style={{ color: '#456eef' }} className="fa-solid fa-calendar-week"></i> Due Date</p>
                <input type="date" name="dueDate" onChange={(e) => setTasks({ ...tasks, dueDate: e.target.value })} />
              </label>
            </div>

          </div>
          <label>
            <p><i className="fa-regular fa-clipboard"></i> Task Description</p>
            <textarea name="description" placeholder="Describe the task" onChange={(e) => setTasks({ ...tasks, description: e.target.value })}></textarea>
          </label>
        </form>
      </div>

      <div className="custom-modal-footer">
        <button onClick={onHide}>Cancel</button>
        <button className="save-button" onClick={(e) => handleSubmit(e)}>Assign Task</button>
      </div>
    </div>

  );
};

export default AddTask;
