import axios from "axios";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

function Members() {
  const { groupId, groupName } = useParams();
  const location = useLocation();
  const [members, setMembers] = React.useState();
  let imps = [];
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.UserReducers);

  const groupHandle = async (id) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer` + " " + localStorage.getItem("userToken"),
        },
      };
      const { data } = await axios.get(`group/${groupId}`, config);
      console.log(data);
      console.log(userInfo);
      if (+data?.owner !== userInfo?.id) navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const deleteMember = async (id) => {
    try {
      const memberId = id;
      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer` + " " + localStorage.getItem("userToken"),
        },
      };
      const { data } = await axios.delete(
        `member/${groupId}/${memberId}`,
        config
      );
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const getUsers = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer` + " " + localStorage.getItem("userToken"),
        },
      };
      const { data } = await axios.get(`/users`, config);
      console.log(data);
      setMembers(data);
    } catch (err) {
      console.log(err);
    }
  };
  // console.log(members);

  useEffect(() => {
    getUsers();
    groupHandle();
  }, [groupId]);

  const handleAdd = async () => {
    console.log(imps);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer` + " " + localStorage.getItem("userToken"),
        },
      };
      const { data } = await axios.post(
        `/member/${groupId}`,
        {
          groupName,
          participants: imps,
        },
        config
      );
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!groupId || !groupName) {
    return <Navigate to={"/group"} state={{ from: location }} replace />;
  }

  const Member = ({ member }) => {
    const [isClicked, setIsClicked] = React.useState(false);
    const handleClick = (clc) => {
      setIsClicked(!isClicked);
      if (clc) {
        imps = [...imps, member.id];
      } else {
        imps = imps.filter((ele) => ele !== member.id);
      }
    };

    const isPresent = member?.groups.some((grp) => grp?.groupId === +groupId);

    return (
      <li
        onClick={() => !isPresent && handleClick(!isClicked)}
        className={`recipe ${(isClicked || isPresent) && "highlight"}`}
      >
        <img
          // src={require("../../assets/img/smoothie.png")}
          src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
          alt="smoothie recipe icon"
          className="img-bound"
        />
        <h4>{member?.name}</h4>
        {/* <p>
          {member?.groups.slice(1, 4).map((group) => group.groupName + ", ")}
        </p> */}
        {isPresent && (
          <button className="btn" onClick={() => deleteMember(member.id)}>
            Remove
          </button>
        )}
      </li>
    );
  };

  return (
    <div>
      <div className="standard">
        <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/group")}>
          {groupName}
        </h2>
        <button onClick={() => handleAdd()} className="btn">
          Save
        </button>
      </div>
      <ul className="recipes">
        {Array.isArray(members) &&
          members?.map(
            (member) =>
              member &&
              userInfo?.id !== member?.id && (
                <Member key={member?.id} member={member} />
              )
          )}
      </ul>
    </div>
  );
}

export default Members;
