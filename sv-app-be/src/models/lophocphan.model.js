const {Sequelize, DataTypes, Model, INTEGER} = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");

const sequelize = ConnectDB().getInstance();

class LopHocPhan extends Model {}

LopHocPhan.init({
    ma_lop_hoc_phan:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false
    },
    ten_lop_hoc_phan:{
        type:DataTypes.STRING,
        allowNull:false
    },
    ten_viet_tat:{
        type:DataTypes.STRING,
        allowNull:false
    },
    so_luong_dang_ki_toi_da:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    so_luong_dang_ki_hien_tai:{
        type:DataTypes.INTEGER,
    },
    so_nhom_thuc_hanh:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    loai:{
        type:DataTypes.INTEGER,
    },
    trang_thai:{
        type:DataTypes.INTEGER,
    },
    ma_hoc_ki:{
        type:DataTypes.INTEGER,
        references:{
            model:"hoc_ki",
            key:"ma_hoc_ki"
        }
    },
    ma_hoc_phan:{
        type:DataTypes.INTEGER,
        references:{
            model:"hoc_phan",
            key:"ma_hoc_phan"
        }
    },
    mo_ta:{
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
    modelName:'lop_hoc_phan',
    timestamps:false,
    freezeTableName:true 
});
module.exports=LopHocPhan;