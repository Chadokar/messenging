import { Dialog } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./groupchat.css";
import Group from "./Group";
import { setData, setGroup } from "../redux/actions/Action";
import axios from "axios";

function Groupchat({ socket }) {
  // boolean for popup
  const [dialogGroup, setDialogGroup] = useState(false);
  const [currSocket, setCurrentSocket] = useState(socket);

  const dispatch = useDispatch();
  const [groupName, setGroupName] = useState("");
  // constain the current group data showing on screen
  const group = useSelector((state) => state.GroupManager?.group);
  console.log(group);

  useEffect(() => {
    setCurrentSocket(socket);
  }, [socket]);

  const userData = useSelector((state) => state.UserReducers);

  // function to create new group
  const newGroupHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer` + " " + localStorage.getItem("userToken"),
        },
      };
      const { data } = await axios.post(
        "/group",
        {
          groupName,
        },
        config
      );

      // updated the groups in user
      const user = {
        ...userData,
        groups: [
          ...userData.groups,
          { groupName: data.group.groupName, groupId: data.group.id },
        ],
      };
      dispatch(setData(user));
      setDialogGroup(false);
    } catch (err) {
      console.log(err);
    }
  };

  // calling the group data on click of a group from list of groups on left side
  const groupHandle = async (id) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer` + " " + localStorage.getItem("userToken"),
        },
      };
      console.log(id);
      const data = await axios.get(`group/${id}`, config);
      console.log(data);
      dispatch(setGroup(data.data));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Dialog
        fullWidth={false}
        maxWidth="xl"
        open={dialogGroup}
        onClose={() => setDialogGroup(false)}
      >
        <form
          className="form"
          onSubmit={groupName ? newGroupHandler : () => {}}
          action=""
        >
          <h2>Create Group</h2>
          <label htmlFor="groupName">Group Name</label>
          <input
            type="groupName"
            name=""
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <div className="email error"></div>
          <button>Create group</button>
        </form>
      </Dialog>
      <div className="group-header">
        <button className="btn" onClick={() => setDialogGroup(true)}>
          Create Group
        </button>
      </div>
      <div className="groupchat">
        <div className="group-list-container">
          {userData?.groups?.map(
            (group, i) =>
              group.groupId && (
                <div
                  className="group-list-box"
                  onClick={() => groupHandle(group?.groupId)}
                  key={i}
                >
                  <img
                    className="chat-profile-img"
                    src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                    alt=""
                  />
                  <h3>{group?.groupName}</h3>
                </div>
              )
          )}
        </div>
        {group && <Group socket={currSocket} />}
      </div>
    </>
  );
}

export default Groupchat;
