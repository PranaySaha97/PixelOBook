const collection = require( './connection' );

var dummyUser = [
    {
        'userName': 'Dummy_user',
        'fullName': 'Dummy User',
        'emailId': 'dummy.user@gmail.com',
        'password': 'dummy_pass',
        'profilePic': '',
        'bio': '',
        'followers': [],
        'following': [],
        'posts': [
            '1001', 
        ]    
    }
]


var dummyPost = [
    {
        '_id' : '1001',
        'postName': 'dummy Post',
        'postImg': 'dummy path//',
        'aboutImg': 'dummy data',
        'likes' : 0,
        'uploadTime' : 'dummy data',
        'comments' : [ {'userName':'dummy', 'comment':'dummy data'}, ]
    }
]   

exports.setupDb = () => {

    return collection.getPostCollection().then( ( posts ) => {
        return posts.deleteMany().then( () => {
            return posts.insertMany( dummyPost ).then( () => {
                return collection.getUsersCollection().then( ( users ) => {
                    return users.deleteMany().then( () => {
                        return users.insertMany( dummyUser ).then( ( data ) => {
                            if( data ) return"Insertion Successfull !"
                            else{
                                let err = new Error( "Insertion failed !" );
                                err.status = 400;
                                throw err;
                            }
                        } )
                    } )
                } )
            } )
        } )
    } )
} 