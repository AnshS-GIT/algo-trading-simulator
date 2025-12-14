import mongoose from 'mongoose';
import 'dotenv/config';

const fixDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/algotrading';
        console.log('Connecting to:', uri);
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');

        const collection = mongoose.connection.collection('users');
        
        // Check if index exists
        const indexes = await collection.indexes();
        console.log('Current Indexes:', indexes);

        const usernameIndex = indexes.find(idx => idx.name === 'username_1');
        
        if (usernameIndex) {
            console.log('Found problematic index: username_1. Dropping it...');
            await collection.dropIndex('username_1');
            console.log('✅ Index dropped successfully!');
        } else {
            console.log('ℹ️ Index "username_1" not found. No action needed.');
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

fixDB();
