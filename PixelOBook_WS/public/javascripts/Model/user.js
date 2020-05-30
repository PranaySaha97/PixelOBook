const dbModel= require( './connection' )

const pixelOBookDB = {}

pixelOBookDB.generateId = () => {
    return dbModel.getPostCollection().then( ( model ) => {
        return model.distinct( "_id" ).then( ( ids ) => {
            let pId = Math.max( ...ids );
            return pId + 1;
        } )
    } )
}

pixelOBookDB.findUser= ( uname, password ) =>{
    return dbModel.getUsersCollection().then( ( users )=>{
        return users.findOne( {"userName": uname},{'_id': 0} ).then( ( data )=>{
            if( !data ) {
                let err= new Error( 'User Credentials Mismatch !' )
                err.status= 400;
                throw err
            }
            else return data
        } )
    } )
}

pixelOBookDB.regUser = (userObj) => {
    return dbModel.getUsersCollection().then( (users)=>{
        return users.insertMany([userObj, ]).then( 
                (data) => {
                    if (data){
                        return 'User Registered Successfully'
                    }else {
                        let err= new Error( 'Unable to Register User !' )
                        err.status= 500;
                        throw err
                    }
                } 
            )
    } )
}

pixelOBookDB.updateProfilePic = (uname, newPath) => {
    return dbModel.getUsersCollection().then(
        (user) => {
            return user.updateOne({'userName': uname},{$set : { 'profilePic': newPath }}).then(
                (update) => {
                    if (update.nModified === 1){
                        return "Profile Pic Updated Successfully."
                    }else {
                        let err= new Error (" Couldn't update profile pic.")
                        err.status= 400;
                        throw err
                    }
                }
            )
        }
    )
}

pixelOBookDB.updateFullName = (username, fullName) => {
    return dbModel.getUsersCollection().then(
        (users) => {
            return users.updateOne({'userName': username},{$set: {'fullName': fullName}}).then(
                (update) => {
                    if ( update.nModified === 1) {
                        return "Full Name Updated Successfully."
                    }else {
                        let err= new Error (" Couldn't update full name.")
                        err.status= 400;
                        throw err
                    }
                }
            )
        }
    )
}

pixelOBookDB.updateBio = (username, bio) => {
    return dbModel.getUsersCollection().then(
        (users) => {
            return users.updateOne({'userName': username},{$set: {'bio': bio}}).then(
                (update) => {
                    if ( update.nModified === 1) {
                        return "User Bio Updated Successfully."
                    }else {
                        let err= new Error (" Couldn't update bio.")
                        err.status= 400;
                        throw err
                    }
                }
            )
        }
    )
}

pixelOBookDB.addPost = (uname, post) => {

    return pixelOBookDB.generateId().then(
        (id) => {
            post._id = id

            return dbModel.getPostCollection().then(
                (posts) =>{
                    return posts.insertMany([post, ]).then((data)=>{
                        if(data){
                            return dbModel.getUsersCollection().then((users)=>{
                                return users.updateOne( {'userName': uname}, { $push: { 'posts': post._id } }).then(
                                    (update) =>{
                                        if(update.nModified === 1){
                                            return 'Image Posted Successfully'
                                        }else{
                                            let err= new Error (" Couldn't post image.")
                                            err.status= 400;
                                            throw err
                                        }
                                    }
                                )
                            })
                        }
                    })
                }
            )

            // return dbModel.getUsersCollection().then(
            //     (users) => {
            //         return users.updateOne( {'userName': uname}, { $push: { 'posts': post } } ).then(
            //             (update) => {
            //                 if (update.nModified === 1){
            //                     return "Image Posted Successfully."
            //                 }else {
            //                     let err= new Error (" Couldn't post image.")
            //                     err.status= 400;
            //                     throw err
            //                 }
            //             }
            //         )
            //     }
            // )
        }
    )
    
}

pixelOBookDB.fetchAllPost = () => {

    return dbModel.getPostCollection().then(
        (posts) => {
            return posts.find().then(
                (data) => {
                    if (data){
                        return data
                    }else{ 
                        let err= new Error ("Couldn't fetch posts.")
                        err.status= 400;
                        throw err
                    }
                }
            )
        }
    )
}

pixelOBookDB.fetchAllUserNames = () => {
    return dbModel.getUsersCollection().then(
        (users) => {
            return users.find( {}, {_id:0, "userName":1, "fullName": 1, "profilePic": 1} ).then(
                (data) => {
                    if (!data || data.length === 0){
                        let err= new Error ("Couldn't fetch usernames.")
                        err.status= 400;
                        throw err
                    }else {
                        return data
                    }
                }
            )
        }
    )
}

