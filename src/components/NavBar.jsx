import React, { useEffect, useState } from 'react'
import logo from '../assets/OQ.png'
import './navBar.css'
import getCurrentUserID from '../services/getUserID'
import getEmployeeDetails from '../services/getEmployeeDetails'
import { auth } from '../firebaseConfig'


const NavBar = ({employeeName, companyName}) => {

  const [user, setUser]=useState('')

  
  const [empDetails, setEmpDetails]=useState([])
  console.log(empDetails);
  

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUserID();
      const details = await getEmployeeDetails();
  
      setEmpDetails(details);
        const matched = details.find((emp) => emp.userID === currentUser);
      if (matched) {
        setUser(matched.userName);
      }
  
      if (!currentUser) {
        navigate("/login"); // Redirect if not logged in
      }
    };
  
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = '/login'; // Redirect to login
  };
  
  return (
    <>
    <div className='nav'>
        <div className='navLeft'><img src={logo} alt="" /> </div>
    
        <div className='nav-right'>
        <i className='fa-solid fa-circle-user' style={{marginRight:'2%'}}></i><h3 style={{fontWeight:'500',marginBottom:'3px', textWrap:'nowrap'}}>          
           {employeeName}</h3> <button onClick={handleLogout} className='logout-btn'>Logout</button></div>
        </div>
        
    </>
  )
}

export default NavBar