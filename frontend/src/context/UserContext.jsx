import React, { createContext, useState } from 'react'
import { useEffect } from 'react';

export const UserDataContext = createContext()

const UserContext = ({children}) => {

    const [user,setUser] = useState({
        email:'',
        fullName:{
            firstName:'',
            lastName:''
        }
    })

    useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(res.data.user);
      } catch (err) {
        console.error('Session expired or invalid token');
        localStorage.removeItem('authToken');
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <UserDataContext.Provider value={{ user, setUser }}>
      {children}
      </UserDataContext.Provider>
    </div>
  )
}

export default UserContext
