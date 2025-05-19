import React from 'react';
import './ViewToggle.css';
import postit from '../assets/postit.png';
import calendar from '../assets/calendar.png';
import tasks from '../assets/tasks.png';

const ViewToggle = ({ currentView, onChangeView }) => {
  return (
    <div className="toggle-switch">
      <div className={`slider ${currentView}`} />
      
      <img
        onClick={() => onChangeView('tasks')}
        src={tasks}
        alt="Tasks"
        title='Card View'
        style={currentView === 'tasks' ? { borderBottom:'solid 1px', transform:'scale(1.4)' } : {}}
      />
      
      <img
        onClick={() => onChangeView('kanban')}
        src={postit}
        alt="Kanban"
        title='Kanban View'
        style={currentView === 'kanban' ? { borderBottom:'solid 1px', transform:'scale(1.4)' } : {}}
      />
      
      <img
        onClick={() => onChangeView('calendar')}
        src={calendar}
        alt="Calendar"
        title='Calender View'
        style={currentView === 'calendar' ? { borderBottom:'solid 1px', transform:'scale(1.4)' } : {}}
      />
    </div>
  );
};

export default ViewToggle;
