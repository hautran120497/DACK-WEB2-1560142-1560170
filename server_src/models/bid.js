/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bid', {
    username: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    proID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    maxPrice: {
      type: DataTypes.INTEGER(11),
      allowNull: false
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
    },
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    tableName: 'bid'
  });
};
