import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import heartred from '../icons/heartred.svg';
import heartwhite from '../icons/heartwhite.svg';
// import speechbubble from '../icons/speechbubble.svg';
const Post = ({ data }) => {
    const history = useHistory();
    const [liked, setLiked] = useState(false);
    const time = new Date(data.time);
    useEffect(function () {
        if (!localStorage.getItem('isAuthenticated')) return;
        const config = {
            credentials: 'include'
        }
        fetch(`/api/post/${data._id}/isLiked`, config)
            .then(res => res.json())
            .then(data => {
                if (data.message === true) {
                    setLiked(true);
                }
            }).catch(response => console.log(response));
    }, [data]);
    return (<div className="post">
        <img src={data.profileImage} className="post-profilePhoto" alt={data.name} loading="lazy" />
        <Link to={`/${data.username}`}>
            <div className="post-name">{data.name}</div>
            <div className="post-username">{data.username}</div>
        </Link>
        <div className="post-content">{data.content}</div>
        <div className="post-time">{time.toLocaleString()}</div>
        <div className="post-interaction">
            <div className="like" >
                <span className="like-svg" onClick={handleLike}>
                    <img src={liked ? heartred : heartwhite} alt="Like" height="15px" width="15px" /></span>
                {data.likeCount > 0 && <span className="post-like">{data.likeCount}</span>}
            </div>
            {/* <div className="comment">
                <span className="comment-svg"><img src={speechbubble} alt="Comment" height="15px" width="15px" /></span>
                {data.commentCount > 0 && <span className="post-comment">{data.commentCount}</span>}
            </div> */}
        </div>
    </div>);
    function handleLike() {
        if (localStorage.getItem('isAuthenticated') === 'false' || localStorage.getItem('isAuthenticated') === null)
            return history.push('/account');
        let x = '';
        if (liked)
            x = 'unlike';
        else
            x = 'like'
        fetch(`/api/post/${data._id}/${x}`)
            .then(res => res.json())
            .then(({ message }) => {
                if (message === 'Post liked') {
                    data.likeCount += 1;
                    setLiked(prev => !prev);
                }
                if (message === 'Post unliked') {
                    data.likeCount -= 1;
                    setLiked(prev => !prev);
                }
            })
            .catch(response => {
                console.log(response);
            });
    }
}

export default Post;