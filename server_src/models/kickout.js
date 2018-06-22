/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kickout', {
    proID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'kickout'
  });
};
