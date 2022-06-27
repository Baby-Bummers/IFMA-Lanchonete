const mongoose    = require("mongoose");
const Schema      = mongoose.Schema;

const CustomerSchema = new Schema({
    firstname:       String,
    lastname:        String,
    nickname:        String,
    address:         String,
    bio:             String,
    createdDateTime: Date,
    updatedDateTime: Date,
});

module.exports = CustomerSchema;
