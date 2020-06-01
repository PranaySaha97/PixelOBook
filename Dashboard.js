import React, { Component } from 'react';
import 'antd/dist/antd.css'; 
import { Avatar } from 'antd';
import { UserOutlined, LikeTwoTone } from '@ant-design/icons';
import axios from 'axios';
import { Link } from "react-router-dom";
import ThumbUpAltSharpIcon from '@material-ui/icons/ThumbUpAltSharp';

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
             postImg: [],
             posters: [],
             captions: [],
             liked: []
        }

        this.getUserDetails();
    }

    getUserDetails = () => {
        
        axios.get("http://localhost:1050/fetchUserDet/"+this.state.userName).then(res=>{
            // console.log(res.data)
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
                // console.log("here")
                this.getPosts();

                }).catch(err=>{
                    this.setState({
                        profilePic: null
                    })
                    this.getPosts();
                })
                
            })

        })
    }



    getPosts = () => {
        // console.log(this.state.userName)
        axios.get('http://localhost:1050/getFollowersPosts/'+this.state.userName).then(res=>{
            // console.log(res.data[0])
            // console.log(res.data)
            if(res.data.length !== 0){
                let postIdArr = []
                for(let postIds of res.data){
                    // console.log(postIds.posts)
                    for(let ids of postIds.posts){
                        postIdArr.push(ids)
                    }
                }
                // console.log(postIdArr)
                this.setState({
                    posts: postIdArr
                },()=>{
                    // console.log(this.state.posts)
                    let arrPaths = []
                    let arrCaptions = []
                    for (let postId of this.state.posts){
                        // console.log(postId)
                        axios.get('http://localhost:1050/getPost/'+postId).then(res=>{
                            // console.log(res.data.postImg)
                            // console.log(res.data.aboutImg)
                            arrPaths.push(res.data.postImg)
                            arrCaptions.push(res.data.aboutImg)
                            // console.log(arrPaths)
                            this.setState({
                                postPaths: arrPaths
                            },()=>{
                                // console.log(this.state.captions)
                                this.getPostImg();
                            })
                        }).catch(err=>{
                            console.log(err)
                        })
                    }
                    
                })
            
            } else {
                this.setState({
                    posts: res.data
                })
            }
            }).catch(err=>{
                console.log(err)
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
                // arrImg.push("data:;base64," + base64)
                axios.get('http://localhost:1050/getPost/'+this.state.posts[this.state.postPaths.indexOf(path)]).then(res=>{
                    // console.log(res.data.aboutImg)
                    let obj = {
                        data: "data:;base64," + base64,
                        caption: res.data.aboutImg
                    }
                    arrImg.push(obj)
                    this.setState({
                        postImg: arrImg
                    })
                })
                
            }).catch(err=>{
                console.log(err)
            })
        })
        // console.log(arrImg)
       
    }

    liked = (img) => {
        const liked = this.state.liked;
        let postId = this.state.posts[this.state.postImg.indexOf(img)]
        // console.log(postId)
        axios.put('http://localhost:1050/likePost/'+postId).then(res=>{
            // console.log(res.data);
            liked.push(img);
            this.setState(
               { liked: liked}
            )
            
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
                                <span className="text-white">Create a post</span>
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
                                        <img src={img.data} className="grow"/>
                                        <br/>
                                        {img.caption}
                                    </div>
                                    <div className="card-footer">
                                        {/* {this.state.captions[this.state.postImg.reverse().indexOf(img)]} */}
                                        <button className="btn btn-white grow" onClick={()=>this.liked(img)}>
                                            <ThumbUpAltSharpIcon className={this.state.liked.includes(img)? 'text-primary' : 'text-secondary'}/>
                                        </button>
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
