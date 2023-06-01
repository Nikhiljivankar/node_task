const mongoose = require("mongoose");

const testSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    surveyName: {
        type: String,
        required: true
    },
    noOfQuestion: {
        type: Number,
    },
    questionList: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Question',
            },
        ],
        default: [],
    },
    frequency: {
        type: String,
        enum:["Monthly","Weekly"],
        required: [true, "frequency is required"],
      },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User',
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

const Test = mongoose.model("Survey", testSchema);

module.exports = Test;
