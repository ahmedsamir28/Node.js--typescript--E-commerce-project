import mongoose from "mongoose";

const dbConnection = () => {
    // Add type for mongoose connection
    mongoose.connect(process.env.DB_URI || '')
        .then((conn) => {
            console.log(`database is connected : ${conn.connection.host}`);
        })
        .catch((err) => {
            console.error(`database error : ${err}`);
            process.exit(1);
        });

}

export default dbConnection