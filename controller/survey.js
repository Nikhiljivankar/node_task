const mongoose = require("mongoose");

const SurveyModel = require("../model/survey");
const SurveyDataModel = require("../model/surveyData");
const catchAsync = require("../utils/catchAsync");
const ErrorResponse = require("../utils/errorResponse");
const SuccessResponse = require("../utils/successResponse");

exports.Create = catchAsync(async (req, res, next) => {
    const surveyData = await SurveyModel.create({
        _id: new mongoose.Types.ObjectId(),
        surveyName: req.body.surveyName,
        noOfQuestion: req.body.noOfQuestion,
        questionList: req.body.questionList,
        createdBy: req.body.userId,
    });
    res.status(201).json(SuccessResponse(surveyData, 1, "Survey created successfully"));
});

exports.Get = catchAsync(async (req, res, next) => {
    const surveyData = await SurveyModel.find(req.query).populate("questionList createdBy").lean();

    if (surveyData && surveyData.length) {
        res
            .status(200)
            .json(SuccessResponse(surveyData, surveyData.length, "success"));
    } else {
        res
            .status(400)
            .json(SuccessResponse(surveyData, 0, "No Record Found"));
    }
});

exports.Filter = async (req, res) => {
    try {
        const surveyData = await SurveyModel.find(req.body).lean();

        if (surveyData && surveyData.length) {
            res
                .status(200)
                .json(SuccessResponse(surveyData, surveyData.length, "success"));
        } else {
            res
                .status(400)
                .json(SuccessResponse(surveyData, 0, "No Record Found"));
        }
    } catch (error) {
        res.json({
            status: 400,
            message: error,
        });
    }
};

exports.GetById = catchAsync(async (req, res, next) => {
    const test = await SurveyModel.findById(req.params.id).populate("createdBy", "-password").populate("questionList");
    if (!test) {
        return next(new ErrorResponse(`Invalid Id`, 404));
    } else {
        res.status(200).json(SuccessResponse(test, 1, "success"));
    }
});

exports.Update = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const survey = await SurveyModel.findById(id).select('_id');
    if (!survey) {
        return next(new ErrorResponse(`Invalid Id`, 404));
    } else {
        const updatedtest = await SurveyModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        res
            .status(201)
            .json(
                SuccessResponse(updatedtest, 1, "updated survey successfully")
            );
    }
});

exports.deleteSurvey = catchAsync(async (req, res) => {
    let deleteData = await SurveyModel.findByIdAndDelete(req.params.id);
    res
        .status(201)
        .json(SuccessResponse(deleteData, 1, "survey deleted Successfully"));
});

exports.CreateSurveyResponse = catchAsync(async (req, res, next) => {
    //in servey response we can add selected option for options
    const surveyData = await SurveyDataModel.create({
        _id: new mongoose.Types.ObjectId(),
        userId: req.body.userId,
        surveyId: req.body.surveyId,
        surveyResponse: req.body.surveyResponse
    });
    res.status(201).json(SuccessResponse(surveyData, 1, "Survey Response created successfully"));
});