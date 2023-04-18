const {Sequelize, DataTypes, Model} = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");

const sequelize = ConnectDB().getInstance();
/*
*Model BacDaoTao
*/
class BacDaoTao extends Model {};

BacDaoTao.init({
    ma_bac_dao_tao:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    ten_bac_dao_tao:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    mo_ta:{
        type: DataTypes.STRING,
    }
},{
    sequelize,
    modelName:'bacdaotao',
    timestamps:false,
    freezeTableName:true
  });
module.exports= BacDaoTao;