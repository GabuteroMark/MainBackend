const express = require('express');
const router = express.Router();
const questionService = require('./question.service');
const authorize = require('_middleware/authorize');
const Role = require('_helpers/role');

// Save AI questions
router.post(
  '/subjects/:subjectId/questions/ai',
  authorize(Role.Admin),
  saveAIQuestions
);

// Get questions by subject
router.get(
  '/subjects/:subjectId/questions',
  authorize(Role.Admin),
  getQuestions
);

module.exports = router;

// ---------------- CONTROLLERS ----------------

async function saveAIQuestions(req, res, next) {
  try {
    const questions = await questionService.saveAIQuestions(
      Number(req.params.subjectId),
      req.body.questions
    );
    res.json(questions);
  } catch (err) {
    next(err);
  }
}

async function getQuestions(req, res, next) {
  try {
    const questions = await questionService.getQuestionsBySubject(
      Number(req.params.subjectId)
    );
    res.json(questions);
  } catch (err) {
    next(err);
  }
}
