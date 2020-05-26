const{ Schema } = require( "mongoose" );
const Mongoose = require( "mongoose" )
Mongoose.Promise = global.Promise;
Mongoose.set( 'useCreateIndex', true )
const url = "mongodb://localhost:27017/PixelOBook";


const Users = Schema( {
    '_id': {type: String},
    'userName': {type: String, required: true, unique: true},
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