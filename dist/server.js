"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan = require('morgan');
const category_route_1 = __importDefault(require("./Routes/category_route"));
const apiError_1 = __importDefault(require("./Utils/apiError"));
const data_base_1 = __importDefault(require("./Config/data_base"));
const errorMiddlewares_1 = __importDefault(require("./Middlewares/errorMiddlewares"));
// Load environment variables
dotenv_1.default.config({ path: 'config.env' });
// Validate required environment variables
if (!process.env.PORT || !process.env.NODE_ENV) {
    throw new Error('Missing required environment variables (PORT or NODE_ENV).');
}
// Connect to Database
(0, data_base_1.default)();
// Initialize Express App
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json());
// Use morgan logging only in development mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`Mode: ${process.env.NODE_ENV}`);
}
// Define Routes
app.use('/api/v1/categories', category_route_1.default);
// Handle Undefined Routes
app.all('*', (req, _res, next) => {
    next(new apiError_1.default(`Can't find this route: ${req.originalUrl}`, 400));
});
// Global Error Handling Middleware
app.use(errorMiddlewares_1.default);
// Start the Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
