 /******************************************************
 * PLEASE DO NOT EDIT THIS FILE
 * the verification process may break
 * ***************************************************/

'use strict';

var fs = require('fs');
var express = require('express');
var app = express();

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });
  
app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })

//The real code

app.route('/:timestamp')
  .get(function (req, res) {
    
    var timestamp = req.params.timestamp;
    res.json(getTimestamp(timestamp));
  })

function getTimestamp(timestamp) {
  
  var result = {
    unix: null,
    natural: null
  }
  
  var date;
  
  if (!isNaN(parseInt(timestamp))) {
    //This means it is unix timestamp
    
    date = new Date(parseInt(timestamp)*1000);
  
  }else {
    date = new Date(timestamp);
  }
  
  if (!isNaN(date.getTime())) { //Checks that it is a valid date
    result.unix = date.getTime()/1000;
    result.natural = getNaturalDate(date); //give me a seconds
  }
  
  return result;
  
  
}

//Get the natural language date
function getNaturalDate(date) {
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  var natural_date = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  return natural_date;
}


//End real code




// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

