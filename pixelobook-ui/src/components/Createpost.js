import React, { Component } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

class Createpost extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userName: this.props.userName,
            fullName: this.props.name,
            img: null,
            caption: "",
            successMessage: "",
            errorMessage: ""
        }
    }

    handleImage = (event) => {
        this.setState({
            img: event.target.files[0]
        },()=>{console.log(this.state.img)})
    }

    handleCaption = (event) => {
        let value = event.target.value;
        this.setState({
            caption: value
        })
    }

    handleSubmit = ( event ) => {
        event.preventDefault()
        let url = 'http://localhost:1050/uploadPost/'+this.state.userName;
        const fd = new FormData();
        let time = new Date();
        fd.append('postImg',this.state.img,this.state.img.name);
        let postObj = {
            aboutImg: this.state.caption,
            uploadTime: time
        }
        axios.put(url,fd).then(res=>{
            this.setState({
                successMessage: res.data,
                errorMessage: ""
            })
        }).catch(err=>{
            this.setState({
                errorMessage: "Failed to post!",
                successMessage: ""
            })
        })

    }

    render() {
        return (
            <div className="container-fluid mt-2">
                <div>
                    <Link to="/dashboard">
                        <button className="btn btn-danger">
                            back to dashboard
                        </button>
                    </Link>
                </div>
                <div className="row mt-3"> 
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
                                <div className="h3">Create post</div>
                            </div>
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <label>Select an image:</label>
                                        &nbsp;
                                        <input type="file" id="img" onChange={this.handleImage}/>
                                    </div>
                                    <div className="form-group">
                                        <input type="text" id="caption" name="caption" className="form-control" 
                                        placeholder="Say something about the picture" onChange={this.handleCaption}/>
                                    </div>
                                    <button type="submit" className="btn btn-info btn-block">
                                        Post
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
        )
    }
}

export default Createpost
