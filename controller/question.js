const mongoose = require("mongoose");

const questionModel = require("../model/question");
const catchAsync = require("../utils/catchAsync");
const ErrorResponse = require("../utils/errorResponse");
const SuccessResponse = require("../utils/successResponse");

exports.Create = catchAsync(async (req, res, next) => {
  const question = await questionModel.create({
    _id: new mongoose.Types.ObjectId(),
    questionName: req.body.questionName,
    questionAgeRange: req.body.questionAgeRange,
    question: req.body.question,
    options: req.body.options,
    createdBy: req.body.createdBy,
    updatedBy: req.body.updatedBy,
  });

  res.status(201).json(SuccessResponse(question, question.length, "success"));
});

exports.Get = catchAsync(async (req, res, next) => {
  const questionData = await questionModel.find(req.query).populate('topicId').lean();
  if (questionData && questionData.length) {
    res
      .status(200)
      .json(SuccessResponse(questionData, questionData.length, "success"));
  } else {
    return next(new ErrorResponse(`No record found for this data`, 404));
  }
});

exports.GetByAgeRange = catchAsync(async (req, res, next) => {
  let features;
  const limit = req.body.limit ? parseInt(req.body.limit) : 10;
  const skip = req.body.page ? parseInt(req.body.page) * limit : 0;
  const payload = {};

  features = await questionModel.aggregate([
    {
      $match: {
        $and: [payload],
      },
    },
    { $skip: skip },
    { $limit: limit },
  ]);

  if (features) {
    res.status(200).json({
      status: "success",
      result: features.length,
      data: features,
    });
  } else {
    res.status(404).json({
      message: "No records found",
    });
  }
});

exports.GetById = catchAsync(async (req, res, next) => {
  const question = await questionModel.findById(req.params.id);
  if (!question) {
    return next(new ErrorResponse(`Invalid Id`, 404));
  } else {
    res.status(200).json(SuccessResponse(question, 1, "success"));
  }
});

exports.Update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const question = await questionModel.findById(id).select('_id');
  if (!question) {
    return next(new ErrorResponse(`Invalid Id`, 404));
  } else {
    const updatedQuestion = await questionModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res
      .status(201)
      .json(
        SuccessResponse(updatedQuestion, 1, "updated question successfully")
      );
  }
});

exports.deleteQuestions = catchAsync(async (req, res) => {
  await questionModel.findByIdAndDelete(req.params.id);
  res
    .status(201)
    .json(SuccessResponse(null, 1, "Question deleted Successfully"));
});

exports.filter = catchAsync(async (req, res) => {
  const topic =await questionModel.find(req.body).lean()

  res.json({
    status: 200,
    result: topic.length,
    data: topic,
  });
});