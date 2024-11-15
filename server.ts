import express from 'express';

const dotenv = require('dotenv')
const morgan = require('morgan')

const dbConnection  =  require ('./Config/data_base')
import categoryRoute from './Routes/category_route';

// Load environment variables
dotenv.config({ path: 'config.env' });

//Connect DataBase
dbConnection()
//Express app  
const app = express();
//Middlewares
app.use(express.json())
// Use morgan logging only in development mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`Mode: ${process.env.NODE_ENV}`);
}


// Define a simple route at the root URL
app.use('/api/v1/categories',categoryRoute)

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});