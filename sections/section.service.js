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

async function getSectionsByGradeLevel(gradeLevelId, strand) {
    const gradeLevel = await db.GradeLevel.findByPk(gradeLevelId);
    if (!gradeLevel) throw new Error('Grade Level not found');

    const where = { gradeLevelId };
    if (strand) where.strand = strand;

    return db.Section.findAll({ where });
}

async function addSection(gradeLevelId, name, strand) {
    if (!name || !name.trim()) throw new Error('Section name required');
    const gradeLevel = await db.GradeLevel.findByPk(gradeLevelId);
    if (!gradeLevel) throw new Error('Grade Level not found');

    return db.Section.create({
        name: name.trim(),
        gradeLevelId,
        strand: strand || null
    });
}

async function updateSection(gradeLevelId, sectionId, name, strand) {
    const section = await db.Section.findOne({
        where: { id: sectionId, gradeLevelId }
    });
    if (!section) throw new Error('Section not found');
    if (!name || !name.trim()) throw new Error('Section name required');

    section.name = name.trim();
    if (strand !== undefined) section.strand = strand || null;

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
