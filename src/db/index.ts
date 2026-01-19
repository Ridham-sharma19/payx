import mongoose from "mongoose"

const mongoConnection = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL!);
        console.log("MongoDb connection done ");

    } catch (error) {
        console.log("Error while connecting" + error);
        process.exit(1);

    }
};

export default mongoConnection;
