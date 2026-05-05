import React, { useEffect, useState } from 'react'
import logo from '../assets/OQ.png'
import getCurrentUserID from '../services/getUserID'
import getEmployeeDetails from '../services/getEmployeeDetails'
import { auth } from '../firebaseConfig'
import { getActiveTimesheet, clockOut } from '../services/timesheetService'
import LogoutModal from './LogoutModal'
import { useNavigate } from 'react-router-dom'

const NavBar = ({ employeeName, companyName, currentUser, companyId }) => {
  const navigate = useNavigate()

  const [user, setUser] = useState('')
  const [empDetails, setEmpDetails] = useState([])
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [activeSession, setActiveSession] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const currentID = await getCurrentUserID()
      const details = await getEmployeeDetails()

      setEmpDetails(details)
      const matched = details.find((emp) => emp.userID === currentID)
      if (matched) {
        setUser(matched.userName)
      }

      if (!currentID) {
        navigate("/login")
      }
    }

    fetchUser()
  }, [navigate])

  const handleLogoutClick = async () => {
    if (companyId && currentUser) {
      const active = await getActiveTimesheet(companyId, currentUser)
      if (active) {
        setActiveSession(active)
        setShowLogoutModal(true)
      } else {
        await proceedWithLogout()
      }
    } else {
      await proceedWithLogout()
    }
  }

  const proceedWithLogout = async () => {
    await auth.signOut()
    navigate('/login')
  }

  const handleConfirmClockOutAndLogout = async (data) => {
    try {
      await clockOut(companyId, activeSession.id, data)
      await proceedWithLogout()
    } catch (err) {
      alert("Clock-out failed during logout. Please try again.")
    }
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Left side: Logo & Company */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 p-2 rounded-lg">
                <img className="h-8 w-auto invert" src={logo} alt="Oqulix" />
              </div>
              <div className="hidden sm:block border-l border-gray-200 h-8 mx-2"></div>
              <span className="hidden sm:block text-gray-900 font-extrabold tracking-tight text-lg">
                {companyName || 'Nest TASK'}
              </span>
            </div>

            {/* Right side: User & Logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-2">
                  <i className="fa-solid fa-user text-sm"></i>
                </div>
                <span className="text-sm font-bold text-gray-700 max-w-[100px] sm:max-w-none truncate">
                  {employeeName}
                </span>
              </div>
              
              <button
                onClick={handleLogoutClick}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
              >
                <i className="fa-solid fa-right-from-bracket text-red-500"></i>
                <span className="hidden xs:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <LogoutModal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmClockOutAndLogout}
        workMode={activeSession?.workMode}
      />
    </>
  )
}

export default NavBar