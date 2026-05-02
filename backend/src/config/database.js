import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`\n MongoDb connected !!! zenda database ${connectionInstance.connection.host}`);

        // Drop stale unique indexes from old schema versions
        try {
            const db = mongoose.connection.db;
            const indexes = await db.collection('users').indexes();
            const staleIndexNames = ['username_1', 'email_1'];
            for (const idx of indexes) {
                if (staleIndexNames.includes(idx.name)) {
                    await db.collection('users').dropIndex(idx.name);
                    console.log(`Dropped stale ${idx.name} index`);
                }
            }
        } catch (idxError) {
            // Ignore index errors
        }
    } catch (error) {
        console.log("MongoDB connection failed", error);
        process.exit(1);
    }
}

export default connectDB;