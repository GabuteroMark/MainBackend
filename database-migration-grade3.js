require('rootpath')();
const db = require('_helpers/db');

async function migrateGrade3() {
    try {
        console.log('Fetching Grade 3 from Primary Education...');
        const grade3 = await db.GradeLevel.findOne({
            where: { name: 'Grade 3', academicLevel: 'Primary Education' }
        });

        if (!grade3) {
            console.error('Grade 3 not found in the database. Exiting.');
            process.exit(1);
        }

        const section1 = await db.Section.findOne({
            where: { name: 'Section 1', gradeLevelId: grade3.id }
        });

        if (section1) {
            console.log(`Deleting existing subjects specifically bound to Grade 3 Section 1 (ID: ${section1.id})...`);
            await db.Subject.destroy({
                where: { sectionId: section1.id, gradeLevelId: grade3.id }
            });
            console.log('Existing Section 1 subjects deleted.');
        }

        const subjectsToSeed = [
            'SCIENCE',
            'FILIPINO',
            'ENGLISH',
            'MATHEMATICS',
            'ARALING PANLIPUNAN',
            'EDUKASYON SA PAGPAPAKATAO',
            'MOTHER TONGUE BASED',
            'MAPEH'
        ];

        console.log('Inserting standard 8 subjects for Grade 3 (shared globally with sectionId: null)...');
        for (const subjectName of subjectsToSeed) {
            const [subject, created] = await db.Subject.findOrCreate({
                where: {
                    name: subjectName,
                    gradeLevelId: grade3.id
                },
                defaults: {
                    name: subjectName,
                    gradeLevelId: grade3.id,
                    sectionId: null, // Shared across all Grade 3 sections
                    subjectStatus: 'active'
                }
            });

            // Just in case it existed but with a sectionId, force it to null
            if (!created && subject.sectionId !== null) {
                subject.sectionId = null;
                await subject.save();
            }

            console.log(`- ${subjectName}: ${created ? 'Created' : 'Updated to Shared (null)'}`);
        }

        console.log('\nMigration completed successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        process.exit(0);
    }
}

migrateGrade3();
