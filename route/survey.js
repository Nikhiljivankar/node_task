const express = require("express");

const router = express.Router();

const surveyController = require("../controller/survey");

router.route("/").get(surveyController.Get).post(surveyController.Create);

router.route('/filter').post(surveyController.Filter);
//this to submit survey response
router.route('/submitSurvey').post(surveyController.CreateSurveyResponse);

router
  .route("/:id")
  .get(surveyController.GetById)
  .put(surveyController.Update)
  .delete(surveyController.deleteSurvey);

module.exports = router;
