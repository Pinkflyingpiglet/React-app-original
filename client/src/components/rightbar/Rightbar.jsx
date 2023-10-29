import "./rightbar.css";
import {Users} from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function Rightbar({user}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const {user:currentUser, dispatch} = useContext(AuthContext);
  // const [followed, setFollowed] = useState((currentUser.followings.includes(user?.id))); // use this if const(followed) below not working
  const [followed, setFollowed] = useState(false); // this works


  // use this useEffect if the one below doesn't work
  // useEffect(()=>{
  //   console.log('currentUser.followings:', currentUser.followings);
  //   console.log('user?.id:', user?.id);
  //   if (user && user.id) {
  //     setFollowed(currentUser.followings.includes(user?.id));
  //   }
  // },[currentUser,user])

  //testing
  useEffect(() => {
    if (user && user._id) { 
      const getFollowed = async () => {
        try {
          const followedList = await axios.get("/users/followings/" + currentUser._id);
          const isFollowing = followedList.data.includes(user._id);
          setFollowed(isFollowing);
        } catch(err) {
          console.log(err);
        }
      }
      getFollowed();
    };
  },[user])
  //testing

  useEffect(() => {
    // useEffect can't use async function so a seperate method is created called getFriends to fetch 'followings' data from user profile, which can then be added to 'rightbarFollowings'
    if (user && user._id) { // had to use 'if' statement otherwise there'll be an error as react will pull an empty and invalid _id first
      const getFriends = async () => {
        try {
          const friendList = await axios.get("/users/friends/" + user._id);
          setFriends(friendList.data);
        } catch(err) {
          console.log(err);
        }
      }
      getFriends();
    };
  },[user])

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put("/users/" + user._id+"/unfollow", {userId:currentUser._id});
        dispatch({type:"UNFOLLOW", payload:user._id});
      } else {
        await axios.put("/users/" + user._id+"/follow", {userId:currentUser._id}) 
        dispatch({type:"FOLLOW", payload:user._id});
      }
    } catch(err) {
      console.log(err);
    };
    setFollowed(!followed); // this changes the state of the 'followed' button
  }

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img src="assets/post/gift.png" alt="" className="birthdayImg" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birthday today</span>
        </div>
        <img src="assets/post/ad.png" alt="" className="rightbarAd" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
            {Users.map((u)=>(
            <Online user={u} key={u._id}/>
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
      {user.username !== currentUser.username && (
        <button className="rightbarFollowButton" onClick={handleClick}>
          {followed ? "Unfollow" : "Follow"}
          {followed ? <RemoveIcon /> : <AddIcon />} 
        </button>
      )}
        <h4 className="rightbarTitle">User Information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">{user.relationship === 1 ? "Single": user.relationship === 2 ? "Married" : "-"}</span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link to={"/profile/"+friend.username} style={{textDecoration:"none"}}>
            <div className="rightbarFollowing">
              <img src= {friend.profilePicture ? PF+friend.profilePicture : PF + "person/noAvatar.png"} alt="" className="rightbarFollowingImg" />
              <span className="rightbarFollowingName">{friend.username}</span>
            </div>
            </Link>
          ))}
        </div>
      </>
    )
  }

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar/> : <HomeRightbar/>}
      </div>
    </div>
  )
}

