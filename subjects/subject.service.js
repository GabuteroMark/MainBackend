const { Op } = require('sequelize');
const db = require('_helpers/db');

module.exports = {
    getSubjectsBySection,
    addSubject,
    updateSubject,
    deleteSubject
};

/**
 * Get all subjects for a section.
 * Returns subjects that are specifically for this section OR shared across the whole grade level.
 */
async function getSubjectsBySection(sectionId) {
    const section = await db.Section.findByPk(sectionId);
    if (!section) throw new Error('Section not found');

    return db.Subject.findAll({
        where: {
            gradeLevelId: section.gradeLevelId,
            [Op.or]: [
                { sectionId: sectionId },
                { sectionId: null }
            ]
        }
    });
}

async function addSubject(sectionId, name) {
    if (!name || !name.trim()) throw new Error('Subject name required');
    const section = await db.Section.findByPk(sectionId, {
        include: [{ model: db.GradeLevel, as: 'gradeLevel' }]
    });
    if (!section) throw new Error('Section not found');

    // Auto-share subjects for Grade 1 and Grade 2
    // Auto-share subjects for Grade 1, Grade 2, and Grade 3
    const gradeLevelName = section.gradeLevel?.name || '';
    const isSharedGrade = gradeLevelName.includes('Grade 1') || gradeLevelName.includes('Grade 2') || gradeLevelName.includes('Grade 3') || gradeLevelName.includes('Grade 4') || [46, 47].includes(section.gradeLevelId);

    return db.Subject.create({
        name: name.trim(),
        gradeLevelId: section.gradeLevelId,
        sectionId: isSharedGrade ? null : sectionId
    });
}

async function updateSubject(sectionId, subjectId, name) {
    const subject = await db.Subject.findOne({
        where: { id: subjectId, sectionId }
    });
    if (!subject) throw new Error('Subject not found');
    if (!name || !name.trim()) throw new Error('Subject name required');

    subject.name = name.trim();
    await subject.save();
    return subject;
}

async function deleteSubject(sectionId, subjectId) {
    const section = await db.Section.findByPk(sectionId);
    if (!section) throw new Error('Section not found');

    const subject = await db.Subject.findOne({
        where: {
            id: subjectId,
            gradeLevelId: section.gradeLevelId
        }
    });
    if (!subject) throw new Error('Subject not found');

    await subject.destroy();
    return { message: 'Subject deleted' };
}