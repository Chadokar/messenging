import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "../apicall/userData";
import { useDispatch } from "react-redux";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submithandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/signup",
        {
          name,
          email,
          password,
        },
        config
      );
      localStorage.setItem("userToken", JSON.stringify(data.token));
      console.log(data);
      fetchUserData(dispatch);
      navigate("/group");
      document.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form className="form" onSubmit={submithandler} action="">
        <h2>Sign Up</h2>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="email error"></div>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="email error"></div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="password error"></div>
        <button>Log up</button>
      </form>
    </div>
  );
}

export default Signup;
