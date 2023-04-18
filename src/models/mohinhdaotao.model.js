const {Sequelize, DataTypes, Model} = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");

const sequelize = ConnectDB().getInstance();

/*
*Model Mô Hình Đào Tạo
*/

class MoHinhDaoTao extends Model{};

MoHinhDaoTao.init({
    ma_mo_hinh_dao_tao:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull:false
    },
    ten_mo_hinh_dao_tao:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    mo_ta:{
        type: DataTypes.STRING,
    },
},{
    sequelize,
    modelName:'mo_hinh_dao_tao',
    timestamps:false,
    freezeTableName:true
  });
module.exports= MoHinhDaoTao;