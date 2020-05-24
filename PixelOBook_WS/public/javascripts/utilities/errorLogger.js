const fs = require( 'fs' );

let errorLogger = function ( err, req, res, next ) {
    if( err ) {
        fs.appendFile( './ErrorLogger.txt', new Date() + " - " + err.stack + "\n", function ( error ) {
            if( error ) {
                console.log( "Failed in logging error" );
            }
        } );
        if( err.status ) {
            res.status( err.status )
        }
        else{
            res.status( 500 );
        }
        res.json( { "message": err.message } )
    }
    next();
}

module.exports = errorLogger;