import React, { useState } from 'react';

const LogoutModal = ({ show, onHide, onConfirm, workMode }) => {
  if (!show) return null;

  const [tasksCompleted, setTasksCompleted] = useState('');
  const [salesOutreach, setSalesOutreach] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ tasksCompleted, salesOutreach });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={onHide}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-3">
            <i className="fa-solid fa-clock-rotate-left text-blue-600"></i> 
            Final Clock Out
          </h2>
          <button 
            onClick={onHide}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
            <p className="text-sm font-bold text-red-800 flex items-center gap-2">
              <i className="fa-solid fa-circle-info"></i>
              Action Required
            </p>
            <p className="text-xs text-red-600 mt-1 font-medium">
              You are currently clocked in. Please summarize your daily progress to finalize your session and logout.
            </p>
          </div>

          <form onSubmit={handleSubmit} id="logout-form" className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Tasks Completed Today</label>
              <textarea 
                placeholder="What did you achieve today?" 
                value={tasksCompleted}
                onChange={(e) => setTasksCompleted(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 min-h-[140px] transition-all"
                required
              />
            </div>
            
            {(workMode === 'Office' || workMode === 'Work from home') && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Sales Outreach (Count)</label>
                <input 
                  type="number" 
                  min="0"
                  value={salesOutreach}
                  onChange={(e) => setSalesOutreach(parseInt(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 transition-all"
                  required
                />
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-5 flex items-center justify-end gap-3">
          <button 
            onClick={onHide} 
            className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="logout-form" 
            className="bg-gray-900 hover:bg-black text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-gray-200 transition-all active:scale-95"
          >
            Submit & Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
