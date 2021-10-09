import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import AdminHeader from './components/Admin/adminHeader/AdminHeader'
import MasterHeader from './components/Master/masterHeader/masterHeader'
import jwt from "jwt-decode";
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => {
  const history = useHistory()
  useEffect(() => {
    if ((jwt(localStorage.getItem('accessToken').split(' ')[0])).exp < +(Date.now() / 1000).toFixed()) {
      history.push('/login')
      localStorage.removeItem('accessToken')
    }
  }, [])

  return (
    <Route
      {...rest}
      render={props =>
        localStorage.getItem('accessToken') ? (
          <>
            <Component {...props} />
          </>
        ) :
 
          <Redirect to="/login" />
      }
    />
  )
}

export default PrivateRoute
