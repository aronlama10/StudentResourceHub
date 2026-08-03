const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'users', // Reference to the User model
        required: true
    },
    department: {
        type: String,
        required: true,
        enum: ['Computer Eng', 'Civil Eng', 'CS & IT', 'Architecture Eng']
    },
    courseCode: {
        type: String,
        trim: true,
        default: ''
    },
    detail: {
        type: String, // e.g. "45 pages · PDF"
        required: true
    },
    excerpt: {
        type: String,
        trim: true
    },
    labels: {
        type: [String], // Array of strings e.g. ["Notes", "Exam Prep"]
        default: []
    },
    filePath: {
        type: String, // Stored file path or cloud URL
        required: true
    },
    fileName: {
        type: String
    },
    fileSize: {
        type: Number // in bytes
    },
    postedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('resources', ResourceSchema);
