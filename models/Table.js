var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TableSchema   = new Schema({
    id: {type:Number, required: true},
    index: {type: Number, unique: true, required: true },
    status: {type:String, required: true},
    time: { type: Date, default: Date.now ,required: true}
});

module.exports = mongoose.model('Table', TableSchema);
