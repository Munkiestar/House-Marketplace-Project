import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import OAuth from "../components/OAuth";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { db } from "../firebase.config";

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      // here we register user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      await updateProfile(auth.currentUser, {
        displayName: name,
      });

      // copy of name, email, password data
      // with `delete` we remove password from the object
      // adding timestamp
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      // sending data to firestore database to users collection
      await setDoc(doc(db, "users", user.uid), formDataCopy);

      // redirecting
      navigate("/");
    } catch (err) {
      toast.error("Something went wrong with registration!");
    }
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Welcome Back!</p>
      </header>

      <form onSubmit={handleFormSubmit}>
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
      <OAuth />

      <Link to="/sign-in" className="registerLink">
        Sign In
      </Link>
    </div>
  );
}

export default SignUp;
