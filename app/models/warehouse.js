var mongoose    = require("mongoose");
var Schema      = mongoose.Schema;

var WarehouseSchema = new Schema({
    name:       String,
    qty:        Number,
    avaliable:  Boolean,
});

module.exports = WarehouseSchema;