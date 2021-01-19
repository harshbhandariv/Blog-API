// import logo from './logo.svg';
import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Posts from './components/Posts';
import Account from './components/Account';
import Newpost from './components/Newpost';
import Error from './components/ErrorPage';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Posts url="/api/posts" />
        </Route>
        <Route exact path="/account">
          <Account />
        </Route>
        <Route exact path="/newpost">
          <Newpost />
        </Route>
        <Route exact path="/:id">
          <Account />
        </Route>
        <Route path="*">
          <Error />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
