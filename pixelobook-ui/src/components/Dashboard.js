import React, { Component } from 'react';
import 'antd/dist/antd.css'; 
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link } from "react-router-dom";

export class Dashboard extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             fullName: this.props.name,
             userName: this.props.userName,
             bio: "",
             profilePicPath: "",
             profilePic: null,
             posts: [],
             postPaths: [],
             postImg: []
        }


        this.getUserDetails();
        this.getPosts();
    }

    getUserDetails = () => {
        
        axios.get("http://localhost:1050/fetchUserDet/"+this.state.userName).then(res=>{
            
            this.setState({
                bio: res.data.bio,
                fullName: res.data.fullName,
                profilePicPath: res.data.profilePic
            },()=>{
                axios.get('http://localhost:1050/'+this.state.profilePicPath, { responseType: 'arraybuffer'} ).then(res=>{
                    // console.log(res);
                    const base64 = btoa(
                        new Uint8Array(res.data).reduce(
                          (data, byte) => data + String.fromCharCode(byte),
                          '',
                        ),
                      );
                    // console.log(base64)
                    this.setState({
                        profilePic: "data:;base64," + base64
                    })
                })
            })

        })
    }



    getPosts = () => {
        axios.get('http://localhost:1050/fetchAllPosts').then(res=>{
            // console.log(res.data)
            this.setState({
                posts: res.data
            },()=>{
                const arrPaths = [];
                for (let userPost of this.state.posts) {
                    for(let path of userPost.posts) {
                        arrPaths.push(path.postImg);
                    }
                }
                
                this.setState({
                    postPaths: arrPaths
                },()=>this.getPostImg())
            });
            
        })

    }

    getPostImg = () => {
        const arrImg = [];
        // console.log(this.state.postPaths)
        this.state.postPaths.forEach((path)=>{
            axios.get('http://localhost:1050/'+path,  { responseType: 'arraybuffer'} ).then(res=>{
                // console.log(res.data)
                // console.log(res)
                let base64 = btoa(
                    new Uint8Array(res.data).reduce(
                      (data, byte) => data + String.fromCharCode(byte),
                      '',
                ),
                );
                arrImg.push("data:;base64," + base64)
                // console.log(arrImg)
                if(this.state.postPaths.length >= arrImg.length){
                    this.setState({
                        postImg: arrImg
                    });
                }
            })
        })
        
        
        
    }


    render() {
        return (
            <div className="container-fluid">
                {/* <Avatar shape="square" size={64} icon={<UserOutlined />} /> */}
                <div className="row mt-3">
                    <div className="col-md-3 dashboard-section">
                        <div>
                            {this.state.profilePic === null ?
                                <Avatar shape="square" size={180} icon={<UserOutlined />} />
                                :
                                <img src={this.state.profilePic} className="profile-pic"/>
                            }
                            <br/>
                            <span className="h3">{this.state.fullName}</span>
                            <br/>
                            <span className="h5">@{this.state.userName}</span>
                            <br/>
                            {this.state.bio}
                            <br/>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <Link to="/createPost">
                            <button className="btn btn-secondary btn-block">                           
                                <span className="text-white">Create post</span>
                            </button>
                        </Link>
                        <br/>
                        {this.state.postPaths.length == 0?
                            <div className="alert alert-danger">No posts yet :/</div>
                            :
                            this.state.postImg.length == 0?
                            <div className="alert alert-info">Loading your posts... Please wait :)</div>
                            :
                            this.state.postImg.reverse().map((img)=>
                            <div className="container-fluid">
                                <div className="card">
                                    <div className="card-body post-pic">
                                        <img src={img} className="grow"/>
                                    </div>
                                </div>
                                <br/>
                            </div>
                        )
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard
