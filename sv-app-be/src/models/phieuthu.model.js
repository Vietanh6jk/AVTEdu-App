const {Sequelize, DataTypes, Model} = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");


const sequelize = ConnectDB().getInstance();

class PhieuThu extends Model {}

PhieuThu.init({
    ma_phieu_thu:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false
    },
    ten_phieu_thu:{
        type:DataTypes.STRING,
        allowNull:false
    },
    ngay_thu:{
        type:DataTypes.DATEONLY,
        allowNull:false
    },
    don_vi_thu:{
        type:DataTypes.STRING,
        allowNull:false
    },
    ghi_chu:{
        type:DataTypes.STRING,
    },
    //Tạo khoá ngoại khoa
    // ma_khoa:{
    //     type:DataTypes.INTEGER,
    //     references:{
    //         model:"khoa",
    //         key:"ma_khoa"
    //     }
    // },
},{
    sequelize,
    modelName:'phieu_thu',
    timestamps:false,
    freezeTableName:true 
});
module.exports=PhieuThu;