/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bidlog', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    proID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER(11),
      allowNull: false
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
    tableName: 'bidlog'
  });
};
