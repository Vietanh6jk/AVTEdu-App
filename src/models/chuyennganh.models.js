const {Sequelize, DataTypes, Model} = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");

const sequelize = ConnectDB().getInstance();

class ChuyenNganh extends Model {}

ChuyenNganh.init({
    ma_chuyen_nganh:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
    },
    ten_chuyen_nganh:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    so_tin_chi:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    mo_ta:{
        type:DataTypes.STRING,
    },
    //Tạo mã khoá ngoại khoa
    ma_khoa:{
        type:DataTypes.INTEGER,
        references:{
            model:'khoa',
            key:'ma_khoa'
        }
    }
},{
    sequelize,
    modelName:'chuyen_nganh',
    timestamps:false,
    freezeTableName:true 
});
module.exports=ChuyenNganh;