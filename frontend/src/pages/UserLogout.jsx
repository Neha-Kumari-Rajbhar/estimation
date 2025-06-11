import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UserLogout = () => {
    const token = localStorage.getItem('token')
    const navigate= useNavigate()
    useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/users/logut`,{
        headers:{
            Authorization: `Bearer ${token}`
        }
    }).then((response)=>{
        if(response.status === 200){
            localStorage.removeItem('token')
            navigate('/login')
        }
    }).catch(error => {
      console.error("Logout error:", error);
      navigate('/login'); // Redirect even if logout fails
  });
}, [navigate, token]);
  return (
    <div>
      logout
    </div>
  )
}

export default UserLogout
