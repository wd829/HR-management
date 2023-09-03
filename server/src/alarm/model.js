import mongoose from 'mongoose';

// Define the model
const Schema = new mongoose.Schema({
    title: String,
    userId: String,
    content: String,
    userName: String,
    date: String,
    createdAt: {
        type: Date,
        default: new Date
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    visitUser: Array,
},
    { timestamps: { updatedAt: 'updatedAt' } }
);

// Export the model
export default mongoose.model('Alarm', Schema);
