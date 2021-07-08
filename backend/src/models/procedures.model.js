// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const procedures = sequelizeClient.define('procedures', {
    descr: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ptName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ptID: {
      type: DataTypes.STRING,
      allowNull: false
    },
    procDateTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    docName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    docID: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  procedures.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return procedures;
};
