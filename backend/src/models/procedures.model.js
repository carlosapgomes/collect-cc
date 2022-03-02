// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const procedures = sequelizeClient.define('procedures', {
    descr: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // DateTime of patient arrival at surgical room
    ptAtSiteDateTime: { 
      type: DataTypes.DATE,
      allowNull: false,
    },
    // DateTime when patient left the surgical room
    ptLeftSiteDateTime: { 
      type: DataTypes.DATE,
      allowNull: false,
    },
    surgicalRoomOccupDuration: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    // DateTime of surgeon arrival at surgical room
    surgeonAtSiteDateTime: { 
      type: DataTypes.DATE,
      allowNull: false,
    },
    // DateTime of anesthesiologist arrival at surgical room
    anestAtSiteDateTime: { 
      type: DataTypes.DATE,
      allowNull: false,
    },
    // DateTime of authorization for the procedure start by 
    // the anesthesiologist
    startOfProcAuthByAnestDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    procStartDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    procEndDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    procDuration: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    anestStartDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    anestEndDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    anestDuration: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    ptName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ptRecN: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ptID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ptDateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ptAge: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    ptGender: {
      type: DataTypes.ENUM('M', 'F','D','NA'),
      allowNull: false,
    },
    ptCity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ptState: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ptWard: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ptBed: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ptDestWard: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ptDestBed: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    team:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    surgicalRoom:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    user1Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user1LicenceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user1ID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user2Name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user2LicenceNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user2ID: {
      type: DataTypes.STRING,
      allowNull: true,
    },    
    user3Name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user3LicenceNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user3ID: {
      type: DataTypes.STRING,
      allowNull: true,
    },    
    user4Name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user4LicenceNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user4ID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user5Name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user5LicenceNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user5ID: {
      type: DataTypes.STRING,
      allowNull: true,
    },    
    user6Name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user6LicenceNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user6ID: {
      type: DataTypes.STRING,
      allowNull: true,
    },    
    circulatingNurse1Name: {
      type: DataTypes.STRING,
      allowNull: true,
    },    
    circulatingNurse1ID: {
      type: DataTypes.STRING,
      allowNull: true,
    },    
    circulatingNurse1LicenceNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },    
    circulatingNurse2Name: {
      type: DataTypes.STRING,
      allowNull: true,
    },    
    circulatingNurse2ID: {
      type: DataTypes.STRING,
      allowNull: true,
    },    
    circulatingNurse2LicenceNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },    
    anesthesiologist1Name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    anesthesiologist1LicenceNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    anesthesiologist1ID: {
      type: DataTypes.STRING,
      allowNull: true,
    },    
    anesthesiologist2Name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    anesthesiologist2LicenceNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    anesthesiologist2ID: {
      type: DataTypes.STRING,
      allowNull: true,
    },    
    anesthesiologist3Name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    anesthesiologist3LicenceNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    anesthesiologist3ID: {
      type: DataTypes.STRING,
      allowNull: true,
    },    
    surgicalComplexity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    typeOfSurgery: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    wasCanceled: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    cancelationReason: { 
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    anesthesiaType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    anesthesiaSubType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    riskClassASA: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contaminationRisk: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    antibioticUse: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    ptDeadOnOpRoom: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdByUserName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdByUserID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updatedByUserName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updatedByUserID: {
      type: DataTypes.STRING,
      allowNull: false,
    },}, {
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