pixelOBookDB.followUser = (uname, to_follow) => {
    return dbModel.getUsersCollection().then(
        (users) => {
            return users.updateOne({'userName': uname}, { $push: {'following': to_follow} }).then(
                (update) => {
                    if (update.nModified === 1){
                        return users.updateOne( {'userName': to_follow} , {$push: {'followers': uname}}).then(
                            (update_1) => {
                                if(update_1.nModified === 1){
                                    return "You are now following "+to_follow
                                }else {
                                    let err= new Error ("Couldn't follow user")
                                    err.status= 400;
                                    throw err
                                }
                                
                            }
                        )
                    }  
                }
            )
        }
    )
}

pixelOBookDB.getFollowersPost = (uname) => {
    return dbModel.getUsersCollection().then(
        (users) => {
            return users.findOne({'userName': uname}, {'_id':0, 'following': 1} ).then(
                (result) => {
                    if (result){
                        return users.find({'userName': {$in: result.following}},{'_id':0, 'posts':1}).then(
                            (data) => {
                                if(data){
                                    return data
                                }else {
                                    let err= new Error ("Nothing to show yet.")
                                    err.status= 400;
                                    throw err
                                }
                            }
                        )
                    }else {
                        let err= new Error ("No followers yet.")
                        err.status= 400;
                        throw err
                    }
                }
            )
        }
    )
}

pixelOBookDB.getPost = (postId) => {
    return dbModel.getPostCollection().then(
        (posts) => {
            return posts.findOne({'_id': postId}, {}).then(
                (posts) => {
                    if (posts){
                        return posts
                    }else {
                        let err= new Error ("No posts fetched.")
                        err.status= 400;
                        throw err
                    }
                }
            )
        }
    )
}

pixelOBookDB.getMyPosts = (uname) => {
    return dbModel.getUsersCollection().then( (users) =>{ 
        return users.findOne({'userName': uname}, {'_id':0, 'posts': 1}).then(
            (data) =>{
                if (data){
                    return dbModel.getPostCollection().then((posts)=>{
                        return posts.find({'_id': {$in: data.posts}},{'_id':0, 'postImg':1}).then((data)=>{
                            if(data){
                                return data
                            }else{
                                let err= new Error ("No posts fetched.")
                                err.status= 400;
                                throw err
                            }
                        })
                    })
                }else{
                    let err= new Error ("No posts fetched.")
                    err.status= 400;
                    throw err
                }
            }
        )
    })
}


pixelOBookDB.likePost = (postId) => {
    return dbModel.getPostCollection().then((posts)=>{
        return posts.updateOne({'_id': postId}, {$inc: {'likes': 1}}).then((update)=>{
            if(update.nModified){
                return "Post Liked!"
            }else{
                let err = new Error ('Unable to like.')
                err.status= 400
                throw err
            }
        })
    })
}


pixelOBookDB.unlikePost = (postId) => {
    return dbModel.getPostCollection().then((posts)=>{
        return posts.updateOne({'_id': postId}, {$inc: {'likes': -1}}).then((update)=>{
            if(update.nModified){
                return "Post Unliked!"
            }else{
                let err = new Error ('Unable to dislike.')
                err.status= 400
                throw err
            }
        })
    })
}

pixelOBookDB.addComment = (postId, user, comment) =>{
    var comObj = {
        'userName': user,
        'comment': comment
    }
    return dbModel.getPostCollection().then((posts)=>{
        return posts.updateOne({'_id': postId}, {$push: {'comments': comObj}}).then((update)=>{
            if(update.nModified){
                return "Comment Posted!"
            }else{
                let err = new Error ('Unable to post comment.')
                err.status= 400
                throw err
            }
        })
    })
}


pixelOBookDB.deletePost = (uname, postId) =>{
    return dbModel.getUsersCollection().then((users)=>{
        return users.updateOne({'userName': uname}, {$pull : {'posts': parseInt(postId)}}).then((update)=>{
            if(update.nModified === 1){
                return dbModel.getPostCollection().then((posts)=>{
                    return posts.deleteOne({'_id': postId}).then((del)=>{
                        if (del.deletedCount === 1){
                            return 'Post deleted'
                        }else{
                            let err = new Error ('Unable to delete post.')
                            err.status= 400
                            throw err
                        }
                    })
                })
            }else{
                let err = new Error ('Unable to update posts of user.')
                err.status= 400
                throw err
            }
        })
    })
}

module.exports= pixelOBookDB;
