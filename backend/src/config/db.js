import mongoose from 'mongoose';

export const connectDB = async () => { //async means the function will return a promise
    try {

        //*put your database name before the questionmark
        // mongoose.connect("mongodb+srv://astoria:<password>@cluster0.4fycskz.mongodb.net/notes_db?appName=Cluster0");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully!");
        //!dont hardcode the uri instead use environment variables

    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1); //exit the process with failure for 1
        //?if u have 0 means success
    }
};