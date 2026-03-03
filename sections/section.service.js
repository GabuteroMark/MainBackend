const db = require('_helpers/db');

module.exports = {
    getSectionsByGradeLevel,
    getById,
    addSection,
    updateSection,
    deleteSection
};

async function getById(id) {
    const section = await db.Section.findByPk(id);
    if (!section) throw new Error('Section not found');
    return section;
}

async function getSectionsByGradeLevel(gradeLevelId) {
    const gradeLevel = await db.GradeLevel.findByPk(gradeLevelId);
    if (!gradeLevel) throw new Error('Grade Level not found');
    return db.Section.findAll({ where: { gradeLevelId } });
}

async function addSection(gradeLevelId, name) {
    if (!name || !name.trim()) throw new Error('Section name required');
    const gradeLevel = await db.GradeLevel.findByPk(gradeLevelId);
    if (!gradeLevel) throw new Error('Grade Level not found');

    return db.Section.create({
        name: name.trim(),
        gradeLevelId
    });
}

async function updateSection(gradeLevelId, sectionId, name) {
    const section = await db.Section.findOne({
        where: { id: sectionId, gradeLevelId }
    });
    if (!section) throw new Error('Section not found');
    if (!name || !name.trim()) throw new Error('Section name required');

    section.name = name.trim();
    await section.save();
    return section;
}

async function deleteSection(gradeLevelId, sectionId) {
    const section = await db.Section.findOne({
        where: { id: sectionId, gradeLevelId }
    });
    if (!section) throw new Error('Section not found');

    await section.destroy();
    return { message: 'Section deleted' };
}
