import React, { useState, useEffect } from 'react';
import { clockIn, clockOut, getActiveTimesheet, fetchTimesheets } from '../services/timesheetService';

const TimesheetView = ({ currentUser, companyId, employeeName, isAdmin }) => {
  const [activeSession, setActiveSession] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [filterUID, setFilterUID] = useState('all');

  // Form states
  const [workMode, setWorkMode] = useState('Office');
  const [tasksPlanned, setTasksPlanned] = useState('');
  const [tasksCompleted, setTasksCompleted] = useState('');
  const [salesOutreach, setSalesOutreach] = useState(0);

  useEffect(() => {
    if (currentUser && companyId) {
      loadData();
      if (isAdmin) {
        loadEmployees();
      }
    }
  }, [currentUser, companyId, isAdmin, filterUID]);

  const loadEmployees = async () => {
    const { fetchAllEmployees } = await import('../services/getEmployeeDetails');
    const empList = await fetchAllEmployees(companyId);
    setEmployees(empList);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [active, logs] = await Promise.all([
        getActiveTimesheet(companyId, currentUser),
        fetchTimesheets(companyId, filterUID === 'all' ? currentUser : filterUID, isAdmin && filterUID === 'all')
      ]);
      
      let filteredLogs;
      if (isAdmin) {
        const allLogs = await fetchTimesheets(companyId, null, true);
        filteredLogs = filterUID === 'all' ? allLogs : allLogs.filter(log => log.uid === filterUID);
      } else {
        filteredLogs = await fetchTimesheets(companyId, currentUser, false);
      }

      setActiveSession(active);
      setHistory(filteredLogs);
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = { workMode, tasksPlanned, salesOutreach: 0 };
      await clockIn(companyId, currentUser, employeeName, data);
      await loadData();
      setTasksPlanned('');
    } catch (err) {
      alert("Clock-in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClockOut = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = { tasksCompleted, salesOutreach };
      await clockOut(companyId, activeSession.id, data);
      await loadData();
      setTasksCompleted('');
      setSalesOutreach(0);
    } catch (err) {
      alert("Clock-out failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-500 font-medium animate-pulse">
      <i className="fa-solid fa-spinner fa-spin mr-3"></i> Loading Timesheets...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <i className="fa-solid fa-clock-rotate-left text-blue-600"></i> 
          Timesheet Management
        </h1>
        <p className="mt-2 text-sm text-gray-500">Track your daily work hours and sales activities efficiently.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" style={{marginTop:'20px'}}>
        
        {/* Action Panel (Clock In/Out) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
          {!activeSession ? (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-blue-500 px-6 py-4">
                <h2 className="text-white text-lg font-bold flex items-center gap-2" style={{color:'white'}}>
                  <i className="fa-solid fa-right-to-bracket" style={{color:'white'}}></i> Clock In
                </h2>
              </div>
              <form onSubmit={handleClockIn} className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 block">Work Mode</label>
                  <select 
                    value={workMode} 
                    onChange={(e) => setWorkMode(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 transition-all"
                  >
                    <option value="Office">Office</option>
                    <option value="Work from home">Work from home</option>
                    <option value="Field Work">Field Work</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 block">Planned Tasks</label>
                  <textarea 
                    placeholder="What's your goal for today?" 
                    value={tasksPlanned}
                    onChange={(e) => setTasksPlanned(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 min-h-[120px] transition-all"
                    required
                  />
                </div>
                <button style={{marginTop:'10px',color:'white'}}
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-blue-500 hover:bg-white-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Processing...' : 'Clock In Now'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 overflow-hidden">
              <div className="bg-green-600 px-6 py-3 flex justify-between items-center">
                <span className="text-[10px] font-black text-white tracking-widest uppercase bg-green-700 px-2 py-1 rounded">Active Session</span>
                <h2 className="text-white text-lg font-bold flex items-center gap-2">
                  <i className="fa-solid fa-clock"></i> Live
                </h2>
              </div>
              <div className="p-6 border-b border-gray-50 bg-blue-50/30">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-2 rounded-lg bg-white shadow-sm border border-blue-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Mode</p>
                    <p className="text-sm font-bold text-blue-700">{activeSession.workMode}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white shadow-sm border border-blue-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Started</p>
                    <p className="text-sm font-bold text-blue-700">
                      {new Date(activeSession.loginTime?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
              <form onSubmit={handleClockOut} className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 block">Tasks Completed</label>
                  <textarea 
                    placeholder="List your accomplishments..." 
                    value={tasksCompleted}
                    onChange={(e) => setTasksCompleted(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-green-500 focus:border-green-500 block p-3 min-h-[120px] transition-all"
                    required
                  />
                </div>
                {(activeSession.workMode === 'Office' || activeSession.workMode === 'Work from home') && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 block">Sales Outreach (Count)</label>
                    <input 
                      type="number" 
                      min="0"
                      value={salesOutreach}
                      onChange={(e) => setSalesOutreach(parseInt(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-green-500 focus:border-green-500 block p-3 transition-all"
                      required
                    />
                  </div>
                )}
                <button style={{color:'white',marginTop:'20px'}}
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg shadow-gray-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Processing...' : 'Finish & Clock Out'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* History Panel (Records Table) */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                 <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                   <i className="fa-solid fa-list-check text-blue-500"></i> 
                   {isAdmin ? 'Performance Logs' : 'Recent Activities'}
                 </h2>
                 <p className="text-xs text-gray-400 mt-1">Review your past work and productivity metrics.</p>
               </div>
               <div className="flex items-center gap-3">
                {isAdmin && (
                  <select 
                    className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 transition-all outline-none"
                    value={filterUID} 
                    onChange={(e) => setFilterUID(e.target.value)}
                  >
                    <option value="all">All Employees</option>
                    {employees.map(emp => (
                      <option key={emp.uid} value={emp.uid}>{emp.empName}</option>
                    ))}
                  </select>
                )}
                {isAdmin && <span className="bg-yellow-100 text-yellow-800 text-[10px] font-black px-2 py-1 rounded uppercase">Admin</span>}
               </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-gray-400 uppercase bg-gray-50/50 font-black tracking-wider">
                  <tr>
                    {isAdmin && <th className="px-6 py-4">Staff</th>}
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Mode</th>
                    <th className="px-6 py-4">Login</th>
                    <th className="px-6 py-4">Logout</th>
                    <th className="px-6 py-4">Sales</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={isAdmin ? 7 : 6} className="px-6 py-12 text-center text-gray-400 font-medium">
                        <i className="fa-solid fa-folder-open block text-3xl mb-3 opacity-20"></i>
                        No timesheet records found
                      </td>
                    </tr>
                  ) : (
                    history.map(log => (
                      <tr key={log.id} className="hover:bg-blue-50/20 transition-colors group">
                        {isAdmin && <td className="px-6 py-4 font-bold text-blue-600">{log.empName}</td>}
                        <td className="px-6 py-4 text-gray-600">{log.date}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded shadow-sm
                            ${log.workMode === 'Work from home' ? 'bg-teal-50 text-teal-700 border border-teal-100' : 
                              log.workMode === 'Office' ? 'bg-slate-100 text-slate-700 border border-slate-200' : 
                              'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                            {log.workMode}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-medium">
                          {log.loginTime ? new Date(log.loginTime.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-medium">
                          {log.logoutTime ? new Date(log.logoutTime.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded-full text-xs">
                            {log.salesOutreach || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded
                            ${log.status === 'active' ? 'bg-green-100 text-green-700 animate-pulse' : 'bg-gray-100 text-gray-400'}`}>
                            {log.status === 'active' ? '● Live' : 'Done'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimesheetView;
