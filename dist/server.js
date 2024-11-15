"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = require('dotenv');
const morgan = require('morgan');
const dbConnection = require('./Config/data_base');
const category_route_1 = __importDefault(require("./Routes/category_route"));
// Load environment variables
dotenv.config({ path: 'config.env' });
//Connect DataBase
dbConnection();
//Express app  
const app = (0, express_1.default)();
//Middlewares
app.use(express_1.default.json());
// Use morgan logging only in development mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`Mode: ${process.env.NODE_ENV}`);
}
// Define a simple route at the root URL
app.use('/api/v1/categories', category_route_1.default);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
