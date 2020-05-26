import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { createBrowserHistory as history} from 'history';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import EditProfile from './components/EditProfile';

export class App extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
      userName: "",
      name: "",
      isLoggedin: false
    }
  }

  setName = (name, userName) => {
    
    this.setState({
      userName: userName,
      name: name,
      isLoggedin: true
    })
  }

  logout = () => {
    this.setState({
      userName: "",
      name: "",
      isLoggedin: false
    })
  }
  
  render() {
    return (
      <Router>
      <div>
        <nav className="navbar navbar-expand-lg bg-custom">
          <span className="navbar-brand">
            Pixel-O-Book
          </span>
          {
            this.state.isLoggedin?
            <ul className="navbar-nav ml-auto">
              <li className="nav-link">
                Welcome, {this.state.name}
              </li>
              <li className="navbar-nav nav-link">
                <Link to="/editProfile">
                  <button className="nav-button-main grow">Edit profile</button>
                </Link>
              </li>
              <li className="navbar-nav nav-link">
                <button className="nav-button-main grow" onClick={this.logout}>Log out</button>
              </li>
            </ul>
            : null
          }
        </nav>
        {
          this.state.isLoggedin?
          <Redirect to={"dashboard/"} push/>
          :
          <Redirect to={"/"} push/>
        }
      </div>
      <Switch>
        <Route path="/" exact render={() => <Login setName={this.setName}/> }  />
        <Route path="/register" exact component={Register} /> }  />
        <Route path="/dashboard" exact render={() => <Dashboard name = {this.state.name} userName = {this.state.userName} />} />
        <Route path="/editProfile" exact render={() => 
        <EditProfile name = {this.state.name} 
                    userName = {this.state.userName}
                    setName={this.setName} />} />
      </Switch>
    </Router>
    )
  }
}



export default App;
