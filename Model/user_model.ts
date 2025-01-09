import mongoose, { Document, Schema, CallbackWithoutResultAndOptionalError } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    name: string;
    slug: string;
    email: string;
    phone: string;
    password: string;
    profileImage: string;
    passwordChangedAt: Date;
    passwordResetCode: string;
    passwordResetExpire: Date;
    passwordResetVerified: boolean;
    role: string;
    active: boolean;
    wishlist?: mongoose.Types.ObjectId[];
    addresses?: mongoose.Types.ObjectId[];
    updatedAt: Date;
    createdAt: Date;
}

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Name is required'],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
        },
        phone: String,
        profileImage: String,
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [3, 'Password is too short'],
        },
        passwordChangedAt: Date,
        passwordResetCode: String,
        passwordResetExpire: Date,
        passwordResetVerified: Boolean,
        role: {
            type: String,
            enum: ['user', 'admin', 'manager'],
            default: 'user',
        },
        active: {
            type: Boolean,
            default: true,
        },
        wishlist: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
            },
        ],
        addresses: [
            {
                id: { type: mongoose.Schema.Types.ObjectId },
                alias :String,
                details:String,
                phone:String,
                city:String,
                postalCode:String
            },
        ],
    },
    { timestamps: true }
);

// Helper function to set the image URL
const setImageUrl = (doc: IUser) => {
    if (doc.profileImage && !doc.profileImage.startsWith('http')) {
        const baseUrl = process.env.BASE_URL || "http://localhost:8000";
        const imageUrl = `${baseUrl}/api/v1/users/${doc.profileImage}`;
        doc.profileImage = imageUrl;
    }
};

// Hook: Runs after retrieving a document from the database
userSchema.post('init', function(doc: IUser) {
    setImageUrl(doc);
});

// Hook: Runs after saving a document to the database
userSchema.post('save', function(doc: IUser) {
    setImageUrl(doc);
});

userSchema.pre('save', async function(next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified('password')) return next();
    // Hashing user password
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const userModel = mongoose.model<IUser>('User', userSchema);

export default userModel;