import mongoose from 'mongoose';

// Define the model
const Schema = new mongoose.Schema({
    userName: String,
    inCome: String,
    inComePayType: String,
    expense: String,
    expensePayType: String,
    date: String,
    teamName: String,
    description: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    monthlyProfit: Array
});

// Export the model
export default mongoose.model('Score', Schema);
