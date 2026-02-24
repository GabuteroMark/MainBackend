const db = require('_helpers/db'); // your db setup
const Question = db.Question;
const Subject = db.Subject;

module.exports = {
  saveAIQuestions,
  getQuestionsBySubject
};

/** Save AI questions (string) for a subject */
async function saveAIQuestions(subjectId, questionsText) {
  // Check subject exists
  const subject = await Subject.findByPk(subjectId);
  if (!subject) throw 'Subject not found';

  // Optional: Split by newlines if multiple questions
  const questionsArray = questionsText
    .split('\n')
    .map(q => q.trim())
    .filter(q => q.length > 0);

  // Delete old questions for this subject (optional)
  await Question.destroy({ where: { subjectId } });

  // Save new questions
  const created = await Promise.all(
    questionsArray.map(q => Question.create({ subjectId, content: q }))
  );

  return created;
}

/** Get all questions for a subject */
async function getQuestionsBySubject(subjectId) {
  const subject = await Subject.findByPk(subjectId);
  if (!subject) throw 'Subject not found';

  return await Question.findAll({
    where: { subjectId },
    order: [['id', 'ASC']]
  });
}
