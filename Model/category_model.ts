import mongoose, { Schema, Document } from "mongoose";

// Define the interface for Category
export interface ICategory extends Document {
    name: string;
    image?: string;
    slug: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define the schema
const categorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: [true, "Category is required"],
            unique: true,
            minlength: [3, "Too short category name"],
            maxlength: [20, "Too long category name"],
        },
        image: { type: String },
        slug: {
            type: String,
            lowercase: true,
        },
    },
    { timestamps: true }
);

// Helper function to set the image URL
const setImageUrl = (doc: ICategory) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/api/v1/categories/${doc.image}`;
        doc.image = imageUrl;
    }
};

// findOne, findAll and update 
categorySchema.post("init", (doc: ICategory) => {
    setImageUrl(doc);
});

// create
categorySchema.post("save", (doc: ICategory) => {
    setImageUrl(doc);
});

// Create and export the model
const CategoryModel = mongoose.model<ICategory>("Category", categorySchema);

export default CategoryModel;
