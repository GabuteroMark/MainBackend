require('rootpath')();
const db = require('_helpers/db');

async function checkLevels() {
    try {
        const levels = await db.GradeLevel.findAll();
        console.log('Total levels found:', levels.length);
        levels.forEach(l => {
            console.log(`ID: ${l.id}, Name: ${l.name}, AcademicLevel: "${l.academicLevel}"`);
        });
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkLevels();
