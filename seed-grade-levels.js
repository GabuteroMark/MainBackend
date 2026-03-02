require('rootpath')();
const db = require('_helpers/db');

async function seed() {
    console.log('Starting seed...');
    const academicLevels = ['Primary Education', 'Secondary Education', 'Senior High School', 'Tertiary Education'];
    const primaryGrades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
    const secondaryGrades = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
    const seniorHighGrades = ['Grade 11', 'Grade 12'];
    const tertiaryPrograms = [
        'Bachelor of Science in Hospitality Management (BSHM)',
        'Bachelor of Science in Information Technology (BSIT)',
        'Bachelor of Secondary Education (BSEd) major in English',
        'Bachelor of Secondary Education (BSEd) Major in Mathematics',
        'Bachelor of Elementary Education (BEEd)'
    ];

    try {
        // Seed Primary
        for (const name of primaryGrades) {
            await db.GradeLevel.findOrCreate({
                where: { name, academicLevel: 'Primary Education' },
                defaults: { name, academicLevel: 'Primary Education' }
            });
        }
        // Seed Secondary
        for (const name of secondaryGrades) {
            await db.GradeLevel.findOrCreate({
                where: { name, academicLevel: 'Secondary Education' },
                defaults: { name, academicLevel: 'Secondary Education' }
            });
        }
        // Seed Senior High
        for (const name of seniorHighGrades) {
            await db.GradeLevel.findOrCreate({
                where: { name, academicLevel: 'Senior High School' },
                defaults: { name, academicLevel: 'Senior High School' }
            });
        }
        // Seed Tertiary
        const tertiaryYearLevels = ['1st Year College', '2nd Year College', '3rd Year College', '4th Year College'];
        for (const name of tertiaryPrograms) {
            const [gradeLevel] = await db.GradeLevel.findOrCreate({
                where: { name, academicLevel: 'Tertiary Education' },
                defaults: { name, academicLevel: 'Tertiary Education' }
            });

            // Seed Year Levels (as Subjects) for each Tertiary Program
            for (const yearLevel of tertiaryYearLevels) {
                await db.Subject.findOrCreate({
                    where: { name: yearLevel, gradeLevelId: gradeLevel.id },
                    defaults: { name: yearLevel, gradeLevelId: gradeLevel.id }
                });
            }
        }
        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        process.exit(0);
    }
}

seed();
