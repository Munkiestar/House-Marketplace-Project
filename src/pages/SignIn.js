import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import OAuth from "../components/OAuth";

function SignIn(props) {
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();

      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredentials.user) {
        navigate("/");
      }
    } catch (err) {
      toast.error("Bad User Credentials");
    }
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Welcome Back!</p>
      </header>

      <form onSubmit={handleOnSubmit}>
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

        <div className="signInBar">
          <p className="signInText">Sign In</p>
          <button className="signInButton">
            <ArrowRightIcon fill="#fff" width="34px" height="34px" />
          </button>
        </div>
      </form>

      {/*  Google OAuth  */}
      <OAuth />

      <Link to="/sign-up" className="registerLink">
        Sign Up
      </Link>
    </div>
  );
}

export default SignIn;
