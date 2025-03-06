let mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
    name:{
        type:String,
        unique: true,
        required:true
    },
    description:{
        type:String,
        default:""
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},{
    timestamps:true
})
module.exports = mongoose.model('category',productSchema)