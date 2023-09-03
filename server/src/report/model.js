import mongoose from 'mongoose';
import timeZone from "mongoose-timezone";

const moment = require('moment');

// Define the model
const Schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: String,
    achieved: String,
    issue: String,
    other: String,
    performed: String,
    plan: String,
    request: String,
    skillImprovement: String,
    newJobEarned: String,
    estimated: String,
    reportType: {
        type: Boolean,
        default: false
    },
    date: String,
    createdAt_str: String,
    createdAt: {
        type: Date,
        default: moment().toDate(),
    },
    userTeam: String,
    userRole: String,
    note:String
},
    { timestamps: { updatedAt: 'updatedAt' } }
);

Schema.plugin(timeZone, { path: ['createdAt', 'date'] });

// Export the model
export default mongoose.model('Report', Schema);
