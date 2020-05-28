import React, { Component } from 'react'

class Viewprofile extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             userName: this.props.userName,
             viewerUserName: this.props.viewerUserName,
             fullName: this.props.name
        }
    }
    
    render() {
        return (
            <div>
                {this.state.viewerUserName}
            </div>
        )
    }
}

export default Viewprofile
