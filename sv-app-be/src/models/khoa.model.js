const {Sequelize, DataTypes,Model} = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");
const Admin = require("./admin.model");

const sequelize = ConnectDB().getInstance();
/*
*Model Khoa
*/

class Khoa extends Model {
    //Các mỗi quan hệ của bảng Khoa
    static associate(models){
        //Tạo mối quan hệ đến bảng Admin
        Khoa.belongsTo(Admin,{as:'admin'});
    }
};

Khoa.init({
    ma_khoa:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    ten_khoa:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    mo_ta:{
        type: DataTypes.STRING,
    }, 
  
},{
    sequelize,
    modelName:'khoa',
    timestamps:false,
    freezeTableName:true
  });
Khoa.hasOne(Admin,{foreignKey: 'ma_khoa', as: 'khoa'})
module.exports =Khoa;