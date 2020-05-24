const collection = require( './connection' );

exports.setupDb = () => {
    return collection.getPostsCollection().then( ( posts ) => {
        return posts.deleteMany().then( () => {
            return collection.getUsersCollection().then( ( users ) => {
                return users.deleteMany().then( () => {
                    return "Database Reset !"
                    
                } )
            } )
        } )
    } )
}
