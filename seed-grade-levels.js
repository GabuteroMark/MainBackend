require('rootpath')();
const db = require('_helpers/db');

async function seed() {
    console.log('Waiting for database logic to initialize...');
    await new Promise(resolve => setTimeout(resolve, 8000)); // Wait for db.js auto-sync to finish

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
        const staticSubjectsG1to3 = [
            'SCIENCE',
            'FILIPINO',
            'ENGLISH',
            'MATHEMATICS',
            'ARALING PANLIPUNAN',
            'EDUKASYON SA PAGPAPAKATAO',
            'MOTHER TONGUE BASED',
            'MAPEH'
        ];

        const staticSubjectsG4to6 = [
            'SCIENCE',
            'FILIPINO',
            'ENGLISH',
            'MATHEMATICS',
            'ARALING PANLIPUNAN',
            'EDUKASYON SA PAGPAPAKATAO',
            'HOME ECONOMICS AND LIVELIHOOD EDUCATION',
            'MAPEH'
        ];

        // Helper to seed sections and subjects
        const seedHierarchy = async (grades, academicLevel) => {
            for (const name of grades) {
                const [gradeLevel] = await db.GradeLevel.findOrCreate({
                    where: { name, academicLevel },
                    defaults: { name, academicLevel }
                });

                // Create a default Section for every Grade Level
                const [section] = await db.Section.findOrCreate({
                    where: { name: 'Section 1', gradeLevelId: gradeLevel.id },
                    defaults: { name: 'Section 1', gradeLevelId: gradeLevel.id }
                });

                // If Grade 1, 2, or 3, seed static subjects under Section 1
                if (name === 'Grade 1' || name === 'Grade 2' || name === 'Grade 3') {
                    for (const subName of staticSubjectsG1to3) {
                        await db.Subject.findOrCreate({
                            where: { name: subName, sectionId: section.id },
                            defaults: { name: subName, sectionId: section.id, subjectStatus: 'active' }
                        });
                    }
                }

                // If Grade 4, 5, or 6
                if (name === 'Grade 4' || name === 'Grade 5' || name === 'Grade 6') {
                    for (const subName of staticSubjectsG4to6) {
                        await db.Subject.findOrCreate({
                            where: { name: subName, sectionId: section.id },
                            defaults: { name: subName, sectionId: section.id, subjectStatus: 'active' }
                        });
                    }
                }
            }
        };

        // Seed Primary
        await seedHierarchy(primaryGrades, 'Primary Education');

        // Seed Secondary
        await seedHierarchy(secondaryGrades, 'Secondary Education');

        // Seed Senior High
        await seedHierarchy(seniorHighGrades, 'Senior High School');

        // Seed Tertiary
        const tertiaryYearLevels = ['1st Year College', '2nd Year College', '3rd Year College', '4th Year College'];
        for (const name of tertiaryPrograms) {
            const [gradeLevel] = await db.GradeLevel.findOrCreate({
                where: { name, academicLevel: 'Tertiary Education' },
                defaults: { name, academicLevel: 'Tertiary Education' }
            });

            // For Tertiary, we can treat Year Levels as Sections? 
            // Or one Section with Year Levels as Subjects. 
            // The user mentioned "applicable only to grade 1 and 2" for the static subjects.
            // Let's stick to Section 1 for consistency.
            const [section] = await db.Section.findOrCreate({
                where: { name: 'Section 1', gradeLevelId: gradeLevel.id },
                defaults: { name: 'Section 1', gradeLevelId: gradeLevel.id }
            });

            for (const yearLevel of tertiaryYearLevels) {
                await db.Subject.findOrCreate({
                    where: { name: yearLevel, sectionId: section.id },
                    defaults: { name: yearLevel, sectionId: section.id }
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
