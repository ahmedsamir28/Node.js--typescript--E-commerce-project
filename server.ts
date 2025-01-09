import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
const morgan = require('morgan')

import ApiError from './Utils/apiError';
import dbConnection from './Config/data_base';
import globalError from './Middlewares/errorMiddlewares';

import categoryRoute from './Routes/category_route';
import subCategoryRoute from './Routes/subCategory_Route';
import brandRoute from './Routes/brand_route';
import productRoute from './Routes/product_route';
import userRoute from './Routes/user_route';
import authRoute from './Routes/auth_route';
import reviewRoute from './Routes/review_route';
import wishListRoute from './Routes/wishList_route';




import path from 'path';



// Load environment variables
dotenv.config({ path: 'config.env' });

// Validate required environment variables
if (!process.env.PORT || !process.env.NODE_ENV) {
    throw new Error('Missing required environment variables (PORT or NODE_ENV).');
}

// Connect to Database
dbConnection();

// Initialize Express App
const app = express();

// Middlewares
app.use(express.json());

app.use(express.static(path.join(__dirname, 'Uploads')))

// Use morgan logging only in development mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`Mode: ${process.env.NODE_ENV}`);
}

// Define Routes
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/subcategories', subCategoryRoute);
app.use('/api/v1/brands', brandRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/wishlist', wishListRoute);





// Handle Undefined Routes
app.all('*', (req: Request, _res: Response, next: NextFunction) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global Error Handling Middleware
app.use(globalError);

// Start the Server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => console.log(`App running on port ${PORT}`))

// Handel rejection outside express
process.on('unhandledRejection', (err: unknown) => {
    if (err instanceof Error) {
        console.error(`unhandledRejection Error: ${err.name} | ${err.message}`);
    } else {
        console.error('unhandledRejection Error: Unknown type', err);
    }
    server.close(() => {
        console.error('Shutting down ....');
        process.exit(1);
    });
});
