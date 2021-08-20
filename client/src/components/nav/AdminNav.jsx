import React from 'react';
import {Link} from 'react-router-dom';
const AdminNav=()=>{
    return(
        <nav className='float-left'>
            <ul className='nav flex-column'>
                    <li className='nav-item'>
                        <Link to="/admin/dashboard" className='nav-link font-weight-bold text-info'>DASHBOARD</Link>
                    </li>
                    <li className='nav-item'>
                        <Link to="/admin/product" className='nav-link font-weight-bold text-info' >PRODUCT</Link>
                    </li>
                    <li className='nav-item'>
                        <Link to="/admin/products" className='nav-link font-weight-bold text-info' >PRODUCTS</Link>
                    </li>
                    <li className='nav-item'>
                        <Link to="/admin/category" className='nav-link font-weight-bold text-info' >CATEGORY</Link>
                    </li>
                    <li className='nav-item'>
                        <Link to="/admin/sub" className='nav-link font-weight-bold text-info' >SUB CATEGORY</Link>
                    </li>
                    <li className='nav-item'>
                        <Link to="/admin/coupon" className='nav-link font-weight-bold text-info' >COUPON</Link>
                    </li>
                    <li className='nav-item'>
                        <Link to="/user/password" className='nav-link font-weight-bold text-info' >PASSWORD</Link>
                    </li>
            </ul>
        </nav>
    );
};
export default AdminNav;