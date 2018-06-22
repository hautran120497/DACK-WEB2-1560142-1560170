/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_evaluate', {
    fromUser: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true
    },
    toUser: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true
    },
    action: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    message: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      primaryKey: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'user_evaluate'
  });
};
