const {Sequelize, DataTypes, Model} = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");
const SinhVien = require("./sinhvien.model");

const sequelize = ConnectDB().getInstance();

/*
*Model Trạng Thái Học Tập
*/

class TrangThaiHocTap extends Model{};

TrangThaiHocTap.init({
    ma_trang_thai_hoc_tap:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    ten_trang_thai_hoc_tap:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    mo_ta:{
        type: DataTypes.STRING,
    },
},{
    sequelize,
    modelName:'trang_thai_hoc_tap',
    timestamps:false,
    freezeTableName:true
  });

module.exports= TrangThaiHocTap;