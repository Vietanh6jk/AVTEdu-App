const {Sequelize, DataTypes, Model} = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");


const sequelize = ConnectDB().getInstance();

class HocPhan extends Model {}

HocPhan.init({
    ma_hoc_phan:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false
    },
    so_tin_chi_ly_thuyet:{
        type:DataTypes.INTEGER,
    },
    so_tin_chi_thuc_hanh:{
        type:DataTypes.INTEGER,
    },
    hoc_phan_bat_buoc:{
        type:DataTypes.BOOLEAN,
    },
    ma_mon_song_hanh:{
        type:DataTypes.INTEGER,
    },
    ma_mon_tien_quyet:{
        type:DataTypes.INTEGER,
    },
    ma_mon_hoc:{
        type:DataTypes.INTEGER,
        references:{
            model:'mon_hoc',
            key:"ma_mon_hoc"
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
    modelName:'hoc_phan',
    timestamps:false,
    freezeTableName:true 
});
module.exports=HocPhan;