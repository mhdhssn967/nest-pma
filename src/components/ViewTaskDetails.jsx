import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import './viewTaskDetails.css'
import { resetTaskDates, updateTaskCompletedOn, updateTaskRemarks, updateTaskStartedOn, updateTaskStatus } from '../services/updateData';
import confetti from 'canvas-confetti';
import completed from '../assets/completed.png'
import getCurrentUserID from '../services/getUserID';
import { deleteTask } from '../services/deleteTask';
import { Await } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
const adminId = import.meta.env.VITE_ADMIN_ID




const ViewTaskDetails = ({ task: initialTask, onClose, triggerRefresh, setTriggerRefresh, companyId, isAdmin }) => {
  
  const [task, setTask] = useState(initialTask);
  const [editRemarks, setEditRemarks] = useState(false)
  const [newRemarks, setNewRemarks] = useState('')
  const [user, setUser] = useState()

  const fireConfetti = () => {
    confetti({
      particleCount: 250,
      spread: 100,
      origin: { y: .7 },
      scalar: 1.2,
      startVelocity: 50,
    });
  };

  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      await deleteTask(taskId,companyId);
      onClose();
      setTriggerRefresh(!triggerRefresh);
    } catch (err) {
      console.log("Failed to delete task:", err);
    }
  };



  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUserID();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    setTask(initialTask); // Update local task state when the prop changes
  }, [initialTask]);

  
  const handleUpdateStatus = async (taskId, nextStatus) => {
    try {
      const prevStatus = task.status;
  
      await updateTaskStatus(companyId, taskId, nextStatus);
  
      // Fire confetti if task completed
      if (nextStatus === 'Completed') {
        await updateTaskCompletedOn(companyId,taskId);
        fireConfetti();
      }
  
      // Update startedOn if moving from To do → In Progress
      if (nextStatus === 'In Progress' && prevStatus === 'To do') {
        await updateTaskStartedOn(companyId,taskId);
      }
      if (nextStatus === 'To do' ) {
        await resetTaskDates(companyId,taskId);
      }
  
      // Fetch latest task data from Firebase
      const taskRef = doc(db,"userData",companyId, "tasks", taskId);
      const updatedDoc = await getDoc(taskRef);
      if (updatedDoc.exists()) {
        setTask({ id: taskId, ...updatedDoc.data() });
      }
  
      // Trigger refresh for parent state if necessary
      setTriggerRefresh(!triggerRefresh);
      
    } catch (err) {
      console.log('Error updating status:', err);
    }
  };
  

  const handleUpdateRemarks = async (taskId, nextRemark) => {
    try {
      await updateTaskRemarks(companyId, taskId, nextRemark)
      
      setTriggerRefresh(!triggerRefresh)
    } catch (e) {
      console.log(e);
    }
  }

  if (!task) return null;

  return ReactDOM.createPortal (
    <div className='view-overlay'>
      <div className='view-container'>
  
        <div className='view-head'>
          <h1 className='view-title'>Task Details</h1>
          <button onClick={onClose} className='btn-close'><i className='fa-solid fa-close'></i></button>
        </div>
  
        <div className='task-details-card'>
          <h2 className='task-heading'>
            <i className="fa-solid fa-thumbtack"></i> {task.taskName}
          </h2>
  
          <div className='task-meta'>
            <div className='meta'>
              <p>
                <strong><i className="fa-regular fa-calendar-plus"></i> Assigned On</strong>
                <span>: {new Date(task.createdAt.seconds * 1000).toLocaleDateString()}</span>
              </p>
  
              <p>
                <strong><i className="fa-solid fa-bars-progress"></i> Status</strong>
                <span>: {task.status}</span>
              </p>
  
              <p>
                <strong><i className="fa-solid fa-circle-play"></i> Started on</strong>
                <span>
                  : {task.startedOn
                    ? new Date(task.startedOn.seconds * 1000).toLocaleDateString()
                    : 'Not Started yet'}
                </span>
              </p>
            </div>
  
  
            <div className='meta'>
              <p>
                <strong>
                  <i className="fa-regular fa-calendar-days"></i> Due On
                </strong>
                <span>: {task.dueDate || 'Undated'}</span>
              </p>
              <p>
                <strong>
                  <i
                    className="fa-solid fa-bolt"
                    style={{
                      color:
                        task.priority === "high"
                          ? "red"
                          : task.priority === "medium"
                            ? "orange"
                            : task.priority === "low"
                              ? "green"
                              : "black"
                    }}
                  ></i> Priority
                </strong>
                <span>: {task.priority || "No Priority"}</span>
              </p>
  
              <p>
                <strong><i className="fa-solid fa-flag-checkered"></i> Finished on</strong>
                <span>
                  : {task.completedOn
                    ? new Date(task.completedOn.seconds * 1000).toLocaleDateString()
                    : 'Not completed yet'}
                </span>                        </p>
            </div>
            </div>
  
            {/* Remarks */}
            <p style={{ display: 'flex', alignItems: 'center' }}>
              <strong><i className="fa-solid fa-square-pen"></i>Remarks : </strong>
              {!editRemarks ?
                (<span className='remarkText'> {newRemarks || 'No remarks'}</span>) :
  
                <input className='edit-remarks-input' type="text" value={newRemarks}
                  onChange={(e) => setNewRemarks(e.target.value)}
                  placeholder='Add Remarks'
                />}
              {!editRemarks ?
                (<i
                  style={{ marginLeft: '20%', fontSize: '20px' }}
                  className="fa-solid fa-pen-to-square edit-remarks"
                  onClick={() => { setNewRemarks(task.remarks || ''); setEditRemarks(true) }}
                ></i>) :
                (<div style={{ display: 'flex' }}>
                  <i
                    style={{ marginLeft: '40%', fontSize: '25px' }}
                    className="fa-solid fa-square-check edit-remarks"
                    onClick={() => { setEditRemarks(false); handleUpdateRemarks(task.id, newRemarks) }}
                  ></i>
                  <i
                    style={{ marginLeft: '50%', fontSize: '24px' }}
                    className="fa-solid fa-circle-xmark edit-remarks"
                    onClick={() => { setEditRemarks(false) }}
                  ></i>
                </div>)
              }
            </p>
         
  
          <div className='task-description'>
            <h3><i className="fa-regular fa-clipboard"></i> Description</h3>
            <p>{task.description}</p>
          </div>
  
          <div className='meta-buttons'>
  
  
            {/* Admin Fucntions */}
            {isAdmin &&
              <div>
                {task.status != 'Pending' && (
                  <button className='pending-btn meta-btn' onClick={() => handleUpdateStatus(task.id, 'Pending')}>
                    <i className="fa-solid fa-hourglass-end"></i> Mark As Pending
                  </button>
                )}
                <button className='cancel-btn meta-btn' onClick={() => handleDeleteTask(task.id)}>
                  <i className="fa-solid fa-xmark"></i> Cancel Task
                </button>
                {task.status=='Completed'&&<img className='completeImg' src={completed} alt="" />}
              </div>
            }
  
            {/* Start Task */}
            {!isAdmin &&
              <div>
                {task.status === 'To do' && (
                  <button className='start-btn meta-btn' onClick={() => handleUpdateStatus(task.id, 'In Progress')}>
                    <i className="fa-solid fa-play"></i> Start Task
                  </button>
                )}
                {/* Put on hold */}
                {task.status === 'In Progress' && (
                  <>
                    <button className='hold-btn meta-btn' onClick={() => handleUpdateStatus(task.id, 'On hold')}>
                      <i className="fa-solid fa-pause"></i> Put on Hold
                    </button>
                    <button className='complete-btn meta-btn' onClick={() => handleUpdateStatus(task.id, 'Completed')}>
                      <i className="fa-solid fa-check"></i> Mark as Complete
                    </button>
                  </>
                )}
                {/* Resume Task */}
  
                {task.status === 'On hold' && (
                  <>
                    <button className='resume-btn meta-btn' onClick={() => handleUpdateStatus(task.id, 'In Progress')}>
                      <i className="fa-solid fa-play"></i> Resume Task
                    </button>
                    <button className='complete-btn meta-btn' onClick={() => handleUpdateStatus(task.id, 'Completed')}>
                      <i className="fa-solid fa-check"></i> Mark as Complete
                    </button>
                  </>
                )}
                {/* pending */}
                {task.status === 'Pending' && (
                  <>
                    <button className='resume-btn meta-btn' onClick={() => handleUpdateStatus(task.id, 'In Progress')}>
                      <i className="fa-solid fa-play"></i> Resume Task
                    </button>
                  </>
                )}
                {/* completed */}
                {task.status === 'Completed' && (
                  <>
                    <img className='completeImg' src={completed} alt="" />
                    <button className='reopen-btn meta-btn' onClick={() => handleUpdateStatus(task.id, 'To do')}>
                      <i className="fa-solid fa-repeat"></i> Re-open Task
                    </button>
                  </>
                )}
              </div>}
          </div>
  
  
  
  
  
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default ViewTaskDetails;
