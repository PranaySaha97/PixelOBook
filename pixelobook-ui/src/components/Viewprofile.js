import React, { Component } from 'react';
import axios from 'axios';
import ThumbUpAltSharpIcon from '@material-ui/icons/ThumbUpAltSharp';
import { Link } from 'react-router-dom';

class Viewprofile extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            viewerUserName: this.props.viewerUserName,
            userName: this.props.userName,
            userDet: null,
            profileImg: null,
            postPathArr: [],
            postArr: []
        }
    
        this.getUserDet();
    }

    getUserDet = () => {
        axios.get("http://localhost:1050/fetchUserDet/"+this.state.userName).then(res=>{
            console.log(res.data);
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
        console.log("here")
        const pathsArr = [];
        for(let id of this.state.userDet.posts) {
            console.log(id)
            axios.get('http://localhost:1050/getPost/'+id).then(res=>{
                console.log(res.data.postImg)
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
                },()=>console.log(this.state.postArr))

            })
        })
    }

    render() {
        return (
            <div className="container-fluid"> 
                <div className="mt-2">
                    <Link to="/dashboard">
                        <button className="btn btn-danger">
                            back to dashboard
                        </button>
                    </Link>
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
                                                <img src={this.state.profileImg} className="profile-pic" alt="profilepic" />
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
                                                        </div>
                                                    </div>
                                                </div>
                                           ))
                                        :
                                        null
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
