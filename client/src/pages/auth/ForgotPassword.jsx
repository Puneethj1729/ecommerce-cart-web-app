import React, { useState, useEffect } from 'react'
import { auth } from '../../firebase'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

const ForgotPassword = (props) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const {user}=useSelector((state)=>({...state}));
  useEffect(()=>{
    if (user && user.token){
        props.history.push('/');
    }
  },[user,props.history]);
  const handleSubmit=async(e)=>{
    e.preventDefault();
    setLoading(true);
    
    const config={
      url:process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT_URL,
      handleCodeInApp: true,
    };
    await auth.sendPasswordResetEmail(email,config)
    .then(()=>{
        setEmail('');
        setLoading(false);
        toast.success('Check Your Email for Password reset link!');
    })
    .catch((err)=>{

        setLoading(false);
        toast.error(err.message);
    });
  };
  return (
    <div className="container col-md-6 offset-md-3 pd-5 my-5">
      {loading ? <h4>Loading</h4> : <h4>Forgot Password</h4>}
      <form onSubmit={handleSubmit}>
        <input type='email' className='form-control' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter Your email' autoFocus/>
        <button type='submit' className="btn btn-info my-3" disabled={!email}>Submit</button>
      </form>
    </div>
  )
}
export default ForgotPassword;
