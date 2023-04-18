const {Sequelize, DataTypes, Model} = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");


const sequelize = ConnectDB().getInstance();

class ChuyenNganhHocPhan extends Model {}

ChuyenNganhHocPhan.init({
    ma:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false
    },
    ma_chuyen_nganh:{
        type:DataTypes.INTEGER,
        references:{
            model:"chuyen_nganh",
            key:"ma_chuyen_nganh",
        }
    },
    ma_hoc_phan:{
        type:DataTypes.INTEGER,
        references:{
            model:'hoc_phan',
            key:'ma_hoc_phan'
        }
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
    modelName:'chuyen_nganh_hoc_phan',
    timestamps:false,
    freezeTableName:true 
});
module.exports=ChuyenNganhHocPhan;