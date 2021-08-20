import React,{useState}from 'react';
import UserNav from '../../components/nav/UserNav';
import {auth} from "../../firebase";
import {toast} from 'react-toastify';

const Password=()=>{
    const [password,setPassword]=useState("");
    const [loading,setLoading]=useState(false);
    const handleSubmit=async (e)=>{
        e.preventDefault();
        setLoading(true);
        await auth.currentUser.updatePassword(password)
        .then(()=>{
            setLoading(false);
            toast.success('Password Updated!');
        })
        .catch((err)=>{
            setLoading(false);
            toast.error(err.message);
        });
    }
    const passwordUpdateForm=()=>{
        return (
            <form onSubmit={handleSubmit}>
            <div className='form-group'>
            
            <input type='password' onChange={(e)=>setPassword(e.target.value)} className='form-control my-2 ' placeholder='Enter New password' disabled={loading} value={password}/>
            <button className='btn btn-primary' disabled={!password || loading ||password.length<6}> Submit</button>

            </div>
            </form>
        );
    };
    return (
    <div className='container-fluid'>
        <div className='row'>
            <div className='col-md-2 text-bold'>
                <UserNav/>
            </div>
            <div className='col my-2'>
            {loading?(<h4>
                Loading...
            </h4>):(<h4>
                Password Update
            </h4>)}
            {passwordUpdateForm()} </div>
        </div>
    </div>);
};
export default Password;