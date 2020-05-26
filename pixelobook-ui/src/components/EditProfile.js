import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import axios from 'axios'


class EditProfile extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             userName: this.props.userName,
             name: this.props.name,
             bio: "",
             update: {
                 bio: "",
                 fullName: ""
             },
            successMessage: "",
            errorMessage: ""
        }
        
        this.getUserDetails();
    }

    getUserDetails = () => {
        
        axios.get("http://localhost:1050/fetchUserDet/"+this.state.userName).then(res=>{
            console.log(res.data)
            this.setState({
                bio: res.data.bio,
                name: res.data.fullName
            })
        })

    }
    
    handleChange = (event) => {
        let value = event.target.value;
        let name = event.target.name;
        this.setState({
            update: {
                ...this.state.update,[name]: value
            }
        })
    }

    updateBio = () => {
        let bioObj = {
            bio: this.state.update.bio
        }
        axios.put('http://localhost:1050/editBio/'+this.state.userName,bioObj).then(res=>{
            console.log(res.data)
            this.setState({
                successMessage: res.data,
                errorMessage: ""
            })
        }).catch(err=>{
            this.setState({
                errorMessage: "Failed to update",
                successMessage: ""
            })
        })
    }

    updatefullName = () => {
        let fullNameObj = {
            fullName: this.state.update.fullName
        }
        axios.put('http://localhost:1050/editFullName/'+this.state.userName,fullNameObj).then(res=>{
            console.log(res.data)
            this.setState({
                successMessage: res.data,
                errorMessage: ""
            })
            this.props.setName(this.state.update.fullName,this.state.userName)
        }).catch(err=>{
            this.setState({
                errorMessage: "Failed to update",
                successMessage: ""
            })
        })

    }
    
    render() {
        return (
            <div className="container-fluid mt-3">
                <div>
                    <Link to="/dashboard">
                        <button className="btn btn-danger">
                            back to dashboard
                        </button>
                    </Link>
                </div>
                <div className="row">
                    <div className="col-md-9 col-sm-12 offset-md-1">
                        {this.state.successMessage !== ""?
                            <div className="alert alert-success">{this.state.successMessage}</div>
                            : this.state.errorMessage !== ""?
                                <div className="alert alert-danger">{this.state.errorMessage}</div>
                                :
                                null
                        }
                        <div className="card mt-2">
                            <div className="card-body">
                            <div className="row">
                                    <div className="col-3">
                                        <span className="h5">enter full name</span>
                                    </div>
                                    <div className="col-6">
                                        <input type="text" className="form-control" 
                                        name = "fullName"
                                        onChange={this.handleChange}
                                        placeholder={this.state.name}/>
                                    </div>
                                    <div className="col-3">
                                        <button className="btn btn-primary" onClick={this.updatefullName}>
                                            Update name
                                        </button>
                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className="col-3">
                                        <span className="h5">enter bio</span>
                                    </div>
                                    <div className="col-6">
                                        <input type="text" className="form-control" 
                                        name = "bio"
                                        onChange={this.handleChange}
                                        placeholder={this.state.bio}/>
                                    </div>
                                    <div className="col-3">
                                        <button className="btn btn-primary" onClick={this.updateBio}>
                                            Update bio
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default EditProfile
