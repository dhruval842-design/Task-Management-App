const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        length: 100
    },
    description: {  
        type: String,
        required: true,
        length: 1500
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'archived'],
        default: "pending"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Add a pre-save hook to update the `updatedAt` field automatically
taskSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Task = mongoose.model("TASK", taskSchema);
module.exports = Task;