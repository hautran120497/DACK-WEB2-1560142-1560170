/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    username: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(127),
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    point: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    gainvipAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isValidated: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
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
    tableName: 'user'
  });
};
