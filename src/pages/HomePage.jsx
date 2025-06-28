import React, { useEffect, useState } from 'react'
import TaskView from '../components/TaskView'
import getCurrentUserID from '../services/getUserID'
import { getCompanyDetails, ifAdmin } from '../services/getEmployeeDetails'
import NavBar from '../components/NavBar'
import './HomePage.css'

const HomePage = () => {
  const [currentUser, setCurrentUser]=useState('')  
  const [isAdmin, setIsAdmin]=useState(false)
  const [companyId,setCompanyId]=useState()
  const [employeeName, setEmployeeName]=useState()
  const [companyName,setCompanyName]=useState()
  const [logoLink,setLogoLink]=useState('')    
  
  

  useEffect(()=>{
    const fetchUser=async()=>{
      const userRef=await getCurrentUserID()
      setCurrentUser(userRef)
    };fetchUser()
  },[])


  // Get company details

useEffect(() => {
  const fetchDetails = async () => {
    const companyData = await getCompanyDetails(currentUser);
    console.log(companyData);
    
    setCompanyId(companyData.companyId)
    setCompanyName(companyData.companyName)
    setEmployeeName(companyData.employeeName)
    setLogoLink(companyData.logo)
  };

  if (currentUser) fetchDetails();
}, [currentUser]);
  
  useEffect(()=>{
    const checkAdmin=async()=>{
      await ifAdmin(currentUser)?setIsAdmin(true):setIsAdmin(false)
    };checkAdmin()
  },[currentUser])


  return (
    <>
    <NavBar employeeName={employeeName} companyName={companyName}/>
    <TaskView logoLink={logoLink} currentUser={currentUser} companyName={companyName} isAdmin={isAdmin} companyId={companyId}/>
    </>
  )
}

export default HomePage