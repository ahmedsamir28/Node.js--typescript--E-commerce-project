import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { log } from 'node:console';

const dotenv = require('dotenv')
const morgan = require('morgan')


// Load environment variables before using them
dotenv.config({ path: 'config.env' });

// Add type for mongoose connection
mongoose.connect(process.env.DB_URI || '')
    .then((conn) => {
        console.log(`database is connected : ${conn.connection.host}`);
    })
    .catch((err) => {
        console.error(`database error : ${err}`);
        process.exit(1);
    });

//Express app  
const app = express();
//Middlewares
app.use(express.json())
// Use morgan logging only in development mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`Mode: ${process.env.NODE_ENV}`);
}

const createCategory = new mongoose.Schema({
    name: String
})

app.post('/', (req, res) => {
    const name = req.body.name
    const newCategory = new categoryModel({ name })
    newCategory.save().then((result) => {
        res.json(res)
    }).catch((err) => {
        res.json(err)
    });
    console.log(name);

})
const categoryModel = mongoose.model('Category', createCategory)
// Define a simple route at the root URL
app.get('/', (req: Request, res: Response) => {
    res.send('hello world');
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});