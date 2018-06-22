/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('timenew', {
    timenew: {
      type: DataTypes.INTEGER(11),
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
    tableName: 'timenew'
  });
};
