"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const morgan = require('morgan');
const dotenv = require('dotenv');
// Load environment variables from config.env
dotenv.config({ path: 'config.env' });
// Use morgan logging only in development mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`Mode: ${process.env.NODE_ENV}`);
}
// Define a simple route at the root URL
app.get('/', (req, res) => {
    res.send('hello world'); // Send response
});
// Set port from environment variables or default to 8000
const PORT = process.env.PORT || 8000;
// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
