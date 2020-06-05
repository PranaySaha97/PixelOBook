import React, { Component } from 'react';
import axios from 'axios';
import ThumbUpAltSharpIcon from '@material-ui/icons/ThumbUpAltSharp';
import { useHistory } from 'react-router-dom';
import CommentIcon from '@material-ui/icons/Comment';

class Viewprofile extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            viewerUserName: this.props.location.state.viewerUserName,
            userName: this.props.location.state.userName,
            userDet: null,
            profileImg: null,
            postPathArr: [],
            postArr: [],
            followingUser: false
        }
    
        this.getUserDet();
    }

    getUserDet = () => {
        axios.get("http://localhost:1050/fetchUserDet/"+this.state.userName).then(res=>{
            // console.log(res.data);
            this.setState({
                userDet: res.data
            },()=>{
                this.getProfileImg();
                this.getPosts();
            })
        })
    }

    getProfileImg = () => {
        let url = 'http://localhost:1050/'+this.state.userDet.profilePic;
        axios.get( url, { responseType: 'arraybuffer' }).then(res=>{
            
            const base64 = btoa(
                new Uint8Array(res.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    '',
                ),
            );
            this.setState({
                profileImg: "data:;base64," + base64
            })
            
        })
    }
    
    getPosts = () => {
        // console.log("here")
        const pathsArr = [];
        for(let id of this.state.userDet.posts) {
            // console.log(id)
            axios.get('http://localhost:1050/getPost/'+id).then(res=>{
                // console.log(res.data.postImg)
                pathsArr.push(res.data)
                this.setState({
                    postPathArr: pathsArr
                },()=>
                   { 
                    console.log(this.state.postPathArr)
                    this.getPostsImg();
                    }
                )
            })
        }
    }

    getPostsImg = () => {
        let postArr= []
        this.state.postPathArr.forEach(path=>{
            axios.get('http://localhost:1050/'+path.postImg, { responseType: 'arraybuffer'} ).then(res=>{
                const base64 = btoa(
                    new Uint8Array(res.data).reduce(
                        (data,byte)=> data + String.fromCharCode(byte),
                        '',
                    ),
                );
                let obj = {data: "data:;base64," + base64 , likes: path.likes}
                
                postArr.push(obj)
                this.setState({
                    postArr: postArr
                })

            })
        })
    }

    followUser = ( uNameToFollow ) => {
        let url = 'http://localhost:1050/followUser/'+this.state.viewerUserName+'/'+uNameToFollow;
        axios.put(url,{}).then(res=>{
            this.setState({
                followingUser: true
            })
        }).catch(err=>{
            console.log(err)
        })
    }
    

    render() {
        return (
            <div className="container-fluid"> 
                <div className="mt-2">
                        <button className="btn btn-danger" onClick={()=>{this.props.history.goBack()}}>
                            back to previous page
                        </button>
                </div>
                <div className="row mt-2">
                    <div className="col-md-8 offset-md-2 col-sm-12">
                        {
                            this.state.userDet === null ?
                            <div className="alert alert-info">Loading please wait...</div>
                            :
                            <div>
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-3 col-sm-12">
                                                {this.state.userDet.profilePic?
                                                    <img src={this.state.profileImg} className="profile-pic" alt="profilepic" />
                                                    :
                                                    <img src={require('./Assets/no_img.JPG')} className="profile-pic" alt="no_img" />
                                                }
                                            </div>
                                            <div className="col-md-6 col-sm-12">
                                                <span className="h3">{this.state.userDet.fullName}</span>
                                                <br/>
                                                <span className="h5">@{this.state.userDet.userName}</span>
                                                <br/>
                                                <span className="text-dark">{this.state.userDet.bio}</span>

                                            </div>
                                            <div className="col-md-3 col-sm-12">
                                                <span className="text-info h5">followers: {this.state.userDet.followers.length}</span>
                                                <br/>
                                                <span className="text-info h5">following: {this.state.userDet.following.length}</span>
                                                <br/>
                                                {this.state.userName == this.state.viewerUserName?
                                                    null:
                                                    <button className="btn btn-info follow-btn" onClick={()=>this.followUser(this.state.userName)}
                                                    disabled={
                                                        this.state.userDet.followers.includes(this.state.viewerUserName) || this.state.followingUser ? true : false}>
                                                        {
                                                            this.state.userDet.followers.includes(this.state.viewerUserName) || this.state.followingUser?
                                                                <span>following</span>
                                                                :
                                                                <span>follow</span>
                                                        }
                                                    </button>
                                                }   
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    {
                                        this.state.postArr.length > 0 ?
                                           this.state.postArr.map(post=>(
                                               <div className="col-md-8 offset-md-2 col-sm-12 mt-2">
                                                   <div className="card grow">
                                                       <div className="card-body post-pic" >
                                                        <img src={post.data} />
                                                        </div>
                                                        <div className="card-footer">
                                                            <span className="text-seconday h5">{post.likes}</span>
                                                            &nbsp;
                                                            <ThumbUpAltSharpIcon className="text-primary" />
                                                            &nbsp;
                                                            <span className="text-seconday h5">{this.state.postPathArr[this.state.postArr.indexOf(post)].comments.length}</span>
                                                            <CommentIcon className="text-secondary"/>
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                           ))
                                        :
                                        <div className="alert alert-dark mt-2">No posts by {this.state.userName} yet</div>

                                    }
                                </div>
                            </div> 
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Viewprofile
