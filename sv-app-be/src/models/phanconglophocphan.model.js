const {Sequelize, DataTypes, Model} = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");

const sequelize = ConnectDB().getInstance();

class PhanCongLopHocPhan extends Model {}

PhanCongLopHocPhan.init({
    ma_phan_cong:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false
    },
    loai_hoc_phan_phu_trach:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    nhom_thuc_hanh_phu_trach:{
        type:DataTypes.INTEGER,
    },
    so_luong_sv_phu_trach:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    ma_giang_vien:{
        type:DataTypes.INTEGER,
        references:{
            model:"giang_vien",
            key:"ma_giang_vien"
        }
    },
    ma_lop_hoc_phan:{
        type:DataTypes.INTEGER,
        references:{
            model:"lop_hoc_phan",
            key:"ma_lop_hoc_phan"
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
    modelName:'phan_cong_lop_hoc_phan',
    timestamps:false,
    freezeTableName:true 
});
module.exports=PhanCongLopHocPhan;