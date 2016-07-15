var mongoose     = require('mongoose');
var Table        = require('./Table');
var TableSchema  = Table.schema;
var Schema       = mongoose.Schema;


var handleError = function(err){
    if (err){
      console.log(err);
      return;
    }
}

var TableQueueSchema   = new Schema({
    queue : {type: [TableSchema], default: []}
});

TableQueueSchema.methods.addTable = function(tableID, status) {
  var queue = this.queue;
  var query = Table.findOne({'id': tableID, 'status':status}, 'index', function(err, result){
    if (err){
      console.log(err);
      return;
    }
    if(result == null){
      var table = new Table({id:tableID, index: queue.length, status: status})
      table.save(handleError);
      queue.push(table);
    }
  });
}

TableQueueSchema.methods.removeTable = function(tableID) {
  var index;
  var query = Table.findOne({'id': tableID}, 'index', function(err, table){
    if (err){
      console.log(err);
      return;
    }
    if(table){
      index = table.index;
      table.remove();
    }
  });
  this.queue.splice(index, 1);
}

module.exports = mongoose.model('TableQueue', TableQueueSchema);
