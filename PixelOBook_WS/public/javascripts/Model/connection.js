const{ Schema } = require( "mongoose" );
const Mongoose = require( "mongoose" )
Mongoose.Promise = global.Promise;
Mongoose.set( 'useCreateIndex', true )
const url = "mongodb://localhost:27017/PixelOBook";



const Posts = Schema( {
    '_id': {type: String, required: true},
    'postImg': {type: String, required: true},
    'likes': {type: Number, required: true},
    'uploadTime': {type: String, required: true},
    'comments': {type: [], required: true}
}, {collection: "Posts"} )

const Users = Schema( {
    '_id': {type: String},
    'userName': {type: String, required: true},
    'fullName': {type: String, required: true},
    'emailId': {type: String, required: true},
    'password': {type: String, required: true},
    'profilePic': {type: String},
    'bio': {type: String, default: 'Hey there! I joined PixelOBook.'},
    'followers': {type: [], required: true},
    'following': {type: [], required: true},
    'posts': {type: [], required: true}
}, { collection: "Users" } )




let collection = {};

collection.getPostsCollection = () => {
    return Mongoose.connect( url, { useNewUrlParser: true } ).then( ( database ) => {
        return database.model( 'Posts', Posts )
    } ).catch( () => {
        let err = new Error( "Could not connect to Database" );
        err.status = 500;
        throw err;
    } )
}

collection.getUsersCollection = () => {
    return Mongoose.connect( url, { useNewUrlParser: true } ).then( ( database ) => {
        return database.model( 'Users', Users )
    } ).catch( () => {
        let err = new Error( "Could not connect to Database" );
        err.status = 500;
        throw err;
    } )
}


module.exports = collection;