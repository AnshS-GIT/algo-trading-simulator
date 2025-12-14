import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/algotrading');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Access the collection directly
        const db = mongoose.connection.db;
        const users = db.collection('users');
        
        // List indexes
        const indexes = await users.indexes();
        console.log('Current Indexes:', indexes);
        
        // Drop username_1 index if it exists
        try {
            await users.dropIndex('username_1');
            console.log('Successfully dropped username_1 index');
        } catch (err) {
            console.log('Error dropping index (might not exist):', err.message);
        }
        
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();
