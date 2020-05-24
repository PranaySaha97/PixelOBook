import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import Login from './components/Login';
import Register from './components/Register';


export class App extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
      userName: "",
       isLoggedin: false
    }
  }

  setUserName = (name) => {
    this.setState({
      userName: name,
      isLoggedin: true
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
                Welcome, {this.state.userName}
              </li>
              <li className="navbar-nav nav-link">
              <button className="nav-button-main grow">Log out</button>
              </li>
            </ul>
            : null
          }
        </nav>
        {
          this.state.isLoggedin?
          <Redirect to={"dashboard/"} push/>
          :
          null
        }
      </div>
      <Switch>
        <Route path="/" exact render={()=> <Login setUserName={this.setUserName}/> }  />
        <Route path="/register" exact component={Register} /> }  />

      </Switch>
    </Router>
    )
  }
}



export default App;
