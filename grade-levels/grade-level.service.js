const db = require('_helpers/db');

module.exports = {
    getAllGradeLevel,
    getGradeLevelById,
    createGradeLevel,
    updateGradeLevel,
    deleteGradeLevel,
    getSubjectsByGradeLevel,
    addSubject,
    updateSubject
};

async function getAllGradeLevel(academicLevel) {
    const where = {};
    if (academicLevel) {
        where.academicLevel = academicLevel;
    }
    return db.GradeLevel.findAll({ where });
}

async function getGradeLevelById(id) {
    const gradeLevel = await db.GradeLevel.findByPk(id);
    if (!gradeLevel) throw 'Grade Level not found';
    return gradeLevel;
}

async function createGradeLevel(params) {
    return db.GradeLevel.create({
        name: params.name,
        academicLevel: params.academicLevel
    });
}

async function updateGradeLevel(id, params) {
    const gradeLevel = await getGradeLevelById(id);
    gradeLevel.name = params.name;
    gradeLevel.academicLevel = params.academicLevel;
    await gradeLevel.save();
    return gradeLevel;
}

async function deleteGradeLevel(id) {
    const gradeLevel = await getGradeLevelById(id);
    await gradeLevel.destroy();
}

async function getSubjectsByGradeLevel(gradeLevelId) {
    await getGradeLevelById(gradeLevelId);
    return db.Subject.findAll({ where: { gradeLevelId } });
}

async function addSubject(gradeLevelId, name) {
    if (!name) throw 'Subject name required';

    await getGradeLevelById(gradeLevelId);

    return db.Subject.create({
        name: name.trim(),
        gradeLevelId: Number(gradeLevelId)
    });
}

async function updateSubject(gradeLevelId, subjectId, name) {
    const subject = await db.Subject.findOne({
        where: { id: subjectId, gradeLevelId }
    });

    if (!subject) throw 'Subject not found';

    subject.name = name;
    await subject.save();
    return subject;
}
