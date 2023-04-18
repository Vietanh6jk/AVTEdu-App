const {Sequelize, DataTypes, Model} = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");

const sequelize = ConnectDB().getInstance();

class HocKi extends Model {}

HocKi.init({
    ma_hoc_ki:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false
    },
    nam_hoc_bat_dau:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    nam_hoc_ket_thuc:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    thu_tu_hoc_ki:{
        type:DataTypes.INTEGER,
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
    modelName:'hoc_ki',
    timestamps:false,
    freezeTableName:true 
});
module.exports=HocKi;