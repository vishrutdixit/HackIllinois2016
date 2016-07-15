var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://waiterqueue:waiterqueue@ds013738.mongolab.com:13738/heroku_txdrn6vx');

var handleError = function(err){
    if (err){
      console.log(err);
      return;
    }
}

var TableQueue = require('./models/TableQueue');
var Table = require('./models/Table');
var queue;
TableQueue.find({}, function(err, queues){
  if (err){
    console.log(err);
    return;
  }

  Table.remove({}, handleError)
  TableQueue.remove({}, handleError)
  queue = new TableQueue();
  queue.save(handleError);
  // if(queues.length >=1){
  //   queue = queues[0];
  // } else {
  //   queue = new TableQueue();
  //   queue.save(function(err){
  //     if (err){
  //       console.log(err);
  //       return;
  //     }
  //   });
  // }
});


app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json()); // for parsing application/json
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/queue', function(req, res){
  res.json({'queue': queue.queue});
});

var oneClickWaiting = false;
app.get('/one-click/:tableID', function (req, res) {
  io.emit('one-click', req.params.tableID);
  var interval = setInterval(function(){
    if(!oneClickWaiting){
      clearInterval(interval);
      oneClickWaiting = true;
      queue.addTable(req.params.tableID, "service");
      queue.save(function(err){
        oneClickWaiting = false;
        handleError(err);
      });
    }
  }, 10);
  res.send('success');
});


var doubleClickWaiting = false;
app.get('/double-click/:tableID', function (req, res) {
  io.emit('double-click', req.params.tableID);
  var interval = setInterval(function(){
    if(!doubleClickWaiting){
      clearInterval(interval);
      doubleClickWaiting = true;
      queue.addTable(req.params.tableID, "check");
      queue.save(function(err){
        doubleClickWaiting = false;
        handleError(err);
      });
    }
  }, 10);
  res.send('success');
});

var holdWaiting = false;
app.get('/hold/:tableID', function (req, res) {
  io.emit('hold', req.params.tableID);
  var interval = setInterval(function(){
    if(!holdWaiting){
      clearInterval(interval);
      holdWaiting = true;
      queue.removeTable(req.params.tableID);
      queue.save(function(err){
        holdWaiting = false;
        handleError(err);
      });
    }
  }, 10);
  res.send('success');
});


io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(app.get('port'), function(){
  console.log('listening on *:5000');
});
