import React, { Component } from 'react';
import 'antd/dist/antd.css'; 
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';

export class Dashboard extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             fullName: this.props.name,
             userName: this.props.userName,
             bio: ""
        }


        this.getUserDetails();
    }

    getUserDetails = () => {
        
        axios.get("http://localhost:1050/fetchUserDet/"+this.state.userName).then(res=>{
            
            this.setState({
                bio: res.data.bio,
                fullName: res.data.fullName
            })
        })

    }

    changeBio = () =>{

    }    


    render() {
        return (
            <div className="container-fluid">
                {/* <Avatar shape="square" size={64} icon={<UserOutlined />} /> */}
                <div className="row mt-3">
                    <div className="col-md-3">
                        <Avatar shape="square" size={180} icon={<UserOutlined />} />
                        <br/>
                        <span className="h3">{this.state.fullName}</span>
                        <br/>
                        {this.state.bio}
                        <br/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard
