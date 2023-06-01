const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose);

const questionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  questionName: {
    type: String,
    default:''
  },
  questionNo: {
    type: Number,
    default: 0,
  },
  questionAgeRange: {
    type: String,
    enum:["above 13","13 and above", "18 or less","all ages"],
    required: [true, "questionAgeRange is required"],
  },
  frequency: {
    type: String,
    enum:["Monthly","Weekly"],
    required: [true, "frequency is required"],
  },
  diagnosis: {
    type: String,
    enum:["Acne","Psoriasis","All teenagers", "ADHD", "PTSD", "Bipolar", "Fibromyagia", "Eating disorder","All"],
    required: [true, "diagnosis is required"],
  },
  question: {
    type: String,
    required: false,
  },
  options: {
    type: [
      {
        value: {
          type: String,
        },
      },
    ],
    default: [],
    required: [false, "Options is required"],
  },
//   answer: {
//     type: [
//       {
//         value: {
//           type: String,
//         },
//       },
//     ],
//     default: [],
//     required: [false, "Options is required"],
//   },
  createdBy: {
    type: String,
    required: false,
  },
  updatedBy: {
    type: String,
    required: false,
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
questionSchema.plugin(autoIncrement.plugin, {
  model: "Question",
  field: "questionNo",
  startAt: 1000,
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
