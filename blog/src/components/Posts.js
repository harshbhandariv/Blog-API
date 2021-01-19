import React, { useState, useEffect } from 'react';
import '../styles/postStyle.css';
import Post from './Post';

export default function Posts({ url }) {
    const [posts, setPosts] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [thatsall, setThatsall] = useState(false);
    useEffect(function () {
        if (thatsall) return;
        fetch(url + `/${pageNumber}`, {
            credentials: "include"
        }).then(res => res.json()).then(data => {
            if (data.message === false)
                return console.log("No url found");
            if (data.length < 10) {
                setThatsall(true);
            }
            addPosts(data);
            setLoading(false);
        }).catch(response => console.log(response));
    }, [pageNumber, url, thatsall]);
    return (<div className="posts">
        {
            posts.map(post => <Post data={post} key={post._id} />)
        }
        {!loading &&
            <button className="loadMorebtn" onClick={() => setPageNumber(page => (page + 1))}>
                {thatsall ? "You're all set" : 'Load more'}
            </button>}
    </div>
    );
    function addPosts(data) {
        setPosts((prevPost) =>
            [...prevPost,
            ...data.map(post => ({
                content: post.content,
                profileImage: post.postedBy.profilePhoto,
                likeCount: post.likeCount,
                commentCount: post.commentCount,
                _id: post._id,
                name: post.postedBy.name,
                username: post.postedBy.username,
                time: post.time,
                color: post.color,
                bgcolor: post.bgcolor,
            }))]);
    }
}