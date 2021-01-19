import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import '../styles/accountStyle.css';
import Posts from './Posts';
const Account = () => {
    const [userDetail, setUserDetail] = useState({});
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('Posts');
    const [loggedin, setLoggedin] = useState(false);
    const [renderPossible, setRenderPossible] = useState(true);
    const { pathname } = useLocation();
    const history = useHistory();
    useEffect(function () {
        const config = {
            credentials: 'include'
        }
        const url = pathname === '/account' ? '/api/whoami' : `/api${pathname}`;
        fetch(url, config)
            .then(res => res.json())
            .then(data => {
                if (data.message === 'User not Logged In') {
                    setLoading(false);
                    return setLoggedin(false);
                }
                if (data.message === 'No user found') {
                    setLoading(false);
                    return setRenderPossible(false);
                }
                if(pathname === '/account' ){
                    localStorage.setItem('isAuthenticated', true);
                    setLoggedin(true);
                }
                setUserDetail({
                    name: data.name,
                    username: data.username,
                    profilePhoto: data.profilePhoto,
                    followerCount: data.followerCount,
                    followingCount: data.followingCount,
                    postCount: data.postCount,
                });
                setLoading(false);
            })
            .catch(response => {
                console.log(response)
            });
    }, [pathname]);
    if (loading) {
        return (<h2>Loading...</h2>)
    } else if (!loggedin && pathname === '/account') {
        return (<>
            <h1>User not Authorized yet</h1>
            <a style={{ color: "blue" }} href="/api/auth/github">Click to authorize with GitHub</a>
        </>)
    } else if (loggedin && pathname === '/account') {
        return <RenderAccount />;
    } else if(renderPossible){
        return(<RenderAccount/>)
    }else{
        return (<h1>404 This page doesn't exist</h1>);
    }
    function RenderTab({ tab, username }) {
        // const { pathname } = useLocation();
        if (tab === "Posts") {
            return (<Posts url={`api/${username}/posts`} />)
        }
        // if (tab === "Followers") {
        //     return (<h1>{tab}</h1>);
        // }
        // if (tab === "Following") {
        //     return (<h1>{tab}</h1>);
        // }
    }
    function handleLogout(){
        const config = {
            credentials: 'include'
        }
        fetch('/api/auth/logout', config)
        .then(res => res.json())
        .then(data => {
            if(data.message === 'User Logged Out'){
                localStorage.setItem('isAuthenticated', false);
                history.push('/');
            }
        }).catch(response => console.log(response));   
    }
    function RenderAccount() {
        return (
            <div className="account">
                {pathname === '/account' && <button onClick={handleLogout} className="logoutbtn">Logout</button>}
                <img className="account-profilePhoto" src={userDetail.profilePhoto} alt={userDetail.name} loading="lazy" />
                <div className="account-name">{userDetail.name}</div>
                <div className="account-username">{userDetail.username}</div>
                <div className="account-interaction">
                    <span className="account-postCount">{userDetail.postCount}{userDetail.postCount === 1 ? " Post" : " Posts"} </span>
                    {/* <span className="account-followerCount">{userDetail.followingCount} Following </span>
                    <span className="account-followerCount">{userDetail.followerCount}{userDetail.followerCount > 1 ? " Followers" : " Follower"} </span> */}
                </div>
                <div className="account-tab">
                    <div className="tab active tab-posts" onClick={() => setTab("Posts")}><h2>Posts</h2></div>
                    {/* <div className="tab tab-followers" onClick={() => setTab("Followers")}>Followers</div>
                    <div className="tab tab-following" onClick={() => setTab("Following")}>Following</div> */}
                </div>
                <hr />
                <div className="account-tab-result">
                    {<RenderTab tab={tab} username={userDetail.username} />}
                </div>
            </div>
        );
    }
}

export default Account;