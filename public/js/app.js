var app = angular.module('app', ['ngAnimate']);

app.controller('testController', ['$scope', function($scope){

  $scope.queueData = [];
  var socket = io();

  $scope.hasChanged = false;

  $scope.refresh = function(){
    $('.queue-container span').each(function(){
      var $this = $(this);
      var time = $this.attr('time');
      $this.livestamp(time);
    })
  };


  // $('form').submit(function(){
  //  socket.emit('chat message', $('#m').val());
  //  $('#m').val('');
  //  return false;
  // });

  // Add a Item to the list
 $scope.addItem = function (item) {
     $scope.queueData.push(item);
      setTimeout($scope.$apply(),10
    );
      $scope.$apply();
      $scope.hasChanged = true;
 };

 setInterval(function(){
   if($scope.hasChanged){
     $('.queue-container span').each(function(){
       var $this = $(this);
       var time = $this.attr('time');
       if(time.charAt(0) == '"'){
         time = time.slice(1, -1);
       }
       $this.livestamp(time);
     })
     $scope.hasChanged = false;
   }
 }, 1000);

$scope.hasItem = function (tableID) {
  var has = false;
  $.each($scope.queueData, function( index, value){
    if(value.id == tableID){
      has = true;
    }
    if(index == $scope.queueData.length-1){
      return has;
    }
  });
};

$scope.removeItem = function (tableID) {
  console.log("fire!");
  $scope.queueData.forEach(function(element, index, array){
    if(element.id == tableID){
      $scope.queueData.splice(index, 1)
      $scope.$apply();
    }
  });
};

$scope.clickToRemove = function (tableID) {
  $.get('/hold/'+tableID, function(data){
    console.log('successful');
  });
}

  socket.on('one-click', function(tableID){
    var has = false
    var len = $scope.queueData.length;
    for(var i = 0; i <= len; i++){
      if(i == $scope.queueData.length){
        if(!has){
          $scope.addItem({id: tableID, time: new Date(), status: 'service'});
        }
      }
      else{
        var element = $scope.queueData[i];
        if(element.id == tableID){
            has = true;
        }
      }
    }
  });

  socket.on('double-click', function(tableID){
      var has = false
      var len = $scope.queueData.length;
      for(var i = 0; i <= len; i++){
        if(i == $scope.queueData.length){
          if(!has){
            $scope.addItem({id: tableID, time: new Date(), status: 'check'});
          }
        }
        else{
          var element = $scope.queueData[i];
          if(element.id == tableID){
              has = true;
          }
        }
      }
  });

  socket.on('hold', function(tableID){
    $scope.removeItem(tableID);
  });

  $(".dropdown-button").dropdown();
  $.get('/queue', function(data){
      var queue = data.queue
      queue.forEach(function(element, index, array){
        $scope.addItem(element);
      })
  });


}]);
