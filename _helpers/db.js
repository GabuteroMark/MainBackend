const mysql = require('mysql2/promise');
const { Sequelize, DataTypes } = require('sequelize');
const config = require('config.json');

const db = {};

const host = process.env.DB_HOST || config.database.host;
const port = process.env.DB_PORT || config.database.port;
const user = process.env.DB_USER || config.database.user;
const password = process.env.DB_PASSWORD || config.database.password;
const database = process.env.DB_DATABASE || config.database.database;

// Initialize Sequelize
const sequelize = new Sequelize(database, user, password, {
    host,
    port,
    dialect: 'mysql',
    logging: false
});

// ================= MODELS =================
db.Account = require('../accounts/account.model')(sequelize, DataTypes);

db.Preferences = sequelize.define('Preferences', {
    AccountId: { type: DataTypes.INTEGER, allowNull: false },
    theme: { type: DataTypes.STRING, defaultValue: 'light' },
    notifications: { type: DataTypes.BOOLEAN, defaultValue: true },
    language: { type: DataTypes.STRING, defaultValue: 'en' }
});

db.RefreshToken = sequelize.define('RefreshToken', {
    AccountId: { type: DataTypes.INTEGER, allowNull: false },
    token: { type: DataTypes.STRING, allowNull: false },
    expires: { type: DataTypes.DATE, allowNull: false },
    createdByIp: { type: DataTypes.STRING },
    revoked: { type: DataTypes.DATE },
    revokedByIp: { type: DataTypes.STRING },
    replacedByToken: { type: DataTypes.STRING }
}, {
    getterMethods: {
        isActive() {
            return !this.revoked && new Date() < this.expires;
        }
    }
});

db.ActivityLog = sequelize.define('ActivityLog', {
    AccountId: { type: DataTypes.INTEGER, allowNull: false },
    actionType: { type: DataTypes.STRING, allowNull: false },
    actionDetails: { type: DataTypes.TEXT },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

db.GradeLevel = sequelize.define('GradeLevel', {
    name: { type: DataTypes.STRING, allowNull: false },
    academicLevel: { type: DataTypes.STRING, allowNull: true }
});

db.Section = sequelize.define('Section', {
    name: { type: DataTypes.STRING, allowNull: false },
    gradeLevelId: { type: DataTypes.INTEGER, allowNull: false }
});

db.Subject = sequelize.define('Subject', {
    name: { type: DataTypes.STRING, allowNull: false },
    subjectStatus: { type: DataTypes.STRING, defaultValue: 'active' },
    gradeLevelId: { type: DataTypes.INTEGER, allowNull: false },
    sectionId: { type: DataTypes.INTEGER, allowNull: true }
});

db.Question = sequelize.define('Question', {
    question: { type: DataTypes.TEXT, allowNull: false },
    optionA: { type: DataTypes.STRING, allowNull: false },
    optionB: { type: DataTypes.STRING, allowNull: false },
    optionC: { type: DataTypes.STRING, allowNull: false },
    optionD: { type: DataTypes.STRING, allowNull: false },
    answer: { type: DataTypes.STRING, allowNull: false },
    gradeLevelId: { type: DataTypes.INTEGER, allowNull: false },
    sectionId: { type: DataTypes.INTEGER, allowNull: false },
    subjectId: { type: DataTypes.INTEGER, allowNull: false }
});

db.TopicRequest = sequelize.define('TopicRequest', {
    accountId: { type: DataTypes.INTEGER, allowNull: false },
    gradeLevelId: { type: DataTypes.INTEGER, allowNull: false },
    sectionId: { type: DataTypes.INTEGER, allowNull: false },
    subjectId: { type: DataTypes.INTEGER, allowNull: false },
    fileName: { type: DataTypes.STRING, allowNull: false },
    filePath: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' }, // Pending, Approved, Rejected
    aiStatus: { type: DataTypes.STRING, defaultValue: 'Idle' },  // Idle, Processing, Completed, Failed
    remarks: { type: DataTypes.TEXT, allowNull: true }
});

// ================= ASSOCIATIONS =================
db.Account.hasOne(db.Preferences, { foreignKey: 'AccountId', onDelete: 'CASCADE' });
db.Preferences.belongsTo(db.Account, { foreignKey: 'AccountId' });
db.Account.hasMany(db.RefreshToken, { foreignKey: 'AccountId', onDelete: 'CASCADE' });
db.RefreshToken.belongsTo(db.Account, { foreignKey: 'AccountId' });
db.Account.hasMany(db.ActivityLog, { foreignKey: 'AccountId', onDelete: 'CASCADE' });
db.ActivityLog.belongsTo(db.Account, { foreignKey: 'AccountId' });

// GradeLevel -> Section -> Subject
db.GradeLevel.hasMany(db.Section, { foreignKey: 'gradeLevelId', as: 'sections', onDelete: 'CASCADE' });
db.Section.belongsTo(db.GradeLevel, { foreignKey: 'gradeLevelId', as: 'gradeLevel' });

db.GradeLevel.hasMany(db.Subject, { foreignKey: 'gradeLevelId', as: 'allSubjects', onDelete: 'CASCADE' });
db.Subject.belongsTo(db.GradeLevel, { foreignKey: 'gradeLevelId', as: 'gradeLevel' });

db.Section.hasMany(db.Subject, { foreignKey: 'sectionId', as: 'subjects', onDelete: 'CASCADE' });
db.Subject.belongsTo(db.Section, { foreignKey: 'sectionId', as: 'section' });

// Questions
db.GradeLevel.hasMany(db.Question, { foreignKey: 'gradeLevelId', onDelete: 'CASCADE' });
db.Question.belongsTo(db.GradeLevel, { foreignKey: 'gradeLevelId' });
db.Section.hasMany(db.Question, { foreignKey: 'sectionId', onDelete: 'CASCADE' });
db.Question.belongsTo(db.Section, { foreignKey: 'sectionId' });
db.Subject.hasMany(db.Question, { foreignKey: 'subjectId', onDelete: 'CASCADE' });
db.Question.belongsTo(db.Subject, { foreignKey: 'subjectId' });

// TopicRequest Associations
db.Account.hasMany(db.TopicRequest, { foreignKey: 'accountId', onDelete: 'CASCADE' });
db.TopicRequest.belongsTo(db.Account, { foreignKey: 'accountId' });
db.GradeLevel.hasMany(db.TopicRequest, { foreignKey: 'gradeLevelId', onDelete: 'CASCADE' });
db.TopicRequest.belongsTo(db.GradeLevel, { foreignKey: 'gradeLevelId' });
db.Section.hasMany(db.TopicRequest, { foreignKey: 'sectionId', onDelete: 'CASCADE' });
db.TopicRequest.belongsTo(db.Section, { foreignKey: 'sectionId' });
db.Subject.hasMany(db.TopicRequest, { foreignKey: 'subjectId', onDelete: 'CASCADE' });
db.TopicRequest.belongsTo(db.Subject, { foreignKey: 'subjectId' });

db.Sequelize = Sequelize;
db.sequelize = sequelize;

(async function initialize() {
    console.log('--- DATABASE INITIALIZATION START ---');
    console.log(`Connecting to database at ${host}:${port} as ${user}...`);
    try {
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await connection.end();
        console.log('Database ensured (or creation skipped).');
    } catch (err) {
        console.log('Database creation step log:', err.message);
    }

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully!');
    } catch (err) {
        console.error('DATABASE INITIALIZATION ERROR:', err.message);
    }
    console.log('--- DATABASE INITIALIZATION END ---');
})();

module.exports = db;
