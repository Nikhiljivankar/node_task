const mongoose = require("mongoose");

const testSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    //we can use here email also
    // userId: {
    //     type: String,
    //     required: true,
    // },
    surveyId:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Survey',
    },
    surveyResponse: {
        type: [
            {
            }
        ],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Test = mongoose.model("Test", testSchema);

module.exports = Test;
