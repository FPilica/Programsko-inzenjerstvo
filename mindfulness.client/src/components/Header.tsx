import { NavLink } from 'react-router-dom'
import logoPurple from '../assets/logo_boja 2.png'
import { HouseIcon, PlayIcon, ChartBarIcon, CalendarBlankIcon, BellIcon, UserIcon, PencilIcon} from '@phosphor-icons/react';
import '../App.css'
import './Header.css'

function Header({ userRole } : { userRole: string }) {

    return (
        <header className="header">
        <NavLink to="/dashboard">
            <img src={logoPurple} alt="logo_purple" width="177" height="41" />
        </NavLink>
        <div className="middleIcons">
            <NavLink to="/dashboard" >
                <HouseIcon className="homeIcon" size={35} color="black"/>
            </NavLink>
            <NavLink to="/content">
                <PlayIcon className="contentIcon" size={35} color="black"/>   
            </NavLink>
            <NavLink to="/stats">
                <ChartBarIcon className="statsIcon" size={35} color="black"/>
            </NavLink>
            <NavLink to="/calendar">
                <CalendarBlankIcon className="calendarIcon" size={35} color="black"/>
            </NavLink>
        </div>
        <div className="rightIcons">
            {/* ako admin ili trener dodaj dio za dodavanje sadržaja */}
            {(userRole === "admin" || userRole === "coach") && (
                <NavLink to="/addContent">
                    <PencilIcon className="addIcon" size={35} color="black"/>
                </NavLink>
            )}
            <BellIcon size={35} color="black"/>
            <NavLink to="/profile">
                <UserIcon className="profileIcon" size={35} color="black"/>
            </NavLink>
        </div>
        </header>
    )
}

export default Header;