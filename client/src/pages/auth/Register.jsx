import React, { useState,useEffect} from 'react';
import {auth} from '../../firebase';
import {toast} from 'react-toastify';
import { useSelector } from 'react-redux';
const Register = (props) => {
  const [email, setEmail] = useState('');
  const {user}=useSelector((state)=>({...state}));
  useEffect(()=>{
    if (user && user.token){
        props.history.push('/');
    }
  },[user,props.history]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const config={
      url:process.env.REACT_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true,
    }
    await auth.sendSignInLinkToEmail(email,config);
    toast.success(`Email is sent to ${email}. Click the link to complete your registration.`);
    window.localStorage.setItem('emailForRegistration',email);
    setEmail("");
  };
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  const registerForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          className='form-control'
          value={email}
          onChange={handleChange}
          autoFocus
          placeholder='Your Email address'
        />
        <button type='submit' className='btn btn-primary my-2'>Register</button>
      </form>
    );
  };
  return (
    <div className='container p-5'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <h4>Register</h4>
          {registerForm()}
        </div>
      </div>
    </div>
  );
};
export default Register;
