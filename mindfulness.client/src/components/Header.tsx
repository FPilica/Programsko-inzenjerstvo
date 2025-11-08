import { NavLink } from 'react-router-dom'
import logoPurple from '../assets/logo_boja 2.png'
import { HouseIcon, PlayIcon, ChartBarIcon, CalendarBlankIcon, BellIcon, UserIcon} from '@phosphor-icons/react';
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
                <HouseIcon className="homeIcon" size={35} color="black"/>
            </NavLink>
            <NavLink to="/content">
                <PlayIcon size={35} color="black"/>   
            </NavLink>
            <NavLink to="/stats">
                <ChartBarIcon size={35} color="black"/>
            </NavLink>
            <NavLink to="/calendar">
                <CalendarBlankIcon size={35} color="black"/>
            </NavLink>
        </div>
        <div className="rightIcons">
            <BellIcon size={35} color="black"/>
            <NavLink to="/profile">
                <UserIcon size={35} color="black"/>
            </NavLink>
        </div>
        </header>
    )
}

export default Header