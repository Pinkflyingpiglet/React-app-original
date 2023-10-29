import "./post.css"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {format} from "timeago.js";
import {Link} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";

// posts may contain:
// (i) patients past complaints
// (ii) topics that patient may be interested in or doctors he/she is following
// (iii) updates/new messages from groups that they're in

export default function Post({post}) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {user: currentUser} = useContext(AuthContext);

  useEffect(() =>{
    setIsLiked(post.likes.includes(currentUser._id))
  },[currentUser._id, post.likes]
  );

  useEffect(() =>{
    const fetchUser = async () =>{
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  },[post.userId]);

  const likeHandler = () =>{
    try {
      axios.put("/posts/"+post._id+"/like", {userId: currentUser._id});
    } catch(err) {}
    // if isLiked is true, then like-1
    setLike(isLiked ? like-1 : like+1)
    // this changes the value of isLiked as it's currently a constant with a set value of 'false'
    setIsLiked(!isLiked)
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
            <div className="postTopLeft">
                <Link to={`/profile/${user.username}`}>
                  <img src={user.profilePicture ? PF + user.profilePicture : PF+"person/noAvatar.png"} alt="" className="postProfileImg" />
                </Link>
                <span className="postUsername">{user.username}</span>
                <span className="postDate">{format(post.createdAt)}</span>
            </div>
            <div className="postTopRight">
                <MoreVertIcon/>
            </div>
        </div>
        <div className="postCenter">
          {/* question mark in next line is for posts that don't have a desc */}
          <span className="postText">{post?.desc}</span>
          <img src={PF+post.img} alt="" className="postImg" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img src={`${PF}post/like.png`} alt="" className="likeIcon" onClick={likeHandler}/>
            <img src={`${PF}post/heart.png`} alt="" className="likeIcon" onClick={likeHandler}/>
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  )
}
