import { useRef } from "react";
import "./register.css"
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const navigate = useNavigate();

  // there's a problem with registering. If password is keyed in wrongly the first time, can't submit form after changing password 
  // don't have this same problem with Login. Can try to implement something similar to Login page
  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("/auth/register", user);
        navigate("/login");
      } catch (err) {
        console.log(err);
      };
    }
  };

  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
            <h3 className="registerLogo">Lamasocial</h3>
            <span className="registerDesc">Connect with Friends</span>
        </div>
        <div className="registerRight">
            <form className="registerBox" onSubmit={handleClick}>
                <input placeholder="Username" ref={username} className="registerInput" required />
                <input placeholder="john@email.com" ref={email} type="email" className="registerInput" required />
                <input placeholder="Password" ref={password} type="password" minLength="6" className="registerInput" required />
                <input placeholder="Password Again" ref={passwordAgain} type="password" className="registerInput" required />
                <button className="registerButton" type="submit">Sign Up</button>
                <button className="registerRegisterButton">Login to Account</button>
            </form>
        </div>
      </div>
    </div>
  )
}
