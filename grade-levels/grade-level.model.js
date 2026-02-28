const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const GradeLevel = sequelize.define('GradeLevel', {
    name: { type: DataTypes.STRING, allowNull: false },
    academicLevel: { type: DataTypes.STRING, allowNull: true },
    gradeLevelStatus: { type: DataTypes.STRING, defaultValue: 'active' }
  });

  GradeLevel.associate = (models) => {
    GradeLevel.hasMany(models.Subject, { foreignKey: 'gradeLevelId', as: 'subjects' });
  };

  return GradeLevel;
};
