import React, { useEffect, useState } from 'react';
import './KanbanView.css';
import { formatDate } from '../services/dateFormat';
import ViewTaskDetails from './ViewTaskDetails';

// Highlight matching search text
const highlightText = (text, searchText) => {
  if (!searchText) return text;
  const regex = new RegExp(`(${searchText})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
};

const KanbanView = ({ displayTasks, setTriggerRefresh, triggerRefresh, searchText, statusFilter, companyId, isAdmin }) => {
  console.log(statusFilter);
  
  const [tasks, setTasks] = useState([]);
  const [viewDetails, setViewDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    setTasks(displayTasks);
  }, [displayTasks]);

  const renderCard = (task, className) => (
    <div className={`${className}-card cards`} key={task.id} style={viewDetails?{zIndex:'-1'}:{zIndex:'1'}}
      onClick={() => {
        setSelectedTask(task);
        setViewDetails(true);
      }}>
      <h3>
        <strong dangerouslySetInnerHTML={{ __html: highlightText(task.taskName || '', searchText) }} />
      </h3>
      <p>
        <i className="fa-regular fa-calendar-days"></i>
        <span> Due on :</span> {task.dueDate ? formatDate(task.dueDate) : "No Due Date"}
      </p>
      <p>
        <i className="fa-solid fa-bolt"></i>
        <span> Priority :</span>
        <span dangerouslySetInnerHTML={{ __html: highlightText(task.priority || "None", searchText) }} />
      </p>
      
    </div>
  );

  return (
    <>
      {viewDetails && selectedTask && (
        <div className='view-details-modal'>
          <ViewTaskDetails
            task={selectedTask}
            onClose={() => setViewDetails(false)}
            setTriggerRefresh={setTriggerRefresh}
            triggerRefresh={triggerRefresh}
            companyId={companyId}
            isAdmin={isAdmin}
          />
        </div>
      )}

      <div className='kanban-container'>

        {/* To Do */}
        {(statusFilter=='To do'|| statusFilter=='All')&&<div className='to-do mainKanban' style={viewDetails?{zIndex:'-1'}:{zIndex:'1'}}>
          <h1>To do</h1>
          {
            tasks.filter(task => task.status === 'To do').length === 0 ? (
              <p className='to-do-card cards' style={{ color: 'black', fontStyle: 'italic', textAlign: 'center' }}>No tasks in progress</p>
            ) : (
              tasks.filter(task => task.status === 'To do').map(task => renderCard(task, 'to-do'))
            )
          }
        </div>}

        {/* In Progress */}
        {(statusFilter=='In Progress'|| statusFilter=='All')&&<div className='in-progress mainKanban'style={viewDetails?{zIndex:'-1'}:{zIndex:'1'}}>
          <h1>In Progress</h1>
          {
            tasks.filter(task => task.status === 'In Progress').length === 0 ? (
              <p className='in-progress-card cards' style={{ color: 'black', fontStyle: 'italic', textAlign: 'center' }}>No tasks in progress</p>
            ) : (
              tasks.filter(task => task.status === 'In Progress').map(task => renderCard(task, 'in-progress'))
            )
          }
        </div>}

        {/* On Hold */}
       {(statusFilter=='On hold'|| statusFilter=='All')&&<div className='on-hold mainKanban'style={viewDetails?{zIndex:'-1'}:{zIndex:'1'}}>
          <h1>On Hold</h1>
          {
            tasks.filter(task => task.status === 'On hold').length === 0 ? (
              <p className='on-hold-card cards' style={{ color: 'black', fontStyle: 'italic', textAlign: 'center' }}>No tasks on hold</p>
            ) : (
              tasks.filter(task => task.status === 'On hold').map(task => renderCard(task, 'on-hold'))
            )
          }
        </div>}

        {/* Pending */}
        {(statusFilter=='Pending'|| statusFilter=='All')&&<div className='pending mainKanban'style={viewDetails?{zIndex:'-1'}:{zIndex:'1'}}>
          <h1>Pending</h1>
          {
            tasks.filter(task => task.status === 'Pending').length === 0 ? (
              <p className='pending-card cards' style={{ color: 'black', fontStyle: 'italic', textAlign: 'center' }}>No pending tasks</p>
            ) : (
              tasks.filter(task => task.status === 'Pending').map(task => renderCard(task, 'pending'))
            )
          }
        </div>}

        {/* Completed */}
       {(statusFilter=='Completed'|| statusFilter=='All')&&<div className='completed mainKanban'style={viewDetails?{zIndex:'-1'}:{zIndex:'1'}}>
          <h1>Completed</h1>
          {
            tasks.filter(task => task.status === 'Completed').length === 0 ? (
              <p className='completed-card cards' style={{ color: 'black', fontStyle: 'italic', textAlign: 'center' }}>No completed tasks</p>
            ) : (
              tasks.filter(task => task.status === 'Completed').map(task => renderCard(task, 'completed'))
            )
          }
        </div>}

      </div>
    </>
  );
};

export default KanbanView;
