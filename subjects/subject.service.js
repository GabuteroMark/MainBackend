const db = require('_helpers/db');

module.exports = {
    getSubjectsByGradeLevel,
    addSubject,
    updateSubject,
    deleteSubject
};

// Get all subjects for a grade level
async function getSubjectsByGradeLevel(gradeLevelId) {
    const gradeLevel = await db.GradeLevel.findByPk(gradeLevelId);
    if (!gradeLevel) throw new Error('Grade Level not found');
    return db.Subject.findAll({ where: { gradeLevelId } });
}

// Add a subject
async function addSubject(gradeLevelId, name) {
    if (!name || !name.trim()) throw new Error('Subject name required');
    const gradeLevel = await db.GradeLevel.findByPk(gradeLevelId);
    if (!gradeLevel) throw new Error('Grade Level not found');

    return db.Subject.create({
        name: name.trim(),
        gradeLevelId
    });
}

// Update a subject
async function updateSubject(gradeLevelId, subjectId, name) {
    const subject = await db.Subject.findOne({
        where: { id: subjectId, gradeLevelId }
    });
    if (!subject) throw new Error('Subject not found');
    if (!name || !name.trim()) throw new Error('Subject name required');

    subject.name = name.trim();
    await subject.save();
    return subject;
}

// Delete a subject
async function deleteSubject(gradeLevelId, subjectId) {
    const subject = await db.Subject.findOne({
        where: { id: subjectId, gradeLevelId }
    });
    if (!subject) throw new Error('Subject not found');

    await subject.destroy();
    return { message: 'Subject deleted' };
}