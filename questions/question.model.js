const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Question = sequelize.define('Question', {
    subjectId: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false } // question content (can store multiple lines)
  });

  Question.associate = (models) => {
    Question.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
  };

  return Question;
};
