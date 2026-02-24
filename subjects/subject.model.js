const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

  const Subject = sequelize.define('Subject', {
    name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },

    subjectStatus: {
      type: DataTypes.STRING,
      defaultValue: 'active'
    },

    gradeLevelId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Subject.associate = (models) => {
    Subject.belongsTo(models.GradeLevel, {
      foreignKey: 'gradeLevelId',
      as: 'gradeLevel'
    });
  };

  return Subject;
};
