import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the SubCategory document
interface ISubCategory extends Document {
    name: string;
    slug: string;
    category: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

// Define the schema with proper TypeScript types
const subCategorySchema = new Schema<ISubCategory>({
    name: {
        type: String,
        trim: true,
        unique: true,
        minlength: [3, 'Too short subCategory name'],
        maxlength: [20, 'Too long subCategory name'],
        required: [true, 'SubCategory name is required'],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Subcategory must belong to category']
    }
}, {
    timestamps: true
});

// Create and export the model
const SubCategory = mongoose.model<ISubCategory>('SubCategory', subCategorySchema);
export default SubCategory;