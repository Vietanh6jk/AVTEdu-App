const {Sequelize, DataTypes, Model} = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");
const bcrypt = require("bcryptjs");
const Khoa = require("./khoa.model");

const sequelize = ConnectDB().getInstance();
/*
*Model Admin
*/

class Admin extends Model {
    isValidPassword = async function (newPassword) {
        try {
          return await bcrypt.compare(newPassword, this.mat_khau);
        } catch (error) {
          throw new Error(error);
        }
    };
    
};
Admin.init({
    ma_admin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mat_khau: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Khoá ngoại của Khoa tới Admin
    ma_khoa:{
        type: DataTypes.INTEGER,
        references: {
            model: 'khoa',
            key: 'ma_khoa'
            }
        }
}, {
    sequelize,
    modelName: 'admin',
    timestamps: false,
    freezeTableName: true
});
module.exports = Admin;