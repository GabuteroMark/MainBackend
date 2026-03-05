require('rootpath')();
const db = require('_helpers/db');

async function deleteTertiarySubjects() {
    const tertiaryIds = [58, 59, 60, 61, 62];
    try {
        const count = await db.Subject.destroy({
            where: {
                gradeLevelId: tertiaryIds
            }
        });
        console.log(`Successfully deleted ${count} subjects from Tertiary Education.`);
        process.exit(0);
    } catch (err) {
        console.error('Error deleting subjects:', err);
        process.exit(1);
    }
}

deleteTertiarySubjects();
