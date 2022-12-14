import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import moment from 'moment';

function Share({ ubahn, city, getPosts }) {
  
  const { user, server } = useContext(AuthContext);
  const text = useRef();
  const [previewFile, setPreviewFile] = useState(null);
  const [imgDataURL, setImgDataURL] = useState(null);

  const sharePost = async (postImg, img_id) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    
    const urlencoded = new URLSearchParams();
    urlencoded.append("author", user._id);
    urlencoded.append("text", text.current.value);
    urlencoded.append("date", new moment().format('MMMM Do YYYY, h:mm:ss a'));
    urlencoded.append("img", postImg);
    urlencoded.append("img_id", img_id);
    if (ubahn) { urlencoded.append("category", "ubahn");
    } else if (city) { urlencoded.append("category", "city") };
    text.current.value = "";
    setImgDataURL(null);
    setPreviewFile(null);
    const requestOptions = { method: "POST", headers: myHeaders, body: urlencoded, redirect: "follow" };
    try {
      const response = await fetch(`${server}/api/posts/share`, requestOptions);
      await response.json();
      alert("Post successfully shared!");
      if (ubahn) {
        getPosts(ubahn);
      } else if (city) {
        getPosts(city);
      };
    } catch (error) {
      console.log("error :>> ", error);
    };
  };

  const uploadPicture = async () => {
    var formdata = new FormData();
    formdata.append("image", previewFile);

    const requestOptions = { method: "POST", body: formdata, redirect: "follow" };
    try {
      const response = await fetch(`${server}/api/posts/imageupload`, requestOptions);
      const result = await response.json();
      sharePost(result.image, result.img_id);
    } catch (error) {
      console.log("error :>> ", error);
    };
  };

  useEffect(() => {
    let fileReader, isCancel = false;
    if (previewFile) {
      fileReader = new FileReader();
      fileReader.onload = (event) => {
        const { result } = event.target;
        if (result && !isCancel) {
          setImgDataURL(result)
        }
      }
      fileReader.readAsDataURL(previewFile);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    }
  }, [previewFile]);

  return (
      <>
        <div className="postDiv">
        <form>
          <div className="postHeader">
            <img src={user.profilePic} alt="userpic" className="postUserPic" />
            <div>
              <h1 className="postUsername">{user.username}</h1>
              <textarea className="postInputText" type="text" name="post-text" ref={text} />
            </div></div>
            <input className="postInput" type="file" accept="image/*" name="img" onChange={(event) => {setPreviewFile(event.target.files[0])}} />
            {imgDataURL && <img src={imgDataURL} alt="post-pic" className="imgPreview" />}
            <div>
            <button className="postButton" type="submit" onClick={(event) => { event.preventDefault(); uploadPicture()}}>Share!</button>
            </div>
          </form>    
        </div>
      </>
  )
}

export default Share