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
                 fullName: "",
                 profilePic: null
             },
            successMessage: "",
            errorMessage: "",
            uploadStatus: ""
        }
        
        this.getUserDetails();
    }

    getUserDetails = () => {
        
        axios.get("http://localhost:1050/fetchUserDet/"+this.state.userName).then(res=>{
            
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

    profilePicSelected = ( event ) => {
        this.setState({
            update: {
                ...this.state.update,["profilePic"]: event.target.files[0] 
            }
        })
    }

    uploadProfilePic = () => {
        let url = 'http://localhost:1050/editProfilePic/'+this.state.userName;
        const fd = new FormData();
        fd.append('profilePic', this.state.update.profilePic, this.state.update.profilePic.name);
        axios.put(url, fd,{
            onUploadProgress: ProgressEvent => {
                    let val = Math.round(ProgressEvent.loaded / ProgressEvent.total * 100)
                    if(val<100){
                        this.setState({
                            uploadStatus: "uploading..."
                        })
                    }
                }
        }).then(res=>{
            console.log(res.data)
            this.setState({
                successMessage: res.data,
                errorMessage: "",
                uploadStatus: ""
            })
        }).catch(err=>{
            this.setState({
                errorMessage: "Update failed!",
                successMessage: "",
                uploadStatus: ""
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
                                        <span>Select profile picture</span>
                                    </div>
                                    <div className="col-6">
                                        <input type="file" onChange={this.profilePicSelected}/>
                                        {this.state.uploadStatus}
                                    </div>
                                    <div className="col-3">
                                        <button className="btn btn-primary"
                                        onClick={this.uploadProfilePic}
                                        disabled={this.state.update.profilePic===null ? true: false}>
                                            Upload image
                                        </button>
                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className="col-3">
                                        <span>enter full name</span>
                                    </div>
                                    <div className="col-6">
                                        <input type="text" className="form-control" 
                                        name = "fullName"
                                        onChange={this.handleChange}
                                        placeholder={this.state.name}/>
                                    </div>
                                    <div className="col-3">
                                        <button className="btn btn-primary" 
                                        onClick={this.updatefullName}
                                        disabled={this.state.update.fullName === ""?true:false}>
                                            Update name
                                        </button>
                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className="col-3">
                                        <span>enter bio</span>
                                    </div>
                                    <div className="col-6">
                                        <input type="text" className="form-control" 
                                        name = "bio"
                                        onChange={this.handleChange}
                                        placeholder={this.state.bio}/>
                                    </div>
                                    <div className="col-3">
                                        <button className="btn btn-primary" onClick={this.updateBio}
                                         disabled={this.state.update.bio === ""?true:false}>
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
