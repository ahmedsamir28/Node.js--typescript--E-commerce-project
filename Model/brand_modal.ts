import mongoose, { Document, Schema } from "mongoose"

// Define the interface for the subCategory document
interface IBrand extends Document {
    name: string,
    image: string,
    slug: string,
    createdAt: Date;
    updatedAt: Date;
}
const brandSchema = new Schema<IBrand>({
    name: {
        type: String,
        require: [true, 'brand require'],
        unique: true,
        minlength: [3, 'Too short brand name'],
        maxlength: [20, 'Too long brand name']
    },
    image: String,
    slug: {
        type: String,
        lowercase: true
    },
}, { timestamps: true }
)

const brandModel = mongoose.model<IBrand>('Brand', brandSchema)


export default brandModel