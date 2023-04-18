const {Sequelize, DataTypes, Model} = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");

const sequelize = ConnectDB().getInstance();

class ThoiKhoaBieuSinhVien extends Model {}

ThoiKhoaBieuSinhVien.init({
    ma:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false
    },
    loai_ngay_hoc:{
        type:DataTypes.STRING,
    },
    ma_sinh_vien:{
        type:DataTypes.INTEGER,
        references:{
            model:'sinh_vien',
            key:"ma_sinh_vien"
        }
    },
    ma_thoi_khoa_bieu:{
        type:DataTypes.INTEGER,
        references:{
            model:'thoi_khoa_bieu',
            key:'ma_thoi_khoa_bieu'
        }
    },
    ghi_chu:{
        type:DataTypes.STRING,
    }

},{
    sequelize,
    modelName:'thoi_khoa_bieu_sinh_vien',
    freezeTableName:true,
    timestamps:false,
})
module.exports = ThoiKhoaBieuSinhVien;