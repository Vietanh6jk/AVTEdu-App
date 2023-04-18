const {Sequelize, DataTypes, Model} = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");

const sequelize = ConnectDB().getInstance();

/*
*Model DanToc
*/

class DanToc extends Model {};

DanToc.init({
    ma_dan_toc:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    ten_dan_toc:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    mo_ta:{
        type: DataTypes.STRING,
    }
},{
    sequelize,
    modelName:'dantoc',
    timestamps:false,
    freezeTableName:true
  });
module.exports= DanToc;