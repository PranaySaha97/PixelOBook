import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Login from './components/Login';
import Register from './components/Register';


export class App extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
      name: "",
      isLoggedin: false
    }
  }

  setName = (name) => {
    this.setState({
      name: name,
      isLoggedin: true
    })
  }

  logout = () => {
    this.setState({
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
        <Route path="/" exact render={()=> <Login setName={this.setName}/> }  />
        <Route path="/register" exact component={Register} /> }  />
      </Switch>
    </Router>
    )
  }
}



export default App;
