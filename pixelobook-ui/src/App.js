import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { FaAlignRight } from 'react-icons/fa';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

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
      isLoggedin: false,
      toggle: false
    }
  }

  Toggle = () => {
    this.setState({
      toggle: !this.state.toggle
    })
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
            <Dropdown className="navbar-nav ml-auto">
              <Dropdown.Toggle variant="dark" id="dropdown-basic">
                  Welcome, {this.state.name}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item className="navbar-nav nav-link">
                  <button className="btn btn-white btn-block" >
                    <Link to="/editProfile">
                      <span className="text-dark">Edit profile</span>
                    </Link>
                  </button>
                </Dropdown.Item>
                <Dropdown.Item className="navbar-nav nav-link">
                  <button className="btn btn-white btn-block" onClick={this.logout}>Log out</button>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
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
