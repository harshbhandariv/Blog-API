import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/addPostStyle.css';
const Newpost = () => {
    const [text, setText] = useState('');
    const [message, setMessage] = useState('');
    const history = useHistory();
    useEffect(function () {
        setMessage('');
        if (localStorage.getItem('isAuthenticated') === 'false' || localStorage.getItem('isAuthenticated') === null) {
            history.push('/account');
        }
    }, [history]);
    function handleChange(e) {
        setText(e.target.value);
    }
    function handleSubmit(e) {
        if (text === '') return;
        const content = {
            content: text,
            color: 'blue',
            bgcolor: 'red'
        }
        const config = {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(content)
        }
        fetch('/api/post', config).then(res => res.json()).then(data => {
            setMessage('Post created');
        }).catch(response => {
            setMessage('Error occured at the server side');
        });
        setText("");
    }
    return (<div className="addPost">
        <h1>Make a new Post</h1>
        <textarea className="postText" value={text} onChange={handleChange} placeholder="Write something..." />
        <button className="postbtn" onClick={handleSubmit}>Post</button>
        <div className="message">{message}</div>
    </div>);
}

export default Newpost;