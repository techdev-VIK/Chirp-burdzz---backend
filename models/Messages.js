const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
    sender: {type: String, required: true},
    receiver: {type: String, required: true},
    message: {type: String, required: true},
},
{
    timestamps: true
});


const ChirpMessages =  mongoose.model("ChirpMessages", messageSchema);


module.exports = ChirpMessages;