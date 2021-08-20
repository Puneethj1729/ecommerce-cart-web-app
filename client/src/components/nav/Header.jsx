import React, { useState } from 'react';
import { Menu,Badge } from 'antd';
import {
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  UserOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useDispatch,useSelector} from 'react-redux';
import { useHistory } from 'react-router-dom';
import Search from '../forms/Search';
const { SubMenu, Item } = Menu;
const Header = () => {
  const [current, setCurrent] = useState('home');
  let dispatch = useDispatch();
  let {user,cart}=useSelector((state)=>({...state}));
  let history=useHistory();
  const handleClick = (e) => {
    setCurrent(e.key);
  };
  const handleLogout=(e)=>{
      firebase.auth().signOut();
      dispatch({
        type:"LOGOUT",
        payload:null,
      });
      history.push('/login');
  };
  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode='horizontal'>
      <Item key='home' icon={<HomeOutlined />}>
        <Link to='/'>Home</Link>
      </Item>
      <Item key='shop' icon={<ShoppingOutlined />}>
        <Link to='/shop'>Shop</Link>
      </Item>
      <Item key='cart' icon={<ShoppingCartOutlined />}>
        <Link to='/cart'>
        <Badge count={cart.length} offset={[9,0]}>Cart</Badge></Link>
      </Item>
      {!user && (
        <Item key='register' icon={<UserAddOutlined />} className='float-end'>
          <Link to='/register' className>Register</Link>
        </Item>
      )}
      {!user && (
        <Item key='login' icon={<UserOutlined />} className='float-end'>
          <Link to='/login'>Login</Link>
        </Item>
      )}
      {user && (
        <SubMenu key='SubMenu' icon={<LoginOutlined />} title={user.name&& user.name.split('@')[0]} className='float-end'>
          {user && user.role==='subscriber' &&(<Item><Link to='/user/history'>Dashboard</Link></Item>)}
          {user && user.role==='admin' &&(<Item><Link to='/admin/dashboard'>Dashboard</Link></Item>)}
          <Item icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Item>
        </SubMenu>
      )}
    <span className='float-end p-1'>
      <Search/>
    </span>
    </Menu>
  );
};
export default Header;
