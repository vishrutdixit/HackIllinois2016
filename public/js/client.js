var socket = io();

// $('form').submit(function(){
//  socket.emit('chat message', $('#m').val());
//  $('#m').val('');
//  return false;
// });

socket.on('one-click', function(tableID){
  //Do something
  console.log('Received single click');
});
socket.on('double-click', function(tableID){
  //Do something
  console.log('Received double click');
});
socket.on('hold', function(tableID){
  //Do something
  console.log('Received hold');
});
