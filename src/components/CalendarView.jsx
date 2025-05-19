import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './CalendarView.css';
import ViewTaskDetails from './ViewTaskDetails';

const CalendarView = ({ displayTasks, setTriggerRefresh, triggerRefresh, searchText, companyId, isAdmin }) => {
  
  const [viewDetails, setViewDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'To do':
        return '#88baf3';
      case 'In Progress':
        return '#f5e093';
      case 'Completed':
        return '#76eea0';
      case 'On hold':
        return '#e0b4fa';
      case 'Pending':
        return '#f58b8b';
      default:
        return '#95a5a6'; // Gray
    }
  };

  const events = displayTasks
  .filter((task) => task.dueDate)
  .map((task) => ({
    title: task.taskName,
    date: task.dueDate,
    id: task.id,
    backgroundColor: getStatusColor(task.status),
    borderColor: getStatusColor(task.status),
    textColor: '#fff',
    extendedProps: {
      fullTask: task 
    }
  }));


  const handleEventClick = (info) => {
    const task = info.event.extendedProps.fullTask; // 👈 Get the full task object
    setSelectedTask(task);
    setViewDetails(true);
  };
  

  return (
    <>
    {viewDetails && selectedTask && (
            <div className="view-details-modal">
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
       <div className='calendar-container'>
            <div className="calendar-wrapper">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: '',
                  center: 'title',
                }}
                events={events}
                eventClick={handleEventClick}
                height="auto"
              />
        
              <div className="calendar-legend">
                <span style={{ backgroundColor: '#88baf3' }}>To Do</span>
                <span style={{ backgroundColor: '#f5e093' }}>In Progress</span>
                <span style={{ backgroundColor: '#76eea0' }}>Completed</span>
                <span style={{ backgroundColor: '#e0b4fa' }}>On Hold</span>
                <span style={{ backgroundColor: '#f58b8b' }}>Pending</span>
              </div>
            </div>
       </div>
    </>
  );
};

export default CalendarView;
