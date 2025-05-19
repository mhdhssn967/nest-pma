import React from 'react'
import HomePage from './pages/HomePage'
import NavBar from './components/NavBar'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <>
    {/* <NavBar/> */}
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        </Routes>
    </Router>
   
    </>
  )
}

export default App