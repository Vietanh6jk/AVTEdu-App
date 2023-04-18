const { ConnectDB } = require("../config/mysql.config");
const responseHandler = require("../handlers/response.handler");
const {
  getWeekDates,
  getWeekDay,
  fomartDateToFE,
} = require("../helpers/date.validate");
const { QueryTypes } = require("sequelize");
const { async } = require("@firebase/util");

const sequelize = ConnectDB().getInstance();

const getDanhSanhSachSinhVienTheoLopHocPhan = async (req, res, next) => {
  try {
    const { ma_lop_hoc_phan } = req.body;
    const DanhSachSinhVien = await sequelize.query(
      `select sv.ma_sinh_vien,sv.ho_ten_sinh_vien
        from sinhviendb.sinh_vien as sv 
        left join sinhviendb.thoi_khoa_bieu_sinh_vien as tkbsv on tkbsv.ma_sinh_vien = sv.ma_sinh_vien
        left join sinhviendb.thoi_khoa_bieu as tkb on tkbsv.ma_thoi_khoa_bieu = tkb.ma_thoi_khoa_bieu
        left join sinhviendb.phan_cong_lop_hoc_phan as pclhp on tkb.ma_phan_cong_lop_hoc_phan = pclhp.ma_phan_cong
        left join sinhviendb.lop_hoc_phan as lhp on pclhp.ma_lop_hoc_phan = lhp.ma_lop_hoc_phan
        left join sinhviendb.hoc_phan as hp on lhp.ma_hoc_phan = hp.ma_hoc_phan
        left join sinhviendb.mon_hoc as mh on hp.ma_mon_hoc = mh.ma_mon_hoc
        left join sinhviendb.giang_vien as gv on pclhp.ma_giang_vien = gv.ma_giang_vien
        left join sinhviendb.phong_hoc as ph on tkb.ma_phong_hoc = ph.ma_phong_hoc
        where  lhp.ma_lop_hoc_phan="${ma_lop_hoc_phan}"  and gv.ma_giang_vien = ${req.payload.userId};`,
      { type: QueryTypes.SELECT }
    );
    if (!DanhSachSinhVien) {
      return responseHandler.ok(res, { success: true });
    }
    return responseHandler.ok(res, { success: true, DanhSachSinhVien });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getThoiKhoaBieuGiangVienTrongMotTuan = async (req, res, next) => {
  try {
    const { ngay } = req.body;
    let result = [];
    const tuan = getWeekDates(new Date(ngay));
    let i = 0;
    for (const day of tuan) {
      let dayOfWeeek = day.wod;
      console.log(
        i +
          ":" +
          dayOfWeeek +
          "+" +
          day.date +
          "+" +
          req.payload.userId +
          "+" +
          result
      );
      ++i;
      let ngayHoc = await sequelize.query(
        `select tkb.*,mh.ten_mon_hoc,gv.ten_giang_vien,lhp.ten_lop_hoc_phan,ph.ten_day_nha,ph.ten_phong_hoc
        from sinhviendb.sinh_vien as sv 
        left join sinhviendb.thoi_khoa_bieu_sinh_vien as tkbsv on tkbsv.ma_sinh_vien = sv.ma_sinh_vien
        left join sinhviendb.thoi_khoa_bieu as tkb on tkbsv.ma_thoi_khoa_bieu = tkb.ma_thoi_khoa_bieu
        left join sinhviendb.phan_cong_lop_hoc_phan as pclhp on tkb.ma_phan_cong_lop_hoc_phan = pclhp.ma_phan_cong
        left join sinhviendb.lop_hoc_phan as lhp on pclhp.ma_lop_hoc_phan = lhp.ma_lop_hoc_phan
        left join sinhviendb.hoc_phan as hp on lhp.ma_hoc_phan = hp.ma_hoc_phan
        left join sinhviendb.mon_hoc as mh on hp.ma_mon_hoc = mh.ma_mon_hoc
        left join sinhviendb.giang_vien as gv on pclhp.ma_giang_vien = gv.ma_giang_vien
        left join sinhviendb.phong_hoc as ph on tkb.ma_phong_hoc = ph.ma_phong_hoc
        where tkb.thoi_gian_bat_dau <= '${day.date}' and tkb.thoi_gian_ket_thuc >= '${day.date}' and tkb.ngay_hoc_trong_tuan ='${dayOfWeeek}' and gv.ma_giang_vien ='${req.payload.userId}'; `,
        { type: QueryTypes.SELECT }
      );
      result.push({
        Thu: getWeekDay(day.originDay),
        Ngay: fomartDateToFE(day.originDay),
        TKB: ngayHoc,
      });
    }
    res.status(201).json({ success: true, result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getLopHocPhanDangDay = async (req, res, next) => {
  try {
    const ma_giang_vien = req.payload.userId;
  } catch (error) {}
};
module.exports = {
  getDanhSanhSachSinhVienTheoLopHocPhan,
  getThoiKhoaBieuGiangVienTrongMotTuan,
};
