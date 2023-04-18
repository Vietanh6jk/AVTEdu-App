const {Sequelize, DataTypes, Model} = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");

const sequelize = ConnectDB().getInstance();

/*
*Model Tôn Giáo
*/

class TonGiao extends Model {};

TonGiao.init({
    ma_ton_giao:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    ten_ton_giao:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    mo_ta:{
        type: DataTypes.STRING,
    }
},{
    sequelize,
    modelName:'ton_giao',
    timestamps:false,
    freezeTableName:true
  });
module.exports= TonGiao;

