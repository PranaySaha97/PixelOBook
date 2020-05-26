const dbModel= require( './connection' )

const pixelOBookDB = {}

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
                        return "User Registered Successfully"
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
    return dbModel.getUsersCollection().then(
        (users) => {
            return users.updateOne( {'userName': uname}, { $push: { 'posts': post } } ).then(
                (update) => {
                    if (update.nModified === 1){
                        return "Image Posted Successfully."
                    }else {
                        let err= new Error (" Couldn't post image.")
                        err.status= 400;
                        throw err
                    }
                }
            )
        }
    )
}

pixelOBookDB.fetchAllPost = () => {
    return dbModel.getUsersCollection().then(
        (users) => {
            return users.find( {}, {_id:0, "posts.postImg":1} ).then(
                (data) => {
                    if (data || data.length>0){
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
            return users.updateOne({'userName': uname}, { $push: {'followers': to_follow} }).then(
                (update) => {
                    if (update.nModified === 1){
                        return "You are now following "+to_follow
                    }else {
                        let err= new Error ("Couldn't follow user")
                        err.status= 400;
                        throw err
                    }
                }
            )
        }
    )
}

module.exports= pixelOBookDB;
