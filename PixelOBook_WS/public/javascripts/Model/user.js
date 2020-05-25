const dbModel= require( './connection' )

const pixelOBookDB = {}

// pixelOBookDB.generateId = () => {
//     return dbModel.getCustomersCollection().then( ( model ) => {
//         return model.distinct( "Orders.orderID" ).then( ( ids ) => {
//             let oId = Math.max( ...ids );
//             return oId + 1;
//         } )
//     } )
// }

pixelOBookDB.findUser= ( uname, password ) =>{
    return dbModel.getUsersCollection().then( ( users )=>{
        return users.findOne( {"userName": uname, 'password': password},{'_id': 0, 'fullName': 1} ).then( ( data )=>{
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


module.exports= pixelOBookDB;
