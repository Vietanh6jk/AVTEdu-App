const {Sequelize, DataTypes, Model} = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");
const bcrypt = require("bcryptjs");

const sequelize = ConnectDB().getInstance();

class GiangVien extends Model {
    isValidPassword = async function (newPassword) {
        try {
          return await bcrypt .compare(newPassword, this.password);
        } catch (error) {
          throw new Error(error);
        }
      };
}

GiangVien.init({
    ma_giang_vien:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
    },
    ten_giang_vien:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    ngay_sinh:{
        type:DataTypes.DATE,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    gioi_tinh:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    //Tạo mã khoá ngoại khoa
    ma_khoa:{
        type:DataTypes.INTEGER,
        references:{
            model:'khoa',
            key:'ma_khoa'
        }
    }
},{
    sequelize,
    modelName:'giang_vien',
    timestamps:false,
    freezeTableName:true 
});
module.exports=GiangVien;