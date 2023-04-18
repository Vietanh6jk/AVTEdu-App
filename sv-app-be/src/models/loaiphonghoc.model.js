const {Sequelize, DataTypes, Model} = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");

const sequelize = ConnectDB().getInstance();

class LoaiPhongHoc extends Model {}

LoaiPhongHoc.init({
    ma_loai_phong_hoc:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false
    },
    ten_loai_phong_hoc:{
        type:DataTypes.STRING,
        allowNull:false
    },
    mo_ta:{
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
    modelName:'loai_phong_hoc',
    timestamps:false,
    freezeTableName:true 
});
module.exports=LoaiPhongHoc;