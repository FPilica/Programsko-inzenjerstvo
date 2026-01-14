import { NavLink } from "react-router-dom";
import { useState } from "react";
import logoPurple from "../assets/logo_boja 2.png";
import {
  HouseIcon,
  PlayIcon,
  ChartBarIcon,
  CalendarBlankIcon,
  BellIcon,
  UserIcon,
  PencilIcon,
  ListIcon,
} from "@phosphor-icons/react";
import "../App.css";
import "./Header.css";

function Header({ userRole }: { userRole: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <NavLink to="/dashboard">
        <img src={logoPurple} alt="logo_purple" width="177" height="41" />
      </NavLink>
      <div className="middleIcons">
        <NavLink to="/dashboard">
          <HouseIcon className="homeIcon" size={35} color="black" />
        </NavLink>
        <NavLink to="/content">
          <PlayIcon className="contentIcon" size={35} color="black" />
        </NavLink>
        <NavLink to="/stats">
          <ChartBarIcon className="statsIcon" size={35} color="black" />
        </NavLink>
        <NavLink to="/calendar">
          <CalendarBlankIcon className="calendarIcon" size={35} color="black" />
        </NavLink>
      </div>
      <div className="rightIcons">
        {/* ako admin ili trener dodaj dio za dodavanje sadržaja */}
        {(userRole === "admin" || userRole === "coach") && (
            <NavLink to="/addContent" className="desktopOnly">
            <PencilIcon className="addIcon" size={35} color="black" />
          </NavLink>
        )}
        <BellIcon className="desktopOnly" size={35} color="black" />
        <NavLink to="/profile" className="desktopOnly">
          <UserIcon className="profileIcon" size={35} color="black" />
        </NavLink>
        <ListIcon 
          className="listIcon" 
          size={35} 
          color="black" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      </div>

      {/* Dropdown menu */}
      {isMenuOpen && (
        <div className="dropdownMenu">
          <NavLink to="/dashboard" onClick={() => setIsMenuOpen(false)}>
            <HouseIcon size={24} color="black" />
            <span>Naslovnica</span>
          </NavLink>
          <NavLink to="/content" onClick={() => setIsMenuOpen(false)}>
            <PlayIcon size={24} color="black" />
            <span>Sadržaj</span>
          </NavLink>
          <NavLink to="/stats" onClick={() => setIsMenuOpen(false)}>
            <ChartBarIcon size={24} color="black" />
            <span>Statistika</span>
          </NavLink>
          <NavLink to="/calendar" onClick={() => setIsMenuOpen(false)}>
            <CalendarBlankIcon size={24} color="black" />
            <span>Kalendar</span>
          </NavLink>
          {(userRole === "admin" || userRole === "coach") && (
            <NavLink to="/addContent" onClick={() => setIsMenuOpen(false)}>
              <PencilIcon size={24} color="black" />
              <span>Dodaj sadržaj</span>
            </NavLink>
          )}
          <div className="dropdownDivider"></div>
          <NavLink to="/profile" onClick={() => setIsMenuOpen(false)}>
            <UserIcon size={24} color="black" />
            <span>Profil</span>
          </NavLink>
        </div>
      )}
    </header>
  );
}

export default Header;
