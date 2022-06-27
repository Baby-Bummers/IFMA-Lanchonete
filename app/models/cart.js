var mongoose    = require("mongoose");
var Schema      = mongoose.Schema;

var CartSchema = new Schema({
    menuItens:   Array,
    userId:      String,
    //Temp gamb
    warehouseId: String,
    name:        String,
    description: String,
    imageUrl:    String,
    amount:      Number,
});

module.exports = CartSchema;
