import React, { Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Members from "./afterauth/Members";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Groupchat from "./groupchat/Groupchat";
import Home from "./home/Home";
import Header from "./partials/Header";
import { io } from "socket.io-client";
import RequireAuth from "./hooks/useAuth";
import { fetchUserData } from "./apicall/userData";
import { REACT_APP_BACKEND_URL } from "../config";

function Navigation() {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);

  const setupSocket = async () => {
    const token = localStorage.getItem("userToken");
    if (token && !socket) {
      const newSocket = await io(REACT_APP_BACKEND_URL, {
        query: {
          token: `Bearer` + " " + localStorage.getItem("userToken"),
        },
      });

      newSocket.on("disconnect", () => {
        // console.log("successfully disconnected");
        setSocket(null);
        setTimeout(setupSocket, 3000);
      });

      newSocket.on("connection", () => {
        // console.log("successfully connected");
      });

      setTimeout(() => {
        setSocket(newSocket);
      }, 3);
    }
  };

  const navItems = [
    {
      path: "/login",
      element: (
        <Suspense fallback={<h1>Loading</h1>}>
          <Login />
        </Suspense>
      ),
      protected: false,
    },
    {
      path: "/",
      element: (
        <Suspense fallback={<h1>Loading</h1>}>
          <Home />
        </Suspense>
      ),
      protected: false,
    },
    {
      path: "/signup",
      element: (
        <Suspense fallback={<h1>Loading</h1>}>
          <Signup />
        </Suspense>
      ),
      protected: false,
    },
    {
      path: "/users/:groupId/:groupName",
      element: (
        <Suspense fallback={<h1>Loading</h1>}>
          <Members />
        </Suspense>
      ),
      protected: true,
    },

    {
      path: "/group",
      element: (
        <Suspense fallback={<h1>Loading</h1>}>
          <Groupchat socket={socket} />
        </Suspense>
      ),
      protected: true,
    },
  ];

  useEffect(() => {
    fetchUserData(dispatch);
  }, [localStorage.getItem("userToken")]);

  useEffect(() => {
    setupSocket();
  }, [socket]);

  return (
    <Routes>
      <Route path="/" element={<Header />}>
        {navItems
          .filter((ele) => !ele.protected)
          .map((ele, i) => (
            <Route key={i} element={ele.element} path={ele.path} />
          ))}
        <Route element={<RequireAuth />}>
          {navItems
            .filter((ele) => ele.protected)
            .map((ele, i) => (
              <Route key={i} element={ele.element} path={ele.path} />
            ))}
        </Route>
      </Route>
    </Routes>
  );
}

export default Navigation;
