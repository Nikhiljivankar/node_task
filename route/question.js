const express = require("express");

const router = express.Router();

const questionController = require("../controller/question");

router.route("/").get(questionController.Get).post(questionController.Create);

router.route("/GetByAgeRange").post(questionController.GetByAgeRange);
router.route('/filter').post(questionController.filter);

router
  .route("/:id")
  .get(questionController.GetById)
  .put(questionController.Update)
  .delete(questionController.deleteQuestions);

module.exports = router;
