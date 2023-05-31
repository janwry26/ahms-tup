import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = ({user}) => {
  return (
    user ? <Outlet /> : <Navigate to="/login" />
  )
}

export default PrivateRoute