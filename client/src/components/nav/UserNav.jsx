import React from 'react';
import {Link} from 'react-router-dom';
const UserNav=()=>{
    return(
        <nav className='float-left'>
            <ul className='nav flex-column'>
                    <li className='nav-item'>
                        <Link to="/user/history" className='nav-link font-weight-bold text-info'>HISTORY</Link>
                    </li>
                    <li className='nav-item'>
                        <Link to="/user/password" className='nav-link font-weight-bold text-info' >UPDATE PASSWORD</Link>
                    </li>
                    <li className='nav-item'>
                        <Link to="/user/wishlist" className='nav-link font-weight-bold text-info' >WISHLIST</Link>
                    </li>
            </ul>
        </nav>
    );
};
export default UserNav;