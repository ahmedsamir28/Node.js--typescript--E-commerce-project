import { timeStamp } from "console"
import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Category require'],
        unique: [true, 'Category must be unique'],
        minlength: [3, 'Too short category name'],
        maxlength: [20, 'Too long category name']
    },
    image:String,
    slug: {
        type: String,
        lowercase: true
    },
},{ timestamps: true }
)

const categoryModel = mongoose.model('Category', categorySchema)


export default categoryModel