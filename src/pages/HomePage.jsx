import React, { useEffect, useState } from 'react'
import TaskView from '../components/TaskView'
import TimesheetView from '../components/TimesheetView'
import getCurrentUserID from '../services/getUserID'
import { getCompanyDetails, ifAdmin } from '../services/getEmployeeDetails'
import NavBar from '../components/NavBar'

const HomePage = () => {
  const [currentUser, setCurrentUser] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [companyId, setCompanyId] = useState()
  const [employeeName, setEmployeeName] = useState()
  const [companyName, setCompanyName] = useState()
  const [logoLink, setLogoLink] = useState('')
  const [activeView, setActiveView] = useState('timesheet')

  useEffect(() => {
    const fetchUser = async () => {
      const userRef = await getCurrentUserID()
      setCurrentUser(userRef)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchDetails = async () => {
      const companyData = await getCompanyDetails(currentUser)
      setCompanyId(companyData.companyId)
      setCompanyName(companyData.companyName)
      setEmployeeName(companyData.employeeName)
      setLogoLink(companyData.logo)
    }
    if (currentUser) fetchDetails()
  }, [currentUser])

  useEffect(() => {
    const checkAdmin = async () => {
      const result = await ifAdmin(currentUser)
      setIsAdmin(!!result)
    }
    if (currentUser) checkAdmin()
  }, [currentUser])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar 
        employeeName={employeeName} 
        companyName={companyName} 
        currentUser={currentUser} 
        companyId={companyId} 
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col">
        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center -mb-px pt-4">
              <div className="flex bg-gray-100 p-1 rounded-xl gap-1 mb-4 sm:mb-0">
                <button
                  onClick={() => setActiveView('timesheet')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200
                    ${activeView === 'timesheet' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <i className="fa-solid fa-clock"></i>
                  Timesheet
                </button>
                <button
                  onClick={() => setActiveView('tasks')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200
                    ${activeView === 'tasks' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <i className="fa-solid fa-list-check"></i>
                  Tasks
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* View Content */}
        <div className="flex-1 overflow-auto bg-[#fcfcfc]">
          <div className="max-w-7xl mx-auto w-full">
            {activeView === 'timesheet' ? (
              <TimesheetView
                currentUser={currentUser}
                companyId={companyId}
                employeeName={employeeName}
                isAdmin={isAdmin}
              />
            ) : (
              <div className="p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <TaskView
                  logoLink={logoLink}
                  currentUser={currentUser}
                  companyName={companyName}
                  isAdmin={isAdmin}
                  companyId={companyId}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage