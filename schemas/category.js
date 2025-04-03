let mongoose = require('mongoose');
let slugify = require('slugify');

let categorySchema = new mongoose.Schema({
    name:{
        type:String,
        unique: true,
        required:true
    },
    slug: {
        type: String,
        unique: true
    },
    description:{
        type:String,
        default:""
    }
},{
    timestamps:true
});

// Pre-save hook to generate slug from name
categorySchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, {
            lower: true,      // convert to lower case
            strict: true      // remove special characters
        });
    }
    next();
});

module.exports = mongoose.model('category',categorySchema);