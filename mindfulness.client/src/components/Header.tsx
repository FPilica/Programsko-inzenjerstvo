import { NavLink } from 'react-router-dom'
import logoPurple from '../assets/logo_boja 2.png'
import homeIcon from '../assets/home.svg'
import contentIcon from '../assets/play.svg'
import statsIcon from '../assets/bar-chart-2.svg'
import calendarIcon from '../assets/calendar.svg'
import bellIcon from '../assets/bell.svg'
import profileIcon from '../assets/user.svg'
import '../App.css'
import './Header.css'

function Header() {
    return (
        <header className="header">
        <NavLink to="/">
            <img src={logoPurple} alt="logo_purple" width="177" height="41" />
        </NavLink>
        <div className="middleIcons">
            <NavLink to="/dashboard" >
                <img className="homeIcon" src={homeIcon} alt="home"  width="35" height="35"/>
            </NavLink>
            <NavLink to="/content">
                <img className="contentIcon" src={contentIcon} alt="content" width="35" height="35" />
            </NavLink>
            <NavLink to="/stats">
                <img className="statsIcon" src={statsIcon} alt="stats"  width="35" height="35" />
            </NavLink>
            <NavLink to="/calendar">
                <img className="calendarIcon" src={calendarIcon} alt="calendar" width="35" height="35" />
            </NavLink>
        </div>
        <div className="rightIcons">
            <img className="bellIcon" src={bellIcon} alt="notifications" width="35" height="35" />
            <NavLink to="/profile">
                <img className="profileIcon" src={profileIcon} alt="profile" width="35" height="35" />
            </NavLink>
        </div>
        </header>
    )
}

export default Header