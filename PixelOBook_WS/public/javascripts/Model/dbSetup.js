const collection = require( './connection' );

exports.setupDb = () => {
    
    return collection.getUsersCollection().then( ( users ) => {
        return users.deleteMany().then( () => {
            return "Database Reset !"
            
        } )
    } )
} 