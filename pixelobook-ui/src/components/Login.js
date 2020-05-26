import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

export class Login extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             form: {
                 userName: "",
                 password: ""
             },
             formValid: {
                userNameValid: false,
                passwordValid: false,
                btnValid: false
             },
             errorMessage: "",
             successMessage: ""

        }
    }

    handleChange = ( event ) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({
            form: {
                ...this.state.form,[name]: value
            }
        });
        this.validateForm(name,value);
    }

    validateForm = ( name, value ) => {
        let message = "";
        let validity = false;
        switch (name) {
            case "userName":
                value === "" ? message = "Username required" : validity = true;
                break;
            case "password":
                value === "" ? message = "Password required" : validity = true;
                break;
            default: 
                break;
        }
        this.setState({
            errorMessage: message
        })
        let formValidObj = this.state.formValid;
        formValidObj[name+"Valid"] = validity;
        formValidObj.btnValid = formValidObj.userNameValid && formValidObj.passwordValid;
        this.setState({
            formValid: formValidObj
        })
    }
    
    handleSubmit = (event) => {
        event.preventDefault();
        let url = "http://localhost:1050/fetchUserDet/"+this.state.form.userName;
        axios.get(url).then(res=>{
            
            if(res.data.password === this.state.form.password){
                this.props.setName(res.data.fullName, res.data.userName)
            } else {
                this.setState({
                    errorMessage: "Incorrect Password"
                })
            }
        }).catch(err=>{
            this.setState({
                errorMessage: "User does not exist please register to continue"
            })
        })
    }
    
    render() {
        return (
            <div>
                <div className="row mt-5 container-fluid">
                    <div className="banner-section">
                        <img src={require('./Assets/banner.jpg')} alt="banner" />
                    </div>
                    <div className="col-md-4 offset-md-8 col-sm-12 mt-5">
                        <div className="card box">
                            <div className="card-header">
                                <h3>Login</h3>
                            </div>
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="userName">Username:</label>
                                        <input type="text" name="userName" id="userName" 
                                        className="form-control" placeholder="Enter username" 
                                        onChange={this.handleChange}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">password:</label>
                                        <input type="password" name="password" id="password" 
                                        className="form-control" placeholder="Enter password" 
                                        onChange={this.handleChange}/>
                                    </div>
                                    <button type="submit" className="btn btn-block btn-primary" 
                                    disabled={!this.state.formValid.btnValid}>Login</button>
                                    <div className="text-danger">{this.state.errorMessage}</div>
                                </form>
                            </div>
                            <div className="card-footer">
                                <Link to="/register">
                                    New user? please click here to register
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login
