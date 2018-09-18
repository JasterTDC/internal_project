const EventEmitter = require( 'events' );

module.exports = class User extends EventEmitter{

  constructor ( connection ){
    super();
    this.sql = connection;
  }

  login ( username, password ){
    var that = this;

    this.sql.query( "SELECT * FROM user WHERE name = ? AND password = ?", [ username, password ], function(error, result, fields){
      if ( error ){
        that.emit('error', error);
        return true;
      }

      if ( result.length == 0 ){
        that.emit( 'failure' );
        return true;
      }

      if ( result.length >= 1 ){
        that.emit( 'success', result[0] );

        return true;
      }

    });
  }
}
