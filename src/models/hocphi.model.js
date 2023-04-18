
const { Sequelize, DataTypes, Model } = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");


const sequelize = ConnectDB().getInstance();

class HocPhi extends Model { }

HocPhi.init({
    ma_hoc_phi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    noi_dung_thu: {
        type: DataTypes.STRING,
    },
    trang_thai_dang_ki: {
        type: DataTypes.STRING,
    },
    so_tien: {
        type: DataTypes.BIGINT,
    },
    mien_giam: {
        type: DataTypes.BIGINT,
    },
    so_tien_da_nop: {
        type: DataTypes.BIGINT,
    },
    cong_no: {
        type: DataTypes.BIGINT,
    },
    trang_thai: {
        type: DataTypes.STRING,
    },
    //Tạo khoá ngoại khoa
    ma_lop_hoc_phan: {
        type: DataTypes.INTEGER,
        references: {
            model: "lop_hoc_phan",
            key: "ma_lop_hoc_phan"
        }
    },
    ma_phieu_thu:{
        type:DataTypes.INTEGER,
        references:{
            model:'phieu_thu',
            key:"ma_phieu_thu"
        },
        allowNull:true
    },
}, {
    sequelize,
    modelName: 'hoc_phi',
    timestamps: false,
    freezeTableName: true
});
module.exports = HocPhi;