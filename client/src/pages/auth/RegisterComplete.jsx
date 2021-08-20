import React, { useEffect, useState } from 'react'
import { auth } from '../../firebase'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { createOrUpdateUser } from '../../functions/auth';
const RegisterComplete = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  //const { user } = useSelector((state) => ({ ...state }))
  useEffect(() => {
    setEmail(localStorage.getItem('emailForRegistration'))
    
  }, [])
  let dispatch=useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Email and Password is required!.')
      return
    }
    if (password.length < 8) {
      toast.error('Password must be atleast 8 characters long.')
      return
    }

    try {
      const result = await auth.signInWithEmailLink(email, window.location.href)
      
      if (result.user.emailVerified) {
        window.localStorage.removeItem('emailForRegistration')
        let user = auth.currentUser
        await user.updatePassword(password)
        const idTokenResult = await user.getIdTokenResult()
        console.log('user', user, 'TokenID', idTokenResult)
        createOrUpdateUser(idTokenResult.token)
          .then((res) =>
            dispatch({
              type: 'LOGGED_IN_USER',
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            }),
          )
          .catch((err)=>{
            console.log(err);
          });
        props.history.push('/')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  const handleChange = (e) => {
    setPassword(e.target.value)
  }
  const completeRegistrationForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control my-2"
          value={email}
          disabled
        />
        <input
          type="password"
          className="form-control my-2"
          value={password}
          onChange={handleChange}
          autoFocus
          placeholder="Password"
        />
        <button type="submit" className="btn btn-primary my-2">
          Submit
        </button>
      </form>
    )
  }
  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Enter Password</h4>
          {completeRegistrationForm()}
        </div>
      </div>
    </div>
  )
}
export default RegisterComplete
