/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('products', {
    proID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    proName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    catID: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    initPrice: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    stepPrice: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    shotPrice: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    currentPrice: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    autoRenewal: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    remainTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    bidCount: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    isTimeOut: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    maxBidder: {
      type: DataTypes.STRING(32),
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
    tableName: 'products'
  });
};
