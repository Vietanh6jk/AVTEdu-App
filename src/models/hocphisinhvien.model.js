const {Sequelize, DataTypes, Model} = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");


const sequelize = ConnectDB().getInstance();

class HocPhiSinhVien extends Model {}

HocPhiSinhVien.init({
    ma_hoc_phi_sinh_vien:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false
    },
    //Tạo khoá ngoại khoa
    ma_hoc_phi:{
        type:DataTypes.INTEGER,
        references:{
            model:"hoc_phi",
            key:"ma_hoc_phi"
        }
    },
    //Tạo khoá ngoại khoa
    ma_sinh_vien:{
        type:DataTypes.INTEGER,
        references:{
            model:"sinh_vien",
            key:"ma_sinh_vien"
        }
    },
},{
    sequelize,
    modelName:'hoc_phi_sinh_vien',
    timestamps:false,
    freezeTableName:true 
});
module.exports=HocPhiSinhVien;