require('rootpath')();
const db = require('_helpers/db');

async function seedStaticSubjects() {
    const subjectsG1to3 = [
        'SCIENCE',
        'FILIPINO',
        'ENGLISH',
        'MATHEMATICS',
        'ARALING PANLIPUNAN',
        'EDUKASYON SA PAGPAPAKATAO',
        'MOTHER TONGUE BASED',
        'MAPEH'
    ];

    const subjectsG4to6 = [
        'SCIENCE',
        'FILIPINO',
        'ENGLISH',
        'MATHEMATICS',
        'ARALING PANLIPUNAN',
        'EDUKASYON SA PAGPAPAKATAO',
        'HOME ECONOMICS AND LIVELIHOOD EDUCATION',
        'MAPEH'
    ];

    const targetGradesG1to3 = ['Grade 1', 'Grade 2', 'Grade 3'];
    const targetGradesG4to6 = ['Grade 4', 'Grade 5', 'Grade 6'];

    try {
        console.log('--- Seeding Static Subjects ---');

        // G1 to G3
        for (const gradeName of targetGradesG1to3) {
            const gradeLevel = await db.GradeLevel.findOne({
                where: { name: gradeName, academicLevel: 'Primary Education' }
            });

            if (!gradeLevel) continue;
            console.log(`Processing ${gradeName}...`);

            for (const subjectName of subjectsG1to3) {
                await db.Subject.findOrCreate({
                    where: { name: subjectName, gradeLevelId: gradeLevel.id },
                    defaults: { name: subjectName, gradeLevelId: gradeLevel.id, subjectStatus: 'active' }
                });
            }
        }

        // G4 to G6
        for (const gradeName of targetGradesG4to6) {
            const gradeLevel = await db.GradeLevel.findOne({
                where: { name: gradeName, academicLevel: 'Primary Education' }
            });

            if (!gradeLevel) continue;
            console.log(`Processing ${gradeName}...`);

            for (const subjectName of subjectsG4to6) {
                await db.Subject.findOrCreate({
                    where: { name: subjectName, gradeLevelId: gradeLevel.id },
                    defaults: { name: subjectName, gradeLevelId: gradeLevel.id, subjectStatus: 'active' }
                });
            }
        }

        console.log('--- Static Subjects Seeding Completed ---');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        process.exit(0);
    }
}

seedStaticSubjects();
