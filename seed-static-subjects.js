require('rootpath')();
const db = require('_helpers/db');

async function seedStaticSubjects() {
    const subjectsToSeed = [
        'FILIPINO',
        'ENGLISH',
        'MATHEMATICS',
        'ARALING PANLIPUNAN',
        'EDUKASYON SA PAGPAPAKATAO',
        'MOTHER TONGUE BASED',
        'MAPEH'
    ];

    const targetGrades = ['Grade 1', 'Grade 2'];

    try {
        console.log('--- Seeding Static Subjects for Grade 1 and 2 ---');

        for (const gradeName of targetGrades) {
            // Find the grade level ID
            const gradeLevel = await db.GradeLevel.findOne({
                where: { name: gradeName, academicLevel: 'Primary Education' }
            });

            if (!gradeLevel) {
                console.warn(`⚠️  Grade Level "${gradeName}" not found in Primary Education. Skipping...`);
                continue;
            }

            console.log(`Processing ${gradeName} (ID: ${gradeLevel.id})...`);

            for (const subjectName of subjectsToSeed) {
                const [subject, created] = await db.Subject.findOrCreate({
                    where: {
                        name: subjectName,
                        gradeLevelId: gradeLevel.id
                    },
                    defaults: {
                        name: subjectName,
                        gradeLevelId: gradeLevel.id,
                        subjectStatus: 'active'
                    }
                });

                if (created) {
                    console.log(`✅ Created subject: ${subjectName} for ${gradeName}`);
                } else {
                    console.log(`ℹ️  Subject "${subjectName}" already exists for ${gradeName}`);
                }
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
