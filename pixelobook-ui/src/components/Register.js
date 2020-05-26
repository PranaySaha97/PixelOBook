import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

export class Register extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             form: {
                 name: "",
                 userName: "",
                 password: "",
                 reEnterPassword: "",
                 emailid: ""
             },
             formErrMessage: {
                nameError: "",
                userNameError: "",
                passwordError: "",
                reEnterPasswordError: "",
                emailidError: ""
            },
             formValid: {
                 nameValid: false,
                 userNameValid: false,
                 passwordValid: false,
                 reEnterPasswordValid: false,
                 emailidValid: false,
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

    validateForm = ( name, value) => {
        let message = "";
        let validity = false;
        switch ( name ) {
            case "name":
                value === "" ? message = "field required" : message = "";
                break;
            case "userName":
                let regexUsername = new RegExp(/^[A-z0-9]{5,}$/);
                value === "" ? message = "field required" : regexUsername.test(value) ? message = "" : message = "Username should contain atleast 5 characters";
                break;
            case "password":
                value === "" ? message = "field required" : value.length < 5 ? message = "Password is weak" : message = "";
                break;
            case "reEnterPassword":
                value !== this.state.form.password ? message = "Passwords don't match" : message = "";
                break;
            case "emailid":
                let regexEmail = new RegExp(/^[A-z0-9]+[@][A-z]+\.[A-z]+$/)
                value === "" ? message = "field required" : regexEmail.test(value) ? message = "" : message = "Enter a valid email id";
                break;
            default:
                break;
        }
        let formErrMessageObj = this.state.formErrMessage;
        formErrMessageObj[name+"Error"] = message;
        this.setState({
            formErrMessage: formErrMessageObj
        });
        validity = message === "" ? true : false;
        let formValidObj = this.state.formValid;
        formValidObj[name+"Valid"] = validity;
        formValidObj.btnValid = formValidObj.userNameValid && formValidObj.passwordValid 
                            && formValidObj.reEnterPasswordValid && formValidObj.emailidValid;
        this.setState({
            formValid: formValidObj
        });
    }


    handleSubmit = ( event ) => {
        event.preventDefault();
        let userObj = {
                _id: "",
                userName: this.state.form.userName,
                fullName: this.state.form.name,
                emailId: this.state.form.emailid,
                password: this.state.form.password,
                profilePic : "",
                bio : "",
                followers: [],
                following: [],
                posts: []
        }
        
        axios.post("http://localhost:1050/registerUser",userObj).then(res=>{
            console.log(res.data)
            this.setState({
                successMessage: res.data,
                errorMessage: ""
            })
        }).catch(err=>{
            this.setState({
                errorMessage: "User not registered!",
                successMessage: ""
            })
        })
    }
    
    render() {
        let errMessage = this.state.formErrMessage;
        return (
            <div>
                <div className="row mt-5 container-fluid">
                    <div className="banner-section">
                        <img src={require('./Assets/banner.jpg')} alt="banner"/>
                    </div>
                    <div className="col-md-4 offset-md-8 col-sm-12 ">
                        <div className="card box">
                            <div className="card-header">
                                <h3>Register for new user</h3>
                            </div>
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="name">Name:</label>
                                        <input type="text" name="name" id="name" 
                                        className="form-control" placeholder="Enter full name" 
                                        onChange={this.handleChange}/>
                                    </div>
                                    <div className="text-danger">{errMessage.nameError}</div>
                                    <div className="form-group">
                                        <label htmlFor="userName">Username:</label>
                                        <input type="text" name="userName" id="userName" 
                                        className="form-control" placeholder="Enter username" 
                                        onChange={this.handleChange}/>
                                    </div>
                                    <div className="text-danger">{errMessage.userNameError}</div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password:</label>
                                        <input type="password" name="password" id="password" 
                                        className="form-control" placeholder="Enter password" 
                                        onChange={this.handleChange}/>
                                    </div>
                                    <div className="text-danger">{errMessage.passwordError}</div>
                                    <div className="form-group">
                                        <label htmlFor="reEnterPassword">Re-enter Password:</label>
                                        <input type="password" name="reEnterPassword" id="reEnterPassword" 
                                        className="form-control" placeholder="Re-enter password" 
                                        onChange={this.handleChange}/>
                                    </div>
                                    <div className="text-danger">{errMessage.reEnterPasswordError}</div>
                                    <div className="form-group">
                                        <label htmlFor="emailid">Email id:</label>
                                        <input type="text" name="emailid" id="emailid" 
                                        className="form-control" placeholder="Enter email id" 
                                        onChange={this.handleChange}/>
                                    </div>
                                    <div className="text-danger">{errMessage.emailidError}</div>
                                    <Link to={"/"} >
                                        <button type="button" className="btn btn-danger">Back to login</button>
                                    </Link>
                                    &nbsp;
                                    <button type="submit" className="btn btn-dark" 
                                    disabled={!this.state.formValid.btnValid}>Register</button>
                                </form>
                                <div className="text-success">{this.state.successMessage}</div>
                                <div className="text-danger">{this.state.errorMessage}</div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register
