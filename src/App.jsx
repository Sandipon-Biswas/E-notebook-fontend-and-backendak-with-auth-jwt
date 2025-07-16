import React, { Children } from 'react'
import { Toaster } from 'react-hot-toast';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import MyState from './context/data/myState';
import Home from './pages/home/Home';
import Signup from './pages/singup/Signup';
import Login from './pages/login/Login';
import Profile from './pages/profile/Profile';
import NoPage from './pages/nopage/NoPage';
import AddNote from './pages/addnote/AddNote';
import Updatenote from './pages/updatenote/Updatenote';
const App = () => {
  return (
       <Router>
 <MyState>
   
        <Routes>
          <Route path="/" element={ <ProtectedRoute>
              <Home />
            </ProtectedRoute>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/addnote" element={            <ProtectedRoute>
              <AddNote />
            </ProtectedRoute>} />
          <Route path="/notes/edit/:id" element={            <ProtectedRoute>
              <Updatenote />
            </ProtectedRoute>} />
          <Route path="/profile" element={            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>} />
          <Route path="/*" element={<NoPage />} />
        </Routes>
         <Toaster /> 
    
    </MyState>
      </Router>
  )
}

export default App

export const ProtectedRoute =({children })=>{
  const token = localStorage.getItem('token');
  if(token){
    return children 
  }else{
    return <Navigate to={'/login'} />
  }
}