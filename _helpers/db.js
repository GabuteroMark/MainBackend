// const mysql = require('mysql2/promise');
// const { Sequelize, DataTypes } = require('sequelize');
// const config = require('config.json');

// const db = {};

// (async function initialize() {
//     const { host, port, user, password, database } = config.database;

//     // 1️⃣ Create database if it doesn't exist
//     const connection = await mysql.createConnection({ host, port, user, password });
//     await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
//     await connection.end();

//     // 2️⃣ Initialize Sequelize
//     const sequelize = new Sequelize(database, user, password, {
//         host,
//         dialect: 'mysql',
//         logging: console.log,
//     });

//     // ================= MODELS =================
//     db.Account = require('../accounts/account.model')(sequelize, DataTypes);

//     db.Preferences = sequelize.define('Preferences', {
//         AccountId: { type: DataTypes.INTEGER, allowNull: false },
//         theme: { type: DataTypes.STRING, defaultValue: 'light' },
//         notifications: { type: DataTypes.BOOLEAN, defaultValue: true },
//         language: { type: DataTypes.STRING, defaultValue: 'en' }
//     });

//     db.RefreshToken = sequelize.define('RefreshToken', {
//         AccountId: { type: DataTypes.INTEGER, allowNull: false },
//         token: { type: DataTypes.STRING, allowNull: false },
//         expires: { type: DataTypes.DATE, allowNull: false },
//         createdByIp: { type: DataTypes.STRING },
//         revoked: { type: DataTypes.DATE },
//         revokedByIp: { type: DataTypes.STRING },
//         replacedByToken: { type: DataTypes.STRING }
//     }, {
//         getterMethods: {
//             isActive() {
//                 return !this.revoked && new Date() < this.expires;
//             }
//         }
//     });

//     db.ActivityLog = sequelize.define('ActivityLog', {
//         AccountId: { type: DataTypes.INTEGER, allowNull: false },
//         actionType: { type: DataTypes.STRING, allowNull: false },
//         actionDetails: { type: DataTypes.TEXT },
//         timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
//     });

//     db.GradeLevel = sequelize.define('GradeLevel', { name: { type: DataTypes.STRING, allowNull: false } });
//     db.Subject = sequelize.define('Subject', {
//         name: { type: DataTypes.STRING, allowNull: false },
//         subjectStatus: { type: DataTypes.STRING, defaultValue: 'active' },
//         gradeLevelId: { type: DataTypes.INTEGER, allowNull: false }
//     });
//     db.Question = sequelize.define('Question', {
//         question: { type: DataTypes.TEXT, allowNull: false },
//         optionA: { type: DataTypes.STRING, allowNull: false },
//         optionB: { type: DataTypes.STRING, allowNull: false },
//         optionC: { type: DataTypes.STRING, allowNull: false },
//         optionD: { type: DataTypes.STRING, allowNull: false },
//         answer: { type: DataTypes.STRING, allowNull: false },
//         gradeLevelId: { type: DataTypes.INTEGER, allowNull: false },
//         subjectId: { type: DataTypes.INTEGER, allowNull: false }
//     });

//     // ================= ASSOCIATIONS =================
//     db.Account.hasOne(db.Preferences, { foreignKey: 'AccountId' });
//     db.Preferences.belongsTo(db.Account, { foreignKey: 'AccountId' });

//     db.Account.hasMany(db.RefreshToken, { foreignKey: 'AccountId' });
//     db.RefreshToken.belongsTo(db.Account, { foreignKey: 'AccountId' });

//     db.Account.hasMany(db.ActivityLog, { foreignKey: 'AccountId' });
//     db.ActivityLog.belongsTo(db.Account, { foreignKey: 'AccountId' });

//     db.GradeLevel.hasMany(db.Subject, { foreignKey: 'gradeLevelId', as: 'subjects', onDelete: 'CASCADE' });
//     db.Subject.belongsTo(db.GradeLevel, { foreignKey: 'gradeLevelId', as: 'gradeLevel' });

//     db.GradeLevel.hasMany(db.Question, { foreignKey: 'gradeLevelId', onDelete: 'CASCADE' });
//     db.Question.belongsTo(db.GradeLevel, { foreignKey: 'gradeLevelId' });

//     db.Subject.hasMany(db.Question, { foreignKey: 'subjectId', onDelete: 'CASCADE' });
//     db.Question.belongsTo(db.Subject, { foreignKey: 'subjectId' });

//     // ================= SYNC =================
//     await sequelize.sync({ alter: true });
//     console.log('Database synced successfully!');

//     db.Sequelize = Sequelize;
//     db.sequelize = sequelize;
// })();

// module.exports = db; // ✅ Export immediately



const { Sequelize, DataTypes } = require('sequelize');

const db = {};

(async function initialize() {

    const sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: 'mysql',
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            },
            logging: false
        }
    );

    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }

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
    });

    db.ActivityLog = sequelize.define('ActivityLog', {
        AccountId: { type: DataTypes.INTEGER, allowNull: false },
        actionType: { type: DataTypes.STRING, allowNull: false },
        actionDetails: { type: DataTypes.TEXT },
        timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    });

    db.GradeLevel = sequelize.define('GradeLevel', {
        name: { type: DataTypes.STRING, allowNull: false }
    });

    db.Subject = sequelize.define('Subject', {
        name: { type: DataTypes.STRING, allowNull: false },
        subjectStatus: { type: DataTypes.STRING, defaultValue: 'active' },
        gradeLevelId: { type: DataTypes.INTEGER, allowNull: false }
    });

    db.Question = sequelize.define('Question', {
        question: { type: DataTypes.TEXT, allowNull: false },
        optionA: { type: DataTypes.STRING, allowNull: false },
        optionB: { type: DataTypes.STRING, allowNull: false },
        optionC: { type: DataTypes.STRING, allowNull: false },
        optionD: { type: DataTypes.STRING, allowNull: false },
        answer: { type: DataTypes.STRING, allowNull: false },
        gradeLevelId: { type: DataTypes.INTEGER, allowNull: false },
        subjectId: { type: DataTypes.INTEGER, allowNull: false }
    });

    // ================= ASSOCIATIONS =================

    db.Account.hasOne(db.Preferences, { foreignKey: 'AccountId' });
    db.Preferences.belongsTo(db.Account, { foreignKey: 'AccountId' });

    db.Account.hasMany(db.RefreshToken, { foreignKey: 'AccountId' });
    db.RefreshToken.belongsTo(db.Account, { foreignKey: 'AccountId' });

    db.Account.hasMany(db.ActivityLog, { foreignKey: 'AccountId' });
    db.ActivityLog.belongsTo(db.Account, { foreignKey: 'AccountId' });

    db.GradeLevel.hasMany(db.Subject, { foreignKey: 'gradeLevelId', as: 'subjects', onDelete: 'CASCADE' });
    db.Subject.belongsTo(db.GradeLevel, { foreignKey: 'gradeLevelId', as: 'gradeLevel' });

    db.GradeLevel.hasMany(db.Question, { foreignKey: 'gradeLevelId', onDelete: 'CASCADE' });
    db.Question.belongsTo(db.GradeLevel, { foreignKey: 'gradeLevelId' });

    db.Subject.hasMany(db.Question, { foreignKey: 'subjectId', onDelete: 'CASCADE' });
    db.Question.belongsTo(db.Subject, { foreignKey: 'subjectId' });

    await sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully');

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

})();

module.exports = db;
