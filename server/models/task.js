const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters'],
        minlength: [3, 'Title must be at least 3 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    priority: {
        type: String,
        enum: {
            values: ['low', 'medium', 'high'],
            message: 'Priority must be either low, medium, or high'
        },
        default: 'low',
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ['yetToStart', 'inprogress', 'completed'],
            message: 'Status must be either yetToStart, inprogress, or completed'
        },
        default: 'yetToStart',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true
    }
}, {
    timestamps: true, // automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Task', taskSchema);