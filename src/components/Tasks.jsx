import React, { useEffect, useState } from 'react'
import './tasks.css'
import ViewTaskDetails from './ViewTaskDetails';

const highlightText = (text, searchText) => {
  if (!searchText) return text;
  const regex = new RegExp(`(${searchText})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
};

const Tasks = ({ displayTasks, setTriggerRefresh, triggerRefresh, searchText, companyId, isAdmin }) => {
  
  const [tasks, setTasks] = useState([]);
  const [viewDetails, setViewDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {    
    setTasks(displayTasks);
  }, [displayTasks]);

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

      <div className='allTasks'>
        <div>
          {tasks&&
          tasks.length > 0 ? (
            tasks.map((task, index) => (
              <div
                className='card'
                key={index}
                onClick={() => {
                  setSelectedTask(task);
                  setViewDetails(true);
                }}
              >
                <h3 style={{ width: '200px' }}>
                  {new Date(task.createdAt.seconds * 1000).toLocaleString()}
                </h3>

                <div className='taskCard'>
                  <div
                    className='priority'
                    style={{
                      backgroundColor:
                        task.priority === 'high'
                          ? 'red'
                          : task.priority === 'medium'
                          ? 'orange'
                          : task.priority === 'low'
                          ? 'rgb(66, 201, 12)'
                          : 'black',
                    }}
                  ></div>

                  <h3 className='taskHeading'>
                    <i className="fa-solid fa-thumbtack"></i>{' '}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightText(task.taskName || '', searchText),
                      }}
                    />
                  </h3>

                  <div className='t1'>
                    <h3>
                      <i className="fa-solid fa-user"></i> {task.assignee}
                    </h3>
                    <h3>
                      <i className="fa-solid fa-bars-progress"></i> {task.status}
                    </h3>
                    <h3>
                      <i
                        className="fa-solid fa-bolt"
                        style={{
                          color:
                            task.priority === 'high'
                              ? 'red'
                              : task.priority === 'medium'
                              ? 'orange'
                              : task.priority === 'low'
                              ? 'rgb(66, 201, 12)'
                              : 'inherit',
                        }}
                      ></i>{' '}
                      {task.priority || 'No priority'}
                    </h3>
                  </div>

                  <h3>
                    <i className="fa-solid fa-square-pen"></i>{' '}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightText(task.remarks || 'No remarks added', searchText),
                      }}
                    />
                  </h3>

                  <h3 className='description'>
                    <i className="fa-regular fa-clipboard"></i>{' '}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightText(task.description || '', searchText),
                      }}
                    />
                  </h3>
                </div>

                <h3 className='due-date' style={{ width: '200px',marginLeft:'5%' }}>{task.dueDate || 'Undated'}</h3>
              </div>
            ))
          ) : (
            <h3>No Tasks exist!!!</h3>
          )}
        </div>
      </div>
    </>
  );
};

export default Tasks;
