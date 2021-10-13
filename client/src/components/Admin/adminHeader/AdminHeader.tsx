import React, { Component, FC } from 'react'
import './admin_header_module.css'
import logo from './logo.png'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

interface ControllerHeaderProps { }
const AdminHeader: FC<ControllerHeaderProps> = () => {

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
              <Link to="/"> <img src={logo} alt={'logo'}></img> </Link>
            </div>
            <div className="menu__link">
              <Link to="/admin/orderCharts" className="menu_link">
                Charts{' '}
              </Link>
              <Link to="/admin/masters" className="menu_link">
                Masters{' '}
              </Link>
              <Link to="/admin/orders" className="menu_link">
                Orders{' '}
              </Link>
              <Link to="/admin/users" className="menu_link" > Users</Link>
              <Link to="/admin/cities" className="menu_link" > Cities</Link>
              <button className="menu_link" onClick={logOut}>Log out</button>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default AdminHeader
