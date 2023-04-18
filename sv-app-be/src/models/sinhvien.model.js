const { Sequelize, DataTypes, Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const { ConnectDB } = require("../config/mysql.config");
const DanToc = require("./dantoc.model");
const Khoa = require("./khoa.model");
const MoHinhDaoTao = require("./mohinhdaotao.model");
const BacDaoTao = require("./bacdaotao.model");
const KhoaHoc = require("./khoahoc.model");
const TrangThaiHocTap = require("./trangthaihoctap.model");

const sequelize = ConnectDB().getInstance();


/*
*Model Sinh Viên
*/

class SinhVien extends Model {
  isValidPassword = async function (newPassword) {
    try {
      return await bcrypt.compare(newPassword, this.mat_khau);
    } catch (error) {
      throw new Error(error);
    }
  };
  createImageUrl = () => {

  }
}
SinhVien.init({
  ma_sinh_vien: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  ho_ten_sinh_vien: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ngay_sinh: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
  },
  gioitinh: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  ho_khau_thuong_tru: {
    type: DataTypes.STRING,
  },
  mat_khau: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  so_dien_thoai: {
    type: DataTypes.CHAR(10),
  },
  so_cmnd: {
    type: DataTypes.CHAR(20),
  },
  ma_dan_toc: {
    type: DataTypes.INTEGER,
    references: {
      model: DanToc,
      key: "ma_dan_toc",
    }
  },
  nien_khoa:{
    type: DataTypes.STRING,
    allowNull:false,
  },
  //Tạo khoá ngoại của bảng Khoa
  ma_khoa: {
    type: DataTypes.INTEGER,
    references: {
      model: Khoa,
      key: "ma_khoa",
    }
  },
  //Tạo khoá ngoại của bảng Mô hình đào tạo 
  ma_mo_hinh_dao_tao: {
    type: DataTypes.INTEGER,
    references: {
      model: MoHinhDaoTao,
      key: "ma_mo_hinh_dao_tao",
    }
  },
  //Tạo khoá ngoại của bảng Bậc Đào Tạo
  ma_bac_dao_tao: {
    type: DataTypes.INTEGER,
    references: {
      model: BacDaoTao,
      key: "ma_bac_dao_tao",
    }
  },
  //Tạo khoá ngoại của bảng Khoá Học
  ma_khoa_hoc: {
    type: DataTypes.INTEGER,
    references: {
      model: KhoaHoc,
      key: "ma_khoa_hoc",
    }
  },
  ma_chuyen_nganh:{
    type:DataTypes.INTEGER,
    references:{
      model:'chuyen_nganh',
      key:'ma_chuyen_nganh'
    }
  },
  ma_ton_giao:{
    type:DataTypes.INTEGER,
    references:{
      model:'ton_giao',
      key:'ma_ton_giao'
    }
  },
  ma_trang_thai:{
    type:DataTypes.INTEGER,
    references:{
      model:'trang_thai_hoc_tap',
      key:'ma_trang_thai_hoc_tap'
    }
  }
}, {
  sequelize,
  modelName: 'sinh_vien',
  timestamps: false,
  freezeTableName: true
})
// SinhVien.belongsTo(TrangThaiHocTap,{foreignKey:"ma_trang_thai"});
// TrangThaiHocTap.hasOne(SinhVien,{foreignKey:"ma_trang_thai"});

module.exports = SinhVien;
