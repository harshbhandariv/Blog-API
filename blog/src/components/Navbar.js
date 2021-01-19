import React from 'react';
import { Link } from 'react-router-dom';
import user from '../icons/user.svg';
import plus from '../icons/plus.svg';
import '../styles/navStyle.css';
function Navbar() {
    return (<nav>
        <div className="logo"><Link to="/">BLOGGGZ</Link></div>
        <ul className="navList">
            <li><Link to="/newpost"><img src={plus} height="30px" width="30px" alt="Post" /></Link></li>
            {/* Plus svg by Pixel Perfect */}
            <li><Link to="/account"><img src={user} height="30px" width="30px" alt="User" /></Link></li>
            {/* User svg by freeprik */}
        </ul>
    </nav>);
}



export default Navbar;