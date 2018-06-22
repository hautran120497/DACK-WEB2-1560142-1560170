/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('gainvip_request', {
    username: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true
    },
    isAccepted: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'gainvip_request'
  });
};
