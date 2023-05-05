const { Sequelize, DataTypes, Model } = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");

const sequelize = ConnectDB().getInstance();

class ThoiKhoaBieu extends Model { }

ThoiKhoaBieu.init({
    ma_thoi_khoa_bieu: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    loai_hoc_phan: {
        type: DataTypes.INTEGER,
    },
    ngay_hoc_trong_tuan: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nhom_thuc_hanh: {
        type: DataTypes.INTEGER
    },
    thoi_gian_bat_dau: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    thoi_gian_ket_thuc: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    tiet_hoc_bat_dau: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tiet_hoc_ket_thuc: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ma_phan_cong_lop_hoc_phan: {
        type: DataTypes.INTEGER,
        references: {
            model: 'phan_cong_lop_hoc_phan',
            key: 'ma_phan_cong'
        }
    },
    ma_phong_hoc: {
        type: DataTypes.INTEGER,
        references: {
            model: 'phong_hoc',
            key: 'ma_phong_hoc'
        }
    },
    ghi_chu: {
        type: DataTypes.STRING,
    }

}, {
    sequelize,
    modelName: 'thoi_khoa_bieu',
    freezeTableName: true,
    timestamps: false,
})
module.exports = ThoiKhoaBieu;