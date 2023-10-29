import "./share.css"
import PermMediaIcon from '@mui/icons-material/PermMedia';
import LabelIcon from '@mui/icons-material/Label';
import PlaceIcon from '@mui/icons-material/Place';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useContext, useRef, useState } from "react";
import {AuthContext} from "../../context/AuthContext";
import axios from "axios";

//IMPORTANT: for uploading images, will have to use CDN tool eg Amazon (S3?), Firebase 

export default function Share() {
  const {user} = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault()
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };
    // the following means: if there is a file, new FormData will be created, the file as well as its name will be indicated. And it will also 'try' to upload the file
    // the following 'if' statement will have to be edited in the future. perhaps to adapt to another tool
    if (file) {
      const data = new FormData();
      const fileNameToServer = Date.now() + file.name //extremely important. This is exported to the client side and ensures it's stored in the correct place with the correct name
      const fileName = "post/" + fileNameToServer; // need the "post/" so that the img file name is saved correctly in mongoDB
      data.append("file",file);
      data.append("name",fileName);
      // line below will add the img to the newPost 
      newPost.img = fileName;
      try {
        // the new post with the attachment will be uploaded
        await axios.post("/upload?name=" + encodeURIComponent(fileNameToServer), data);
      } catch(err) {
        console.log(err);
      }
    } 
    try {
      // the new post with the words will be uploaded
      await axios.post("/posts", newPost);
      // reload will refresh the page
      // IMPORTANT: can also create a 'post' context and update 'post' state. Will need to research how to do this.
      window.location.reload()
    } catch(err){
      console.log(err);
    }
  }

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img src={user.profilePicture ? PF + user.profilePicture : PF+"person/noAvatar.png"} alt="" className="shareProfileImg"/>
          {/* we can allow users to post their complaints. If he/she has insurance, no need for payment option. All covered by isnurance */}
          <input placeholder={"What is your main complaint " + user.username + "?"} className="shareInput" ref={desc}/>
        </div>
        <hr className="shareHr"/>
        {/* creating a method to allow for chosen video/photo to be seen just before sharing */}
        {file && (
          <div className="shareImgContainer">
            <img src={URL.createObjectURL(file)} alt="" className="shareImg" /> 
            {/* the URL allows us to create a pseudo-URL to see the file before uploading */}
            <HighlightOffIcon className="shareCancelImg" onClick = {() => setFile(null)}/>
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMediaIcon htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              {/* the following code accepts only the file types stated, and can upload only one file as 'files[0]' */}
              <input style={{display:"none"}} type="file" id="file" accept = ".png,.jpg,.jpeg,.pdf" onChange={(e)=>setFile(e.target.files[0])}/>
            </label>
            <div className="shareOption">
              <LabelIcon htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <PlaceIcon htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotionsIcon htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Emotions</span>
            </div>
          </div>
          <button className="shareButton" type="submit">Share</button>
        </form>
      </div>
    </div>
  )
}
