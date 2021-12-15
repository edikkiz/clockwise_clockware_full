import { FC } from 'react'
import './header-module.css'
import logo from './logo.png'
import { Link } from 'react-router-dom'

interface ControllerHeaderProps { }
const Header: FC<ControllerHeaderProps> = () => {
  return (
    <div className="wrapper_header">
      <header>
        <div className="header__topline">
          <div className="menu">
            <div className="menu__logo-img">
              <Link to='/'><img src={logo} alt={'logo'}></img></Link>
            </div>
            <div className="menu__link">
              <Link to="/blog" className="menu_link">
                Blog
              </Link>
              <Link to="/" className="menu_link">
                Order
              </Link>
              <Link to="/login" className="menu_link" > login </Link>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header
