import axios from "axios";
import React, { useEffect } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";

function Members() {
  const { groupId, groupName } = useParams();
  const location = useLocation();
  const [members, setMembers] = React.useState();
  let imps = [];

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

  if (!groupId) {
    <Navigate to={"/group"} state={{ from: location }} replace />;
  }

  const Member = ({ member }) => {
    const [isClicked, setIsClicked] = React.useState(false);
    const handleClick = (clc) => {
      console.log("handleClick");
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
          src={require("../../assets/img/smoothie.png")}
          alt="smoothie recipe icon"
        />
        <h4>{member?.name}</h4>
        <p>
          {member?.groups.slice(1, 4).map((group) => group.groupName + ", ")}
        </p>
      </li>
    );
  };

  return (
    <div>
      <div className="standard">
        <h2>{groupName}</h2>
        <button onClick={() => handleAdd()} className="btn">
          Add
        </button>
      </div>
      <ul className="recipes">
        {Array.isArray(members) &&
          members?.map(
            (member) => member && <Member key={member?.id} member={member} />
          )}
      </ul>
    </div>
  );
}

export default Members;
