'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    get formattedDate(){
      return this.dateOfBirth.toISOString().split('T')[0]
    }
    static associate(models) {
      UserProfile.belongsTo(models.User)
    }
  }
  UserProfile.init({
    fullName: DataTypes.STRING,
    profilePicture: DataTypes.TEXT,
    UserId: DataTypes.INTEGER,
    dateOfBirth: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'UserProfile',
  });
  return UserProfile;
};