import React, { Component } from 'react';
import axios from 'axios';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';



class SearchUsers extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             userName: this.props.userName,
             users: [],
             followedUsers: [],
             userDet: null,
             successMessage: "",
             errorMessage: "",
        }
    this.getAllUsers();
    }

getAllUsers = () => {
    axios.get('http://localhost:1050/fetchUserDet/'+this.state.userName).then(res=>{
        this.setState({
            userDet: res.data
        },()=>console.log(this.state.userDet.following))
    })

    axios.get('http://localhost:1050/fetchAllUserNames').then(res=>{
        this.setState({
            users: res.data
        },()=>this.getProfileImages())
    })
}

getProfileImages = () => {
    const arrImg = [];
    this.state.users.forEach(( user )=>{
        if(user.profilePic){
            let url = 'http://localhost:1050/'+user.profilePic
            axios.get(url, { responseType: 'arraybuffer'} ).then(res=>{
                let base64 = btoa(
                    new Uint8Array(res.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    '',
                ),
                );
            let obj = {
                userName: user.userName,
                fullName: user.fullName,
                profilePic: "data:;base64," + base64
                }
            arrImg.push(obj);
            this.setState({
                users: arrImg
            })
            })
        } else {
            arrImg.push(user);
            this.setState({
                users: arrImg
            })
        }
    })
}

followUser = ( uNameToFollow ) => {
    let url = 'http://localhost:1050/followUser/'+this.state.userName+'/'+uNameToFollow;
    axios.put(url,{}).then(res=>{
        this.setState({
            successMessage: res.data
        })
        let arr = this.state.followedUsers
        arr.push(uNameToFollow)
        this.setState({
            followedUsers: arr
        })
    }).catch(err=>{
        this.setState({
            errorMessage: "Error occured during following try again later :("
        })
    })
}
    
    render() {
        return (
            <div className="container-fluid">
                <div className="row mt-5">
                    <div className="col-md-6 offset-md-3 col-sm-12">
                    {this.state.successMessage !== ""?
                            <div className="alert alert-success">{this.state.successMessage}</div>
                            : this.state.errorMessage !== ""?
                                <div className="alert alert-danger">{this.state.errorMessage}</div>
                                :
                                null
                    }
                        <div className="card">
                            <div className="card-header">
                                Seach for users
                            </div>
                            <div className="card-body">
                                <input type = "text" name = "search" className="form-control"
                                placeholder = "Enter name to search" />
                            </div>
                        </div>
                        <br/>
                        {this.state.users.length > 0 ?
                            this.state.users.map((user)=>
                                this.state.userName != user.userName?
                                        <div>
                                            <div className="card">
                                            <div className="card-body row">
                                                <div className="col-3">
                                                    {user.profilePic?
                                                    <img src={user.profilePic} className="search-img" />
                                                    :
                                                    <Avatar shape="square" size={100} icon={<UserOutlined />} />
                                                    }
                                                </div>
                                                <div className="col-6">
                                                    <span className="h5">{user.fullName}</span>
                                                    <br/>
                                                    <span className="text-dark">@{user.userName}</span>
                                                </div>
                                                <div className="col-3">
                                                    <button className="btn btn-info float-right" 
                                                        onClick={()=>this.followUser(user.userName)}
                                                        disabled = {this.state.userDet.following.includes(user.userName) ||
                                                         this.state.followedUsers.includes(user.userName)} >
                                                             {this.state.userDet.following.includes(user.userName) ||
                                                                this.state.followedUsers.includes(user.userName)?
                                                                 <span>following</span>
                                                                 :
                                                                 <span>follow</span>
                                                             }
                                                    </button>
                                                </div>
                                            </div>
                                            </div>
                                            <br/>
                                        </div>
                                        :
                                        null
                                
                            )
                            :
                            <div className="alert alert-danger">No users to display :(</div>
                            
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchUsers
