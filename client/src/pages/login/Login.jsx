import "./login.css";
import { useContext, useRef } from "react";
import { loginCall } from "../../apiCalls";
import {AuthContext} from "../../context/AuthContext"
import CircularProgress from '@mui/joy/CircularProgress';

export default function Login() {
  const email = useRef();
  const password = useRef();
  const {user, isFetching, error, dispatch} = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    loginCall({email:email.current.value, password:password.current.value}, dispatch);
  };

  console.log(user);

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
            <h3 className="loginLogo">Lamasocial</h3>
            <span className="loginDesc">Connect with Friends</span>
        </div>
        <div className="loginRight">
            <form className="loginBox" onSubmit={handleClick}>
                <input placeholder="john123@email.com" type="email" className="loginInput" ref={email} required/>
                <input placeholder="Password" type="password" className="loginInput" ref={password} minLength="6" required/>
                <button className="loginButton" type="submit" disabled={isFetching}>{isFetching ? <CircularProgress/> : "Log In"}</button>
                <span className="loginForgot">Forgot password</span>
                <button className="loginRegisterButton">{isFetching ? <CircularProgress/> : "Create a new account"}</button>
            </form>
        </div>
      </div>
    </div>
  )
}
