import mongoose, {Document, Schema} from "mongoose";

interface IUser extends Document {
    name: string;
    slug: string;
    email: string;
    phone: string;
    password: String;
    profileImage: String;
    passwordChangedAt: Date;
    passwordResetCode: String;
    passwordresetExpire: Date;
    passwordResetVerified: Boolean;
    role: String;
    active: Boolean;
    wishlist?: mongoose.Types.ObjectId[]
    addresses?: mongoose.Types.ObjectId[]
    updatedAt: Date;
    createdAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            trime: true,
            required: [true, 'nmae required']
        },
        slug: {
            type: String,
            lowercase: true
        },
        email: {
            type: String,
            required: [true, 'email required'],
            unique: true,
            lowercase: true
        },
        phone: String,
        profileImage: String,
        password: {
            type: String,
            required: [true, 'password is required'],
            minlength: [3, 'Too short password'],
        },
        passwordChangedAt: Date,
        passwordResetCode: String,
        passwordresetExpire: Date,
        passwordResetVerified: Boolean,
        role: {
            type: String,
            enum: ['user', 'admin', 'manager', 'user'],
            default: 'user'
        },

    },
    {timestamps: true}
);

// Helper function to set the image URL
const setImageUrl = (doc: IUser) => {
    if (doc.profileImage) {
        const baseUrl = process.env.BASE_URL || "http://localhost:8000";
        const imageUrl = `${baseUrl}/api/v1/users/${doc.profileImage}`;
        doc.profileImage = imageUrl;
    }
};


// Create the Brand model
const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
