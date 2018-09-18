/**
 * Declaration
 **/
var     express       = require('express'),
        morgan        = require('morgan'),
        cookieParser  = require( 'cookie-parser' );
        port          = 2559,
        bodyPar       = require('body-parser'),
        methodOv      = require('method-override'),
        fsr           = require('file-stream-rotator'),
        logDirectory  = __dirname + '/log',
        favicon       = require ('serve-favicon'),
        Twig          = require('twig'),
        mysql         = require('mysql'),
        database      = require('./config/database.js'),
        log4js        = require('log4js'),
        app           = express();

/**
 * Api definition
 **/
 var accessLogStream = fsr.getStream({
   date_format: 'YYYYMMDD',
   filename: logDirectory + '/access-%DATE%.log',
   frequency: 'daily',
   verbose: false
 });

log4js.configure({
 appenders: { main: { type: 'file', filename: './log/main.log' } },
 categories: { default: { appenders: ['main'], level: 'debug' } }
});
var logger = log4js.getLogger('main');

app.set('twig options', {
  strict_variables: false
});

app.use(express.static(__dirname + '/public'));
app.use(morgan('combined', {stream: accessLogStream}));
app.use(bodyPar.urlencoded({'extended':'true'}));
app.use(bodyPar.json());
app.use(bodyPar.json({ type: 'application/vnd.api+json' }));
app.use(methodOv('X-HTTP-Method-Override'));
app.use(cookieParser());
// app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.set('views', __dirname + '/public/views');

var connection = mysql.createConnection({
  host      : database.host,
  user      : database.user,
  password  : database.password,
  database  : database.db_name
});

connection.connect();

app.get('/', function(req, res){
  res.render( 'index.twig' );
});

app.get('/app/', function(req, res){
  if ( req.cookies.user === undefined )
    res.redirect('/');

  res.send({ success : true });
});

// TODO: Clean this mess
app.post( '/login/', function(req, res){
  connection.query( "SELECT * FROM user WHERE name = ? AND password = ?", [ req.body.username, req.body.password ], function(error, result, fields){
    res.setHeader( 'Content-Type', 'application/json' );

    if ( result.length >= 1 ){
      res.cookie.user = JSON.stringify({ id : result[0].id, name : result[0].name });
      res.status(200).send(JSON.stringify({success : true}));

      return true;
    }

    res.status(400).send(JSON.stringify({ success: false }));
  });
});

/**
 * Starting server
 **/
app.listen (port)
console.log ("Listening on port: " + port);
