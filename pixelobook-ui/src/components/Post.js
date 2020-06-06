import React, { Component } from 'react';
import axios from 'axios';
import ThumbUpAltSharpIcon from '@material-ui/icons/ThumbUpAltSharp';
import CommentIcon from '@material-ui/icons/Comment';
import { useHistory } from 'react-router-dom';



export class Post extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            userName: this.props.match.params.userName,
             post_id: this.props.match.params.id,
             postDet: null,
             comments: [],
             postImg: null,
             liked: false,
             comment: "",
             successMessage: "",
             errorMessage: ""

        }
    }

    componentDidMount = () => {
        axios.get('http://localhost:1050/getPost/'+this.state.post_id).then(res=>{
            this.setState({
                postDet: res.data,
                comments: res.data.comments
            }, ()=> {
                axios.get('http://localhost:1050/'+this.state.postDet.postImg, { responseType : 'arraybuffer' }).then(res=>{
                
                let base64 = btoa(
                    new Uint8Array(res.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    '',
                ),
                );
                this.setState({
                    postImg: "data:;base64," + base64
                })
                });
            })
        })
        
    }

    liked = (img) => {
        let postId = this.state.post_id
        axios.put('http://localhost:1050/likePost/'+postId).then(res=>{
            this.setState({
                liked: true
            })
        })
    }
    
    handleCommentChange = ( event ) => {
        let value = event.target.value;
        this.setState({
            comment: value
        })
    }
    
    postComment = ( event ) => {
        event.preventDefault();
        let obj = {
            comment: this.state.comment
        }
        axios.put('http://localhost:1050/addComment/'+this.state.post_id+'/'+this.state.userName, obj).then(res=>{
            this.setState({
                successMessage: res.data,
                errorMessage: ""
            })
        }).catch(err=>{
            this.setState({
                errorMessage: "Unable to post comment",
                successMessage: ""
            })
        })
    }   

 

    render() {
        
        return (
            <div className="container-fluid">
                <div className="row mt-3">
                    <div className="col-md-3 col-sm-12">
                            <button className="btn btn-danger" onClick={()=>{this.props.history.goBack()}}>
                                back to dashboard
                            </button>
                    </div>
                    <div className="col-md-6 col-sm-12">
                        {
                            this.state.postDet === null && this.state.postImg === null?
                            <div className="alert alert-info">loading post please wait...</div>
                            :
                            <div className="card">
                                <div className="card-body post-pic">
                                    <img src={this.state.postImg}  alt="postimg" />
                                </div>
                                
                                {
                                    this.state.comments.map(comment=>(
                                        <div className="text-dark container-fluid">{comment.userName} : {comment.comment}</div>
                                    ))
                                }

                                <div className="card-footer">
                                    <button className="btn btn-white grow" onClick={()=>this.liked()}>
                                        <ThumbUpAltSharpIcon className={this.state.liked? 'text-primary' : 'text-secondary' }/>
                                    </button>
                                    &nbsp;
                                    <div>
                                        <form onSubmit={this.postComment}>
                                            <div className="form-group">
                                                <label htmlFor="comment">Add your comment</label>
                                                <input type="text" className="form-control" onChange={this.handleCommentChange} />
                                            </div>
                                            <button type="submit" className="btn btn-info grow">
                                                    Post comment<CommentIcon />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                           
                        }
                        {
                            this.state.successMessage != ""?
                            <div className="alert alert-success">{this.state.successMessage}</div>
                            :
                            this.state.errorMessage != ""?
                            <div className="alert alert-danger">{this.state.errorMessage}</div>:
                            null


                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Post
