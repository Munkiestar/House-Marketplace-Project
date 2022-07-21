import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

function SignUp(props) {
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Welcome Back!</p>
      </header>

      <form>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          className="nameInput"
          placeholder="Name"
          onChange={handleOnChange}
        />

        <input
          type="email"
          name="email"
          id="email"
          value={email}
          className="emailInput"
          placeholder="Email"
          onChange={handleOnChange}
        />

        <div className="passwordInputDiv">
          <input
            type={showPass ? "text" : "password"}
            className="passwordInput"
            placeholder="Password"
            value={password}
            name="password"
            id="password"
            onChange={handleOnChange}
          />

          <img
            src={visibilityIcon}
            alt="show password"
            className="showPassword"
            onClick={() => setShowPass(!showPass)}
          />
        </div>

        <Link to="/forgot-password" className="forgotPasswordLink">
          Forgot Password?
        </Link>

        <div className="signUpBar">
          <p className="signUpText">Sign Up</p>
          <button className="signUpButton">
            <ArrowRightIcon fill="#fff" width="34px" height="34px" />
          </button>
        </div>
      </form>

      {/*  Google OAuth  */}

      <Link to="/sign-in" className="registerLink">
        Sign In
      </Link>
    </div>
  );
}

export default SignUp;
