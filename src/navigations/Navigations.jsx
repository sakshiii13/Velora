import React from 'react'
import { getToken } from '../utils/authStorage';
import Authenticated from './Authenticated';
import Auth from './Auth';
import { useAuth } from '../context/AuthContext';

const Navigations = () => {
    const {isAuthenticated} = useAuth();
    const token = getToken();
  return (
    <>
    {token && isAuthenticated ? <Authenticated /> : <Auth />}
    </>
  )
}

export default Navigations