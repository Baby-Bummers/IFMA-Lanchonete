var mongoose    = require("mongoose");
var Schema      = mongoose.Schema;

var MenuSchema = new Schema({
    warehouseId: String,
    name:        String,
    description: String,
    imageUrl:    String,
    amount:      Number
});

module.exports = MenuSchema;
