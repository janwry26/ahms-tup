import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = ({admin}) => {
  return (
    admin ? <Outlet /> : <Navigate to="/zootopia" />
  )
}

export default PrivateRoute