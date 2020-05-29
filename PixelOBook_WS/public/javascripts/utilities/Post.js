class Post {
    constructor(obj) {
        this._id = '',
        this.postName= '',
        this.postImg = '',
        this.aboutImg= ' ',
        this.likes = 0,
        this.uploadTime = '',
        this.comments = []
    }
}

module.exports = Post;