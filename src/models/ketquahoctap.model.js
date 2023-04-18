const {Sequelize, DataTypes, Model} = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");

const sequelize = ConnectDB().getInstance();

class KetQuaHocTap extends Model {}

KetQuaHocTap.init({
    ma_ket_qua_hoc_tap:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false
    },
    diem_tk_1:{
        type:DataTypes.FLOAT,
    },
    diem_tk_2:{
        type:DataTypes.FLOAT,
    },
    diem_tk_3:{
        type:DataTypes.FLOAT,
    },
    diem_tk_4:{
        type:DataTypes.FLOAT,
    },
    diem_tk_5:{
        type:DataTypes.FLOAT,
    },
    diem_th_1:{
        type:DataTypes.FLOAT,
    },
    diem_th_2:{
        type:DataTypes.FLOAT,
    },
    diem_th_3:{
        type:DataTypes.FLOAT,
    },
    diem_th_4:{
        type:DataTypes.FLOAT,
    },
    diem_th_5:{
        type:DataTypes.FLOAT,
    },
    diem_gk:{
        type:DataTypes.FLOAT,
    },
    diem_ck:{
        type:DataTypes.FLOAT,
    },
    diem_tk_hs_4:{
        type:DataTypes.FLOAT,
    },
    diem_tk_hs_10:{
        type:DataTypes.FLOAT,
    },
    diem_chu:{
        type:DataTypes.CHAR(10)
    },
    xep_loai:{
        type:DataTypes.INTEGER,
    },
    ghi_chu:{
        type:DataTypes.STRING,
    },
    ma_sinh_vien:{
        type:DataTypes.INTEGER,
        references:{
            model:'sinh_vien',
            key:'ma_sinh_vien'
        }
    },
    ma_lop_hoc_phan:{
        type:DataTypes.INTEGER,
        references:{
            model:'lop_hoc_phan',
            key:'ma_lop_hoc_phan'
        }
    },
    tinh_trang_hoc_tap:{
        type:DataTypes.INTEGER
    },
    ngay_dang_ki:{
        type:DataTypes.DATE
    }
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
    modelName:'ket_qua_hoc_tap',
    timestamps:false,
    freezeTableName:true 
});
module.exports=KetQuaHocTap;