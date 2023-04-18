const {Sequelize, DataTypes, Model} = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");


const sequelize = ConnectDB().getInstance();

class PhongHoc extends Model {}

PhongHoc.init({
    ma_phong_hoc:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false
    },
    ten_day_nha:{
        type:DataTypes.STRING,
        allowNull:false
    },
    ten_phong_hoc:{
        type:DataTypes.STRING,
        allowNull:false
    },
    ma_loai_phong:{
        type:DataTypes.INTEGER,
        references:{
            model:'loai_phong_hoc',
            key:"ma_loai_phong_hoc"
        }
    },
    ghi_chu:{
        type:DataTypes.STRING,
    },
    //Tạo khoá ngoại khoa
    // ma_khoa:{
    //     type:DataTypes.INTEGER,
    //     references:{
    //         model:"khoa",
    //         key:"ma_khoa"
    //     }
    // },
},{
    sequelize,
    modelName:'phong_hoc',
    timestamps:false,
    freezeTableName:true 
});
module.exports=PhongHoc;