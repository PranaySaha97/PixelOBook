class User {
    constructor(obj) {
        this.userName = obj.userName;
        this.password = obj.password;
        this.fullName = obj.fullName;
        this.emailId= obj.emailId;
        this.profilePic = obj.profilePic;
        this.bio = obj.bio;
        this.followers = [];
        this.following = [];
        this.posts = [];
    }
}

module.exports = User;