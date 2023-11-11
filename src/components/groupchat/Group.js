import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import useAutosizeTextArea from "../hooks/useAutosizeTextArea";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Group({ socket }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  // const [isLiked, setIsliked] = useState(false);
  // const [likes, setlikes] = useState();
  const chatboxRef = useRef(null);

  const messageRef = useRef(null);
  const userInfo = useSelector((state) => state.UserReducers);
  useAutosizeTextArea(messageRef?.current, message);
  const navigate = useNavigate();

  const group = useSelector((state) => state.GroupManager?.group);

  useEffect(() => {
    if (socket) {
      console.log(socket);
      setTimeout(async () => {
        await socket.emit("joinRoom", {
          groupId: group?.guid,
        });
        console.log("Joined room");
      }, 300);
    }

    return () => {
      //Component Unmount
      if (socket) {
        socket.emit("leaveRoom", {
          groupId: group?.guid,
        });
      }
    };
  }, [socket, group?.guid]);

  // socket fuction to send messages
  const sendMessage = () => {
    messageRef.current.style.height = "24px";
    if (socket) {
      socket.emit("chatroomMessage", {
        groupId: group?.guid,
        message: messageRef.current.value,
      });
      messageRef.current.value = "";
    }
  };

  useLayoutEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
        const newMessage = [...messages, message];
        setMessages(newMessage);
      });
    }
  }, [messages, socket]);

  useLayoutEffect(() => {
    // Scroll to the end of the chatbox when messages change
    chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
  }, [messages]);

  // fuction to get previous messages
  const getMessage = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer` + " " + localStorage.getItem("userToken"),
        },
      };
      const { data } = await axios.get(`/messages/${group?.guid}`, config);
      setMessages([...data?.messages]);
    } catch (err) {
      console.log(err);
    }
  };

  // calling the previous messages
  useEffect(() => {
    getMessage();
    return () => {};
  }, [group]);

  // handle onchange of textarea
  const handleMessage = (e) => {
    const val = e.target.value;
    setMessage(val);
  };

  // sendingd the message on press of enter key
  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default action
      sendMessage(e);
    }
  };

  return (
    <>
      <div className="chat-container">
        <div className="group-name">
          <h1 onClick={() => getMessage()}>{group?.name || "Group Name"}</h1>
          {group && +group?.owner === userInfo.id && (
            <button
              className="btn"
              onClick={() => navigate(`/users/${group?.guid}/${group.name}`)}
            >
              + Member
            </button>
          )}
        </div>
        <div className="chatbox-container-scroll">
          <div className="chatbox-container" ref={chatboxRef}>
            {Array.isArray(messages) &&
              messages?.map((message, i) => (
                <div
                  className={`chatbox-fx ${
                    message?.senderId == userInfo?.id && "me"
                  }`}
                  key={i}
                >
                  <div
                    className={`chatbox ${
                      message?.senderId == userInfo?.id && "me"
                    }`}
                  >
                    <img
                      className="chat-profile-img"
                      src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                      alt=""
                    />
                    <div className="textpart">
                      <div className="self-details-chat">
                        <h3 className="chat-name">{message?.senderName}</h3>
                        <p className="date-time">10 20-03-22</p>
                      </div>
                      <div className="text-box">
                        <p className="text">{message?.message}</p>
                        <img src="" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            <div className="create-margin"></div>
          </div>
          {group && (
            <div className="textinput-container">
              <textarea
                name="message"
                placeholder="Say Something..."
                id=""
                rows="1"
                onChange={handleMessage}
                onKeyPress={handleKey}
                ref={messageRef}
              ></textarea>
              <button onClick={sendMessage}>Send</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Group;
