import React, { useState, useEffect } from 'react'
import { auth, googleAuthProvider } from '../../firebase'
import { toast } from 'react-toastify'
import { Button } from 'antd'
import { MailOutlined, GoogleOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { createOrUpdateUser } from '../../functions/auth'

const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useSelector((state) => ({ ...state }))

  useEffect(() => {
    let anyState=props.history.location.state;
    if (anyState){
      return;
    }
    else{
    if (user && user.token) {
      props.history.push('/')
    }}
  }, [user,props.history])
  let dispatch = useDispatch();
  const roleBasedRedirect = (res) => {
    let anyState=props.history.location.state;
    if (anyState){
      props.history.push(anyState.from);
    }
    else{
      if (res.data.role === 'admin') {
      props.history.push('/admin/dashboard')
    } else {
      props.history.push('/user/history')
    }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await auth.signInWithEmailAndPassword(email, password)
      const { user } = result
      const idTokenResult = await user.getIdTokenResult()
      createOrUpdateUser(idTokenResult.token)
        .then((res) => {
          dispatch({
            type: 'LOGGED_IN_USER',
            payload: {
              name: res.data.name,
              email: res.data.email,
              token: idTokenResult.token,
              role: res.data.role,
              _id: res.data._id,
            },
          });
          roleBasedRedirect(res);
        })
        .catch((err) => {
          console.log(err)
        });

      //  props.history.push('/');
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      setLoading(false)
    }
  }
  const handleEmail = (e) => {
    setEmail(e.target.value)
  }
  const handlePassword = (e) => {
    setPassword(e.target.value)
  }

  const googleLogin = async () => {
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const { user } = result
        const idTokenResult = await user.getIdTokenResult()
        createOrUpdateUser(idTokenResult.token)
          .then((res) =>{
            dispatch({
              type: 'LOGGED_IN_USER',
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
            roleBasedRedirect(res);
          })
          .catch((err) => {
            console.log(err)
          });
        // props.history.push('/')
      })
      .catch((err) => {
        console.log(err)
        toast.error(err.message)
      })
  }
  const loginForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group my-2">
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={handleEmail}
            autoFocus
            placeholder="Your Email address"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={handlePassword}
            placeholder="Your Password"
          />
        </div>
        <Button
          onClick={handleSubmit}
          type="primary"
          className="my-3"
          block
          shape="round"
          icon={<MailOutlined />}
          size="large"
          disabled={!email || password.length < 6}
        >
          Login with Email/Password
        </Button>
      </form>
    )
  }

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {!loading ? (
            <h4>Login</h4>
          ) : (
            <h4 className="text-danger">Loading...</h4>
          )}
          {loginForm()}
          <Button
            onClick={googleLogin}
            type="danger"
            className="mb-3"
            block
            shape="round"
            icon={<GoogleOutlined />}
            size="large"
          >
            Login with Google
          </Button>
          <Link to="/forgot/password" className="float-end">
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  )
}
export default Login
