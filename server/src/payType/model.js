import mongoose from 'mongoose';
import timeZone from "mongoose-timezone";

const moment = require('moment-timezone');

// Define the model
const Schema = new mongoose.Schema({
    billType: String,
    createdAt: {
        type: Date,
        default: moment().toDate()
    },
    deletedAt: {
        type: Date,
        default: null,
    }
});

Schema.plugin(timeZone, { path: ['createdAt', 'deletedAt'] });

// Export the model
export default mongoose.model('Payroll', Schema);
