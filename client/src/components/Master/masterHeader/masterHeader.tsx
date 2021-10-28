import React, { Component, FC, useEffect, useState } from 'react'
import logo from './logo.png'
import { Link } from 'react-router-dom'
import { useHistory, useParams } from 'react-router-dom'

interface ControllerHeaderProps {
  masterId: number
}
const MasterHeader: FC<ControllerHeaderProps> = () => {
  const { masterId } = useParams<{ masterId: string }>()

  const history = useHistory()

  const logOut = () => {
    localStorage.removeItem('accessToken')
    history.push('/login')
  }
  return (
    <div className="wrapper_header">
      <header>
        <div className="header__topline">
          <div className="menu">
            <div className="menu__logo-img">
              <Link to="/">
                <img src={logo} alt={'logo'}></img>
              </Link>
            </div>
            <div className="menu__link">
              <Link className="menu_link" to={`/calendar/${masterId}`}>
                Calendar
              </Link>
              <Link className="menu_link" to={`/role/master/${masterId}`}>
                Order list
              </Link>
              <button className="menu_link" onClick={logOut}>
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default MasterHeader
