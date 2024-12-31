import mongoose, { Document, Schema } from "mongoose";

interface IBrand extends Document {
    name: string;
    image: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

const brandSchema = new Schema<IBrand>(
    {
        name: {
            type: String,
            required: [true, "Brand name is required"],
            unique: true,
            minlength: [3, "Brand name is too short"],
            maxlength: [20, "Brand name is too long"],
        },
        image: String,
        slug: {
            type: String,
            lowercase: true,
        },
    },
    { timestamps: true }
);

// Helper function to set the image URL
const setImageUrl = (doc: IBrand) => {
    if (doc.image) {
        const baseUrl = process.env.BASE_URL || "http://localhost:8000"; 
        const imageUrl = `${baseUrl}/api/v1/brands/${doc.image}`;
        doc.image = imageUrl;
    }
};

// Hook: Runs after retrieving a document from the database
brandSchema.post("init", (doc: IBrand) => {
    setImageUrl(doc);
});

// Hook: Runs after saving a document to the database
brandSchema.post("save", (doc: IBrand) => {
    setImageUrl(doc);
});

// Create the Brand model
const brandModel = mongoose.model<IBrand>("Brand", brandSchema);

export default brandModel;
