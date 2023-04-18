const {Sequelize, DataTypes, Model} = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");


const sequelize = ConnectDB().getInstance();

class MonHoc extends Model {}

MonHoc.init({
    ma_mon_hoc:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false
    },
    ten_mon_hoc:{
        type:DataTypes.STRING,
        allowNull:false
    },
    mo_ta:{
        type:DataTypes.STRING,
    },
    //Tạo khoá ngoại khoa
    ma_khoa:{
        type:DataTypes.INTEGER,
        references:{
            model:"khoa",
            key:"ma_khoa"
        }
    },
},{
    sequelize,
    modelName:'mon_hoc',
    timestamps:false,
    freezeTableName:true 
});
module.exports=MonHoc;