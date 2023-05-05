const { Op } = require("sequelize");
const { ConnectDB } = require("../config/mysql.config");
const HocKi = require("../models/hocki.model");
const SinhVien = require("../models/sinhvien.model");
const { QueryTypes } = require("sequelize");
const HocPhan = require("../models/hocphan.model");
const LopHocPhan = require("../models/lophocphan.model");
const ThoiKhoaBieuSinhVien = require("../models/thoikhoabieusinhvien.model");
const { createThoiKhoaBieuSinhVien } = require("./admin.controller");
const { verifyRefreshToken } = require("../helpers/jwt.service");
const HocPhi = require("../models/hocphi.model");
const responseHanlder = require("../handlers/response.handler");
const HocPhiSinhVien = require("../models/hocphisinhvien.model");
const PhanCongLopHocPhan = require("../models/phanconglophocphan.model");
const {
  getWeekDates,
  getWeekDay,
  fomartDateToFE,
} = require("../helpers/date.validate");
const KetQuaHocTap = require("../models/ketquahoctap.model");
const { findAll } = require("../models/hocki.model");
const { momoPayment } = require("../config/momo.config");
const PhieuThu = require("../models/phieuthu.model");
const { sendMailSample } = require("../config/testmail");
const { sendMail } = require("../config/mail.config");

const sequelize = ConnectDB().getInstance();
/**
 * Hàm này dùng để lấy học kì sinh viên từ sinh viên đang đăng nhập hiện tại
 * @returns: Tất cả học kì theo thuộc tính niên khoá của sinh vien
 * @private:Private
 * @Vietanh6jk
 */
const getHocKiSinhVien = async (req, res, next) => {
  try {
    //Lấy mã từ acessToken của sinh viên đang đang nhập
    const ma = req.payload.userId;
    //Tìm kiếm sinh viên xem có sinh viên có trong database không
    const foundSinhVien = await SinhVien.findOne({
      where: { ma_sinh_vien: `${ma}` },
    });
    if (!foundSinhVien)
      //Nếu không có sinh viên đẩy ra lỗi 403
      return res
        .status(403)
        .json({ error: { message: "Không tìm thấy sinh viên" } });
    //Thuộc tính niên khoá của sinh viển
    const nien_khoa = foundSinhVien.nien_khoa;
    //lấy năm bắt đầu từ bằng cấch lấy 4 chữ số đầu
    const nam_bat_dau = await nien_khoa.substring(0, 4);
    //Lấy năm kết thúc từ bằng cách lấy 4 chữ số sau dấu "-"
    const nam_ket_thuc = await nien_khoa.substring(5);
    //Tìm kiếm danh sách học kì từ năm bắt đầu đến năm kết thúc
    const dsHocKi = await HocKi.findAll({
      where: {
        nam_hoc_bat_dau: { [Op.gte]: `${nam_bat_dau}` },
        nam_hoc_ket_thuc: { [Op.lte]: `${nam_ket_thuc}` },
      },
    });
    //Đưa ra kết quả tìm thấy bằng mã 200 và success:true
    return res
      .status(201)
      .json({ success: true, nam_bat_dau, nam_ket_thuc, dsHocKi });
  } catch (error) {
    //Bắt lỗi khi chạy hàm và đưa ra trạng thái
    next(error);
  }
};

/**
 * Hàm này dùng để lấy tất cả môn chưa học từ sinh viên đang đăng nhập hiện tại
 * @returns: Tất cả môn sinh viên chưa học qua từ  sinh viên đăng nhập hiên tại
 * @private:Private
 * @Vietanh6jk
 */
const getMonHocSinhVienChuaHoc = async (req, res, next) => {
  try {
    // Lấy mã sinh viên từ thông tin payload
    const ma = req.payload.userId;
    // Tìm kiếm sinh viên với mã sinh viên này
    const foundSinhVien = await SinhVien.findOne({
      where: { ma_sinh_vien: `${ma}` },
    });
    // Nếu không tìm thấy sinh viên, trả về lỗi
    if (!foundSinhVien)
      return res
        .status(403)
        .json({ error: { message: "Không tìm thấy sinh viên" } });

    // Thực hiện truy vấn để lấy danh sách các môn học chưa được sinh viên học
    sequelize
      .query(
        // `select sv.ma_sinh_vien,sv.ho_ten_sinh_vien,mh.ma_mon_hoc,mh.ten_mon_hoc,hp.ma_hoc_phan,hp.so_tin_chi_ly_thuyet,hp.so_tin_chi_thuc_hanh,hp.hoc_phan_bat_buoc,hp.ma_mon_tien_quyet,hp.ma_mon_song_hanh
        //  from sinhviendb.sinh_vien as sv
        //  left join sinhviendb.chuyen_nganh as cn on sv.ma_chuyen_nganh = cn.ma_chuyen_nganh
        //  left join sinhviendb.chuyen_nganh_hoc_phan as cnhp on cn.ma_chuyen_nganh = cnhp.ma_chuyen_nganh
        //  left join sinhviendb.hoc_phan as hp on cnhp.ma_hoc_phan = hp.ma_hoc_phan
        //  left join sinhviendb.lop_hoc_phan as lhp on hp.ma_hoc_phan = lhp.ma_hoc_phan
        //  left join sinhviendb.hoc_ki as hk on lhp.ma_hoc_ki = hk.ma_hoc_ki
        //  left join sinhviendb.mon_hoc as mh on hp.ma_mon_hoc = mh.ma_mon_hoc
        //  where sv.ma_sinh_vien = '${ma}'
        //  and  hp.ma_hoc_phan not in (
        //     select lhp.ma_hoc_phan from sinhviendb.ket_qua_hoc_tap as kqht
        //     left join sinhviendb.lop_hoc_phan as lhp on kqht.ma_lop_hoc_phan = lhp.ma_lop_hoc_phan
        //     where kqht.ma_sinh_vien = '${ma}'
        //  )
        //  group by hp.ma_hoc_phan`,
        `
        select sv.ma_sinh_vien,sv.ho_ten_sinh_vien,mh.ma_mon_hoc,mh.ten_mon_hoc,hp.ma_hoc_phan,hp.so_tin_chi_ly_thuyet,hp.so_tin_chi_thuc_hanh,hp.hoc_phan_bat_buoc,hp.ma_mon_tien_quyet,hp.ma_mon_song_hanh
        ,lhp.ma_hoc_ki
        from sinhviendb.sinh_vien as sv
         left join sinhviendb.chuyen_nganh as cn on sv.ma_chuyen_nganh = cn.ma_chuyen_nganh
         left join sinhviendb.chuyen_nganh_hoc_phan as cnhp on cn.ma_chuyen_nganh = cnhp.ma_chuyen_nganh
         left join sinhviendb.hoc_phan as hp on cnhp.ma_hoc_phan = hp.ma_hoc_phan
         left join sinhviendb.lop_hoc_phan as lhp on hp.ma_hoc_phan = lhp.ma_hoc_phan
         left join sinhviendb.hoc_ki as hk on lhp.ma_hoc_ki = hk.ma_hoc_ki
         left join sinhviendb.mon_hoc as mh on hp.ma_mon_hoc = mh.ma_mon_hoc
         where sv.ma_sinh_vien = '${ma}'
         and  hp.ma_hoc_phan not in (
            select lhp.ma_hoc_phan from sinhviendb.ket_qua_hoc_tap as kqht 
            left join sinhviendb.lop_hoc_phan as lhp on kqht.ma_lop_hoc_phan = lhp.ma_lop_hoc_phan
            where kqht.ma_sinh_vien = '${ma}'
         )
         group by hp.ma_hoc_phan,sv.ma_chuyen_nganh,cn.ma_chuyen_nganh,cnhp.ma_chuyen_nganh,lhp.ma_hoc_phan,hk.ma_hoc_ki
         ,lhp.ma_hoc_ki, mh.ma_mon_hoc,hp.ma_mon_hoc
        `,
        { type: QueryTypes.SELECT }
      )
      .then(function (results) {
        // Trả về danh sách các môn học chưa được sinh viên học
        return res.status(201).json({ success: true, results });
      });
  } catch (error) {
    next(error);
  }
};

const getLopHocPhanByHocPhan = async (req, res, next) => {
  try {
    //Mã học phần
    const { ma, ma_hoc_ki } = req.body;
    const foundHocPhan = await HocPhan.findOne({
      where: { ma_hoc_phan: `${ma}` },
    });
    if (!foundHocPhan)
      return res
        .status(403)
        .json({ error: { message: "Không tìm thấy học phần" } });
    const foundHocKi = await HocKi.findOne({
      where: { ma_hoc_ki: `${ma_hoc_ki}` },
    });
    if (!foundHocKi)
      return res
        .status(403)
        .json({ error: { message: "Không tìm thấy học kì" } });
    sequelize
      .query(
        `select mh.ten_mon_hoc,lhp.trang_thai,lhp.ma_lop_hoc_phan,lhp.ten_lop_hoc_phan,lhp.so_luong_dang_ki_hien_tai,lhp.so_luong_dang_ki_toi_da,hk.ma_hoc_ki
        from sinhviendb.hoc_phan as hp
        left join sinhviendb.lop_hoc_phan as lhp on hp.ma_hoc_phan = lhp.ma_hoc_phan
        left join sinhviendb.mon_hoc as mh on hp.ma_mon_hoc = mh.ma_mon_hoc
        left join sinhviendb.hoc_ki as hk on lhp.ma_hoc_ki = hk.ma_hoc_ki
         where hp.ma_hoc_phan = '${ma}' and hk.ma_hoc_ki = '${ma_hoc_ki}'`,
        { type: QueryTypes.SELECT }
      )
      .then(function (results) {
        return res.status(201).json({ success: true, results });
      });
  } catch (error) {
    next(error);
  }
};
const getChiTietLopHocPhan = async (req, res, next) => {
  try {
    //Mã lớp học phần
    const { ma } = req.body;
    const foundHocPhan = await LopHocPhan.findOne({
      where: { ma_lop_hoc_phan: `${ma}` },
    });
    console.log(ma);
    if (!foundHocPhan)
      return res
        .status(403)
        .json({ error: { message: "Không tìm thấy  học phần" } });
    sequelize
      .query(
        `select lhp.trang_thai,pclhp.so_luong_sv_phu_trach,pclhp.loai_hoc_phan_phu_trach,tkb.ngay_hoc_trong_tuan,tkb.tiet_hoc_bat_dau,tkb.tiet_hoc_ket_thuc,ph.ten_day_nha,ph.ten_phong_hoc,gv.ten_giang_vien,tkb.thoi_gian_bat_dau,tkb.thoi_gian_ket_thuc,pclhp.ma_phan_cong
        from sinhviendb.hoc_phan as hp
        left join sinhviendb.lop_hoc_phan as lhp on hp.ma_hoc_phan = lhp.ma_hoc_phan
        left join sinhviendb.phan_cong_lop_hoc_phan as pclhp on lhp.ma_lop_hoc_phan = pclhp.ma_lop_hoc_phan
        left join sinhviendb.giang_vien as gv on pclhp.ma_giang_vien = gv.ma_giang_vien
        left join sinhviendb.thoi_khoa_bieu as tkb on tkb.ma_phan_cong_lop_hoc_phan = pclhp.ma_phan_cong
        left join sinhviendb.phong_hoc as ph on tkb.ma_phong_hoc = ph.ma_phong_hoc
        where lhp.ma_lop_hoc_phan = '${ma}'
        group by pclhp.ma_phan_cong,lhp.trang_thai,pclhp.so_luong_sv_phu_trach,pclhp.loai_hoc_phan_phu_trach,
        tkb.ngay_hoc_trong_tuan,tkb.tiet_hoc_bat_dau,tkb.tiet_hoc_ket_thuc,ph.ten_day_nha,ph.ten_phong_hoc,
        gv.ten_giang_vien,tkb.thoi_gian_bat_dau,tkb.thoi_gian_ket_thuc`,
        { type: QueryTypes.SELECT }
      )
      .then(function (results) {
        if (results[0].ma_phan_cong == null)
          return res.status(201).json({ success: true });
        return res.status(201).json({ success: true, results });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
//   try {
//     //Mã phân công lớp học phần
//     const { ma, ma_hoc_ki, trang_thai_dang_ki, so_tien, mien_giam } = req.body;
//     const foundPCLopHocPhan = await PhanCongLopHocPhan.findOne({
//       where: { ma_phan_cong: `${ma}` },
//     });
//     if (!foundPCLopHocPhan) {
//       return res
//         .status(403)
//         .json({ error: { message: "Không tìm thấy phân công lớp học phần" } });
//     }
//     const foundLopHocPhan = await LopHocPhan.findOne({
//       where: { ma_lop_hoc_phan: `${foundPCLopHocPhan.ma_lop_hoc_phan}` },
//     });
//     if (!foundLopHocPhan) {
//       return res
//         .status(403)
//         .json({ error: { message: "Không tìm thấy lớp học phần" } });
//     }
//     if (ma_hoc_ki != foundLopHocPhan.ma_hoc_ki) {
//       return res.status(403).json({
//         error: {
//           message:
//             "Học kì trong lớp học phần và học kì đang chọn không trùng nhau",
//         },
//       });
//     }
//     const ThoiKhoabieu = await sequelize.query(
//       `select tkb.*
//                                             from sinhviendb.lop_hoc_phan as lhp
//                                             left join sinhviendb.phan_cong_lop_hoc_phan as pclhp on lhp.ma_lop_hoc_phan = pclhp.ma_lop_hoc_phan
//                                             left join sinhviendb.thoi_khoa_bieu as tkb on tkb.ma_phan_cong_lop_hoc_phan = pclhp.ma_phan_cong
//                                             where tkb.ma_phan_cong_lop_hoc_phan = '${ma}'`,
//       { type: QueryTypes.SELECT }
//     );

//     if (!ThoiKhoabieu) {
//       return res
//         .status(403)
//         .json({ error: { message: "Không tìm thấy thời khoá biểu " } });
//     }
//     const foundSinhVien = await SinhVien.findOne({
//       where: { ma_sinh_vien: req.payload.userId },
//     });
//     if (!foundSinhVien) {
//       return res
//         .status(403)
//         .json({ error: { message: "Không tìm thấy sinh viên" } });
//     }
//     if (
//       foundLopHocPhan.so_luong_dang_ki_toi_da ===
//       foundLopHocPhan.so_luong_dang_ki_hien_tai
//     ) {
//       return res
//         .status(403)
//         .json({ error: { message: "Lớp đã đủ số lượng sinh viên đăng kí " } });
//     }
//     const ma_tkb_sv = await ThoiKhoaBieuSinhVien.max("ma");
//     let createTKBSinhVien = await ThoiKhoaBieuSinhVien.findOne({
//       where: {
//         [Op.and]: [
//           { ma_sinh_vien: foundSinhVien.ma_sinh_vien },
//           { ma_thoi_khoa_bieu: ThoiKhoabieu[0].ma_thoi_khoa_bieu },
//         ],
//       },
//     });
//     if (!createTKBSinhVien)
//       createTKBSinhVien = await ThoiKhoaBieuSinhVien.create({
//         ma: ma_tkb_sv + 1,
//         loai_ngay_hoc: "Thứ",
//         ma_sinh_vien: foundSinhVien.ma_sinh_vien,
//         ma_thoi_khoa_bieu: ThoiKhoabieu[0].ma_thoi_khoa_bieu,
//         ghi_chu: "....",
//       });
//     const ma_hoc_phi = await HocPhi.max("ma_hoc_phi");
//     // let createHocPhi = await HocPhi.findOne({
//     //   where: { ma_lop_hoc_phan: foundLopHocPhan.ma_lop_hoc_phan },
//     // });
//     // if (!createHocPhi) {
//     //   createHocPhi = await HocPhi.create({
//     //     ma_hoc_phi: ma_hoc_phi + 1,
//     //     noi_dung_thu: "Tiền học phí",
//     //     trang_thai_dang_ki: trang_thai_dang_ki,
//     //     so_tien: so_tien,
//     //     mien_giam: mien_giam,
//     //     so_tien_da_nop: 0,
//     //     cong_no: so_tien,
//     //     trang_thai: 1,
//     //     ma_lop_hoc_phan: foundLopHocPhan.ma_lop_hoc_phan,
//     //     ma_phieu_thu: null,
//     //   });
//     // } else {
//     //   console.log('Ko tạo được học phí')
//     // }
//     let createHocPhi = await HocPhi.create({
//       ma_hoc_phi: ma_hoc_phi + 1,
//       noi_dung_thu: "Tiền học phí",
//       trang_thai_dang_ki: trang_thai_dang_ki,
//       so_tien: so_tien,
//       mien_giam: mien_giam,
//       so_tien_da_nop: 0,
//       cong_no: so_tien,
//       trang_thai: 1,
//       ma_lop_hoc_phan: foundLopHocPhan.ma_lop_hoc_phan,
//       ma_phieu_thu: null,
//     });
//     const updateSVHT = await LopHocPhan.update(
//       {
//         so_luong_dang_ki_hien_tai: `${foundLopHocPhan.so_luong_dang_ki_hien_tai + 1
//           }`,
//       },
//       { where: { ma_lop_hoc_phan: `${foundLopHocPhan.ma_lop_hoc_phan}` } }
//     );
//     const ma_hoc_phi_sinh_vien = await HocPhiSinhVien.max(
//       "ma_hoc_phi_sinh_vien"
//     );
//     let createHocPhiSinhVien = await HocPhiSinhVien.findOne({
//       where: { ma_hoc_phi: ma_hoc_phi + 1 },
//     });
//     if (!createHocPhiSinhVien) {
//       createHocPhiSinhVien = await HocPhiSinhVien.create({
//         ma_hoc_phi_sinh_vien: ma_hoc_phi_sinh_vien + 1,
//         ma_hoc_phi: ma_hoc_phi + 1,
//         ma_sinh_vien: foundSinhVien.ma_sinh_vien,
//       });
//     }
//     const ma_bang_diem = await KetQuaHocTap.max("ma_ket_qua_hoc_tap");
//     let createBangDiem = await KetQuaHocTap.findOne({
//       where: {
//         [Op.and]: [
//           { ma_sinh_vien: foundSinhVien.ma_sinh_vien },
//           { ma_lop_hoc_phan: foundLopHocPhan.ma_lop_hoc_phan },
//         ],
//       },
//     });
//     if (!createBangDiem) {
//       createBangDiem = await KetQuaHocTap.create({
//         ma_ket_qua_hoc_tap: ma_bang_diem + 1,
//         diem_tk_1: null,
//         diem_tk_2: null,
//         diem_tk_3: null,
//         diem_tk_4: null,
//         diem_tk_5: null,
//         diem_th_1: null,
//         diem_th_2: null,
//         diem_th_3: null,
//         diem_th_4: null,
//         diem_th_5: null,
//         diem_gk: null,
//         diem_ck: null,
//         diem_tk_hs_4: null,
//         diem_tk_hs_10: null,
//         diem_chu: null,
//         xep_loai: null,
//         ghi_chu: null,
//         ma_sinh_vien: foundSinhVien.ma_sinh_vien,
//         ma_lop_hoc_phan: foundLopHocPhan.ma_lop_hoc_phan,
//         tinh_trang_hoc_tap: null,
//         ngay_dang_ki: new Date(),
//       });
//     }
//     res.status(201).json({
//       success: true,
//       createTKBSinhVien,
//       createHocPhi,
//       updateSVHT,
//       createHocPhiSinhVien,
//       createBangDiem,
//     });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };

const DangKiHocPhan = async (req, res, next) => {
  try {
    //Mã phân công lớp học phần
    const { ma, ma_hoc_ki, trang_thai_dang_ki, so_tien, mien_giam } = req.body;
    const ma_sinh_vien = req.payload.userId;
    const foundPCLopHocPhan = await PhanCongLopHocPhan.findOne({
      where: { ma_phan_cong: `${ma}` },
    });
    if (!foundPCLopHocPhan) {
      return res
        .status(403)
        .json({ error: { message: "Không tìm thấy phân công lớp học phần" } });
    }
    const foundLopHocPhan = await LopHocPhan.findOne({
      where: { ma_lop_hoc_phan: `${foundPCLopHocPhan.ma_lop_hoc_phan}` },
    });
    if (!foundLopHocPhan) {
      return res
        .status(403)
        .json({ error: { message: "Không tìm thấy lớp học phần" } });
    }
    if (ma_hoc_ki != foundLopHocPhan.ma_hoc_ki) {
      return res.status(403).json({
        error: {
          message:
            "Học kì trong lớp học phần và học kì đang chọn không trùng nhau",
        },
      });
    }
    const ThoiKhoabieu = await sequelize.query(
      `select tkb.* 
                                            from sinhviendb.lop_hoc_phan as lhp
                                            left join sinhviendb.phan_cong_lop_hoc_phan as pclhp on lhp.ma_lop_hoc_phan = pclhp.ma_lop_hoc_phan
                                            left join sinhviendb.thoi_khoa_bieu as tkb on tkb.ma_phan_cong_lop_hoc_phan = pclhp.ma_phan_cong
                                            where tkb.ma_phan_cong_lop_hoc_phan = '${ma}'`,
      { type: QueryTypes.SELECT }
    );

    if (!ThoiKhoabieu) {
      return res
        .status(403)
        .json({ error: { message: "Không tìm thấy thời khoá biểu " } });
    }
    const foundSinhVien = await SinhVien.findOne({
      where: { ma_sinh_vien: req.payload.userId },
    });
    if (!foundSinhVien) {
      return res
        .status(403)
        .json({ error: { message: "Không tìm thấy sinh viên" } });
    }
    if (
      foundLopHocPhan.so_luong_dang_ki_toi_da ===
      foundLopHocPhan.so_luong_dang_ki_hien_tai
    ) {
      return res
        .status(403)
        .json({ error: { message: "Lớp đã đủ số lượng sinh viên đăng kí " } });
    }
    const ma_tkb_sv = await ThoiKhoaBieuSinhVien.max("ma");
    let createTKBSinhVien = await ThoiKhoaBieuSinhVien.findOne({
      where: {
        [Op.and]: [
          { ma_sinh_vien: foundSinhVien.ma_sinh_vien },
          { ma_thoi_khoa_bieu: ThoiKhoabieu[0].ma_thoi_khoa_bieu },
        ],
      },
    });
    if (!createTKBSinhVien)
      createTKBSinhVien = await ThoiKhoaBieuSinhVien.create({
        ma: ma_tkb_sv + 1,
        loai_ngay_hoc: "Thứ",
        ma_sinh_vien: foundSinhVien.ma_sinh_vien,
        ma_thoi_khoa_bieu: ThoiKhoabieu[0].ma_thoi_khoa_bieu,
        ghi_chu: "....",
      });
    const ma_hoc_phi = await HocPhi.max("ma_hoc_phi");
    let createHocPhi = await sequelize.query(
      `SELECT hp.* FROM sinhviendb.hoc_phi as hp
    left join hoc_phi_sinh_vien as hpsv  on hpsv.ma_hoc_phi = hp.ma_hoc_phi
    left join sinh_vien as sv on hpsv.ma_sinh_vien =sv.ma_sinh_vien
    where sv.ma_sinh_vien = ${ma_sinh_vien} and hp.ma_lop_hoc_phan =${foundPCLopHocPhan.ma_lop_hoc_phan}`,
      { type: QueryTypes.SELECT }
    );
    if (createHocPhi[0] == null) {
      createHocPhi = await HocPhi.create({
        ma_hoc_phi: ma_hoc_phi + 1,
        noi_dung_thu: "Tiền học phí",
        trang_thai_dang_ki: trang_thai_dang_ki,
        so_tien: so_tien,
        mien_giam: mien_giam,
        so_tien_da_nop: 0,
        cong_no: so_tien,
        trang_thai: 1,
        ma_lop_hoc_phan: foundLopHocPhan.ma_lop_hoc_phan,
        ma_phieu_thu: null,
      });
    } else {
      console.log("ko tao dc hoc phi");
    }
    console.log(createHocPhi);
    const updateSVHT = await LopHocPhan.update(
      {
        so_luong_dang_ki_hien_tai: `${
          foundLopHocPhan.so_luong_dang_ki_hien_tai + 1
        }`,
      },
      { where: { ma_lop_hoc_phan: `${foundLopHocPhan.ma_lop_hoc_phan}` } }
    );
    const ma_hoc_phi_sinh_vien = await HocPhiSinhVien.max(
      "ma_hoc_phi_sinh_vien"
    );
    let createHocPhiSinhVien = await HocPhiSinhVien.findOne({
      where: { ma_hoc_phi: ma_hoc_phi + 1 },
    });

    // if (!createHocPhiSinhVien) {
    //   createHocPhiSinhVien = await HocPhiSinhVien.create({
    //     ma_hoc_phi_sinh_vien: ma_hoc_phi_sinh_vien + 1,
    //     ma_hoc_phi: ma_hoc_phi + 1,
    //     ma_sinh_vien: foundSinhVien.ma_sinh_vien,
    //   });
    // }
    const ma_hoc_phi_equal = !createHocPhi
      ? createHocPhi.ma_hoc_phi
      : ma_hoc_phi + 1;

    if (!createHocPhiSinhVien) {
      createHocPhiSinhVien = await HocPhiSinhVien.create({
        ma_hoc_phi_sinh_vien: ma_hoc_phi_sinh_vien + 1,
        ma_hoc_phi: ma_hoc_phi_equal,
        ma_sinh_vien: foundSinhVien.ma_sinh_vien,
      });
    }
    const ma_bang_diem = await KetQuaHocTap.max("ma_ket_qua_hoc_tap");
    let createBangDiem = await KetQuaHocTap.findOne({
      where: {
        [Op.and]: [
          { ma_sinh_vien: foundSinhVien.ma_sinh_vien },
          { ma_lop_hoc_phan: foundLopHocPhan.ma_lop_hoc_phan },
        ],
      },
    });
    if (!createBangDiem) {
      createBangDiem = await KetQuaHocTap.create({
        ma_ket_qua_hoc_tap: ma_bang_diem + 1,
        diem_tk_1: null,
        diem_tk_2: null,
        diem_tk_3: null,
        diem_tk_4: null,
        diem_tk_5: null,
        diem_th_1: null,
        diem_th_2: null,
        diem_th_3: null,
        diem_th_4: null,
        diem_th_5: null,
        diem_gk: null,
        diem_ck: null,
        diem_tk_hs_4: null,
        diem_tk_hs_10: null,
        diem_chu: null,
        xep_loai: null,
        ghi_chu: null,
        ma_sinh_vien: foundSinhVien.ma_sinh_vien,
        ma_lop_hoc_phan: foundLopHocPhan.ma_lop_hoc_phan,
        tinh_trang_hoc_tap: null,
        ngay_dang_ki: new Date(),
      });
    }
    if (
      createHocPhi &&
      createHocPhi &&
      updateSVHT &&
      createHocPhiSinhVien &&
      createBangDiem
    ) {
      return res.status(201).json({
        success: true,
        createTKBSinhVien,
        createHocPhi,
        updateSVHT,
        createHocPhiSinhVien,
        createBangDiem,
      });
    } else {
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getThongTinSinhvien = async (req, res, next) => {
  try {
    const foundSinhVien = await SinhVien.findOne({
      where: { ma_sinh_vien: req.payload.userId },
    });
    if (!foundSinhVien) {
      return res
        .status(403)
        .json({ error: { message: "Không tìm thấy sinh viên" } });
    }
    const infor = await sequelize.query(
      `select sv.ma_sinh_vien,sv.ho_ten_sinh_vien, cn.ten_chuyen_nganh, sv.gioitinh, sv.ngay_sinh,
      sv.ma_chuyen_nganh,sv.nien_khoa,sv.ho_khau_thuong_tru,kh.ten_khoa_hoc,ttht.ten_trang_thai_hoc_tap,mhdt.ten_mo_hinh_dao_tao
      from sinhviendb.sinh_vien as sv
      left join sinhviendb.trang_thai_hoc_tap as ttht on sv.ma_trang_thai = ttht.ma_trang_thai_hoc_tap
      left join sinhviendb.chuyen_nganh as cn on sv.ma_chuyen_nganh = cn.ma_chuyen_nganh
      left join sinhviendb.mo_hinh_dao_tao as mhdt on sv.ma_mo_hinh_dao_tao = mhdt.ma_mo_hinh_dao_tao
      left join sinhviendb.khoa_hoc as kh on sv.ma_khoa_hoc = kh.ma_khoa_hoc
      left join sinhviendb.bacdaotao as bdt on sv.ma_bac_dao_tao =bdt.ma_bac_dao_tao
      where sv.ma_sinh_vien = '${req.payload.userId}'`,
      { type: QueryTypes.SELECT }
    );
    res.status(201).json({ success: true, infor });
  } catch (error) {
    next(error);
  }
};
const getDanhSachHocPhi = async (req, res, next) => {
  try {
    const foundSinhVien = await SinhVien.findOne({
      where: { ma_sinh_vien: req.payload.userId },
    });
    if (!foundSinhVien) {
      return res
        .status(403)
        .json({ error: { message: "Không tìm thấy sinh viên" } });
    }
    const dsHocPhiSinhVien = await sequelize.query(
      `select hp.*,mh.ten_mon_hoc,hpp.ma_hoc_phan
                    from sinhviendb.sinh_vien as sv
                    left join sinhviendb.hoc_phi_sinh_vien as hpsv on sv.ma_sinh_vien = hpsv.ma_sinh_vien
                    left join sinhviendb.hoc_phi as hp on hp.ma_hoc_phi = hpsv.ma_hoc_phi
                    left join sinhviendb.lop_hoc_phan as lhp on hp.ma_lop_hoc_phan = lhp.ma_lop_hoc_phan
                    left join sinhviendb.hoc_phan as hpp on lhp.ma_hoc_phan = hpp.ma_hoc_phan
                    left join sinhviendb.mon_hoc as mh on hpp.ma_mon_hoc = mh.ma_mon_hoc
                    where sv.ma_sinh_vien = '${req.payload.userId}'`,
      { type: QueryTypes.SELECT }
    );
    res.status(201).json({ success: true, dsHocPhiSinhVien });
  } catch (error) {
    next(error);
  }
};
const getMonDaDangKiTrongHocKi = async (req, res, next) => {
  try {
    const { ma } = req.body;
    const foundSinhVien = await SinhVien.findOne({
      where: { ma_sinh_vien: req.payload.userId },
    });
    if (!foundSinhVien) {
      return res
        .status(403)
        .json({ error: { message: "Không tìm thấy sinh viên" } });
    }
    const dsMonDaDangKiTrongHocKi = await sequelize.query(
      `select lhp.ma_hoc_phan,mh.ten_mon_hoc,lhp.ten_lop_hoc_phan,hpp.so_tin_chi_ly_thuyet,hpp.so_tin_chi_thuc_hanh,pclhp.nhom_thuc_hanh_phu_trach,hp.so_tien,hp.trang_thai,hp.trang_thai_dang_ki,lhp.trang_thai
   ,hp.trang_thai AS trangthaiHocPhi 
      from sinhviendb.sinh_vien as sv
    left join sinhviendb.hoc_phi_sinh_vien as hpsv on sv.ma_sinh_vien = hpsv.ma_sinh_vien
    left join sinhviendb.hoc_phi as hp on hp.ma_hoc_phi = hpsv.ma_hoc_phi
    left join sinhviendb.lop_hoc_phan as lhp on hp.ma_lop_hoc_phan = lhp.ma_lop_hoc_phan
    left join sinhviendb.phan_cong_lop_hoc_phan as pclhp on pclhp.ma_lop_hoc_phan = lhp.ma_lop_hoc_phan
    left join sinhviendb.hoc_phan as hpp on hpp.ma_hoc_phan = lhp.ma_hoc_phan
    left join sinhviendb.hoc_ki as hk on lhp.ma_hoc_ki = hk.ma_hoc_ki
    left join sinhviendb.mon_hoc as mh on mh.ma_mon_hoc = hpp.ma_mon_hoc
    left join sinhviendb.thoi_khoa_bieu as tkb on tkb.ma_phan_cong_lop_hoc_phan = pclhp.ma_phan_cong
    left join sinhviendb.thoi_khoa_bieu_sinh_vien as tkbsv on tkbsv.ma_thoi_khoa_bieu = tkb.ma_thoi_khoa_bieu
    where sv.ma_sinh_vien = '${req.payload.userId}' and hk.ma_hoc_ki = '${ma}' and pclhp.nhom_thuc_hanh_phu_trach =0
    group by pclhp.ma_phan_cong,mh.ten_mon_hoc,lhp.ten_lop_hoc_phan,
     hpp.so_tin_chi_ly_thuyet,hpp.so_tin_chi_thuc_hanh,
    pclhp.nhom_thuc_hanh_phu_trach,hp.so_tien,hp.trang_thai,
    hp.trang_thai_dang_ki,lhp.trang_thai `,
      { type: QueryTypes.SELECT }
    );
    res.status(201).json({ success: true, dsMonDaDangKiTrongHocKi });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const getThoiKhoaBieuSinhVienTrongMotTuan = async (req, res, next) => {
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
      where tkb.thoi_gian_bat_dau <= '${day.date}' and tkb.thoi_gian_ket_thuc >= '${day.date}' and tkb.ngay_hoc_trong_tuan ='${dayOfWeeek}' and sv.ma_sinh_vien ='${req.payload.userId}'; `,
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
const getChiTietHocPhanDaDangKi = async (req, res, next) => {
  try {
    const { ma } = req.body;
    const dsMonDaDangKiTrongHocKi = await sequelize.query(
      `select lhp.ma_hoc_phan,mh.ten_mon_hoc,lhp.ten_lop_hoc_phan,hpp.so_tin_chi_ly_thuyet,hpp.so_tin_chi_thuc_hanh,pclhp.nhom_thuc_hanh_phu_trach,hp.so_tien,hp.trang_thai,hp.trang_thai_dang_ki,lhp.trang_thai
    from sinhviendb.sinh_vien as sv
    left join sinhviendb.hoc_phi_sinh_vien as hpsv on sv.ma_sinh_vien = hpsv.ma_sinh_vien
    left join sinhviendb.hoc_phi as hp on hp.ma_hoc_phi = hpsv.ma_hoc_phi
    left join sinhviendb.phan_cong_lop_hoc_phan as pclhp on pclhp.ma_lop_hoc_phan = hp.ma_phan_cong_lop_hoc_phan
    left join sinhviendb.lop_hoc_phan as lhp on pclhp.ma_lop_hoc_phan = lhp.ma_lop_hoc_phan
    left join sinhviendb.hoc_phan as hpp on hpp.ma_hoc_phan = lhp.ma_hoc_phan
    left join sinhviendb.hoc_ki as hk on lhp.ma_hoc_ki = hk.ma_hoc_ki
    left join sinhviendb.mon_hoc as mh on mh.ma_mon_hoc = hpp.ma_mon_hoc
    left join sinhviendb.thoi_khoa_bieu as tkb on tkb.ma_phan_cong_lop_hoc_phan = pclhp.ma_phan_cong
    left join sinhviendb.thoi_khoa_bieu_sinh_vien as tkbsv on tkbsv.ma_thoi_khoa_bieu = tkb.ma_thoi_khoa_bieu
    where lhp.ma_lop_hoc_phan = '${ma}'
    group by pclhp.ma_phan_cong,mh.ten_mon_hoc,lhp.ten_lop_hoc_phan,
     hpp.so_tin_chi_ly_thuyet,hpp.so_tin_chi_thuc_hanh,
    pclhp.nhom_thuc_hanh_phu_trach,hp.so_tien,hp.trang_thai,
    hp.trang_thai_dang_ki,lhp.trang_thai `,
      { type: QueryTypes.SELECT }
    );
    res.status(201).json({ success: true, dsMonDaDangKiTrongHocKi });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const HuyHocPhanDaDangKi = async (req, res, next) => {
  try {
    //Mã học phần
    const { ma } = req.body;
    const ma_sinh_vien = req.payload.userId;
    const foundPCLopHocPhan = await HocPhan.findOne({
      where: { ma_hoc_phan: `${ma}` },
    });
    if (!foundPCLopHocPhan) {
      return res
        .status(403)
        .json({ error: { message: "Không tìm thấy  học phần" } });
    }
    const foundSinhVien = await SinhVien.findOne({
      where: { ma_sinh_vien: `${ma_sinh_vien}` },
    });
    if (!foundSinhVien) {
      return responseHanlder.unauthorize(res, {
        err: "Sinh viên chưa đăng nhập",
      });
    }
    const HuyDangKiHocPhan = await sequelize.query(
      `DELETE tkbsv,hpsv,kqht,hp
    from sinhviendb.sinh_vien as sv
    left join sinhviendb.hoc_phi_sinh_vien as hpsv on sv.ma_sinh_vien = hpsv.ma_sinh_vien
    left join sinhviendb.hoc_phi as hp on hp.ma_hoc_phi = hpsv.ma_hoc_phi
    left join sinhviendb.lop_hoc_phan as lhp on hp.ma_lop_hoc_phan = lhp.ma_lop_hoc_phan
    left join sinhviendb.phan_cong_lop_hoc_phan as pclhp on pclhp.ma_lop_hoc_phan = lhp.ma_lop_hoc_phan
    left join sinhviendb.hoc_phan as hpp on hpp.ma_hoc_phan = lhp.ma_hoc_phan
    left join sinhviendb.hoc_ki as hk on lhp.ma_hoc_ki = hk.ma_hoc_ki
    left join sinhviendb.mon_hoc as mh on mh.ma_mon_hoc = hpp.ma_mon_hoc
    left join sinhviendb.thoi_khoa_bieu as tkb on tkb.ma_phan_cong_lop_hoc_phan = pclhp.ma_phan_cong
    left join sinhviendb.thoi_khoa_bieu_sinh_vien as tkbsv on tkbsv.ma_thoi_khoa_bieu = tkb.ma_thoi_khoa_bieu
    left join sinhviendb.ket_qua_hoc_tap as kqht on lhp.ma_lop_hoc_phan = kqht.ma_lop_hoc_phan
    WHERE sv.ma_sinh_vien = ${ma_sinh_vien} and hpp.ma_hoc_phan = ${ma};`,
      { type: QueryTypes.DELETE }
    );
    const updateSLSVLopHocPhan = await sequelize.query();
    responseHanlder.ok(res, { success: true, message: "Đã hủy học phần" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const thanhToanHocPhiTrucTuyen = async (req, res, next) => {
  try {
    // const { ma} = req.payload.userId;
    //   const updateHocPhi = await HocPhi.update({
    //     so_tien_da_nop: `${so_tien}`,
    //   },
    //   { where: { ma_hoc_phi: `${ma_hoc_phi}` } }
    // );
    const foundTienHocPhi = await sequelize.query(
      `select sum(so_tien)-sum(so_tien_da_nop) as tong_tien from hoc_phi as hp
    left join hoc_phi_sinh_vien as hpsv on hp.ma_hoc_phi = hpsv.ma_hoc_phi
    left join sinh_vien as sv on hpsv.ma_sinh_vien = sv.ma_sinh_vien
    where sv.ma_sinh_vien = ${req.payload.userId}`,
      { type: QueryTypes.SELECT }
    );
    console.log(foundTienHocPhi[0].tong_tien);
    const res1 = await momoPayment(
      "Thanh toan cong no " + req.payload.userId,
      foundTienHocPhi[0].tong_tien,
      (data) => {
        console.log(data);
      }
    );
    const data = JSON.parse(res1);
    const payURL = data.payUrl;
    const resultCode = data.resultCode;
    const msg = data.message;
    res.status(200).json({ success: true, payURL, resultCode, msg });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const xacNhanThanhToanTrucTuyen = async (req, res, next) => {
  try {
    // const {resultCode,orderId} = req.body
    const rsl = Number.parseInt(req.query.resultCode);
    const orderId = req.query.orderInfo;
    const ma_sinh_vien = orderId.substring(19);
    if (rsl === 0 && ma_sinh_vien !== "0") {
      const ma_phieu_thu = await PhieuThu.max("ma_phieu_thu");
      const createPhieuThu = await PhieuThu.create({
        ma_phieu_thu: ma_phieu_thu + 1,
        ten_phieu_thu: "Thanh toán công nợ của" + ma_sinh_vien,
        ngay_thu: new Date(),
        ghi_chu: "...",
        don_vi_thu: "MoMo",
      });
      const updateHocPhi = await sequelize.query(
        `update hoc_phi
        join hoc_phi_sinh_vien on hoc_phi.ma_hoc_phi = hoc_phi_sinh_vien.ma_hoc_phi
        join sinh_vien on sinh_vien.ma_sinh_vien = hoc_phi_sinh_vien.ma_sinh_vien
        set hoc_phi.so_tien_da_nop = hoc_phi.so_tien 
        where sinh_vien.ma_sinh_vien =${ma_sinh_vien} and hoc_phi.ma_hoc_phi <> 0 `,
        { type: QueryTypes.UPDATE }
      );
      const updatephieuThuinHocPhi = await sequelize.query(
        `update hoc_phi
        join hoc_phi_sinh_vien on hoc_phi.ma_hoc_phi = hoc_phi_sinh_vien.ma_hoc_phi
        join sinh_vien on sinh_vien.ma_sinh_vien = hoc_phi_sinh_vien.ma_sinh_vien
        set hoc_phi.ma_phieu_thu = ${ma_phieu_thu + 1}
        where sinh_vien.ma_sinh_vien =${ma_sinh_vien} and hoc_phi.ma_hoc_phi <> 0 `,
        { type: QueryTypes.UPDATE }
      );
      const updateCongNo = await sequelize.query(
        `update hoc_phi
        join hoc_phi_sinh_vien on hoc_phi.ma_hoc_phi = hoc_phi_sinh_vien.ma_hoc_phi
        join sinh_vien on sinh_vien.ma_sinh_vien = hoc_phi_sinh_vien.ma_sinh_vien
        set hoc_phi.cong_no = 0
        where sinh_vien.ma_sinh_vien =${ma_sinh_vien} and hoc_phi.ma_hoc_phi <> 0 `,
        { type: QueryTypes.UPDATE }
      );
      const updateTrangThai = await sequelize.query(
        `update hoc_phi
        join hoc_phi_sinh_vien on hoc_phi.ma_hoc_phi = hoc_phi_sinh_vien.ma_hoc_phi
        join sinh_vien on sinh_vien.ma_sinh_vien = hoc_phi_sinh_vien.ma_sinh_vien
        set hoc_phi.trang_thai = 0
        where sinh_vien.ma_sinh_vien =${ma_sinh_vien} and hoc_phi.ma_hoc_phi <> 0 `,
        { type: QueryTypes.UPDATE }
      );

      res
        .status(200)
        .json({ success: true, msg: "Thanh toán thành công " + ma_sinh_vien });
    } else {
      res
        .status(400)
        .json({ success: false, msg: "Thanh toán thất bại " + ma_sinh_vien });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const getPhieuThuCongNo = async (req, res, next) => {
  try {
    const ma_sinh_vien = req.payload.userId;
    const findPhieuThu = sequelize.query(
      `select pt.*
    from phieu_thu as pt 
    left join hoc_phi as hp on hp.ma_phieu_thu = pt.ma_phieu_thu
    left join hoc_phi_sinh_vien as hpsv on hpsv.ma_hoc_phi = hp.ma_hoc_phi
    left join sinh_vien as sv on hpsv.ma_sinh_vien = sv.ma_sinh_vien
    where sv.ma_sinh_vien = ${ma_sinh_vien}`,
      { type: QueryTypes.SELECT }
    );
    res.status(200).json({ success: true, findPhieuThu });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const getChiTietPhieuThu = async (req, res, next) => {
  try {
    const { ma } = req.body;
    const findChiTietPhieuThu = sequelize.query(
      `select pt.*
    from phieu_thu as pt 
    left join hoc_phi as hp on hp.ma_phieu_thu = pt.ma_phieu_thu
    left join hoc_phi_sinh_vien as hpsv on hpsv.ma_hoc_phi = hp.ma_hoc_phi
    left join sinh_vien as sv on hpsv.ma_sinh_vien = sv.ma_sinh_vien
    where sv.ma_sinh_vien = ${ma_sinh_vien}`,
      { type: QueryTypes.SELECT }
    );
    res.status(200).json({ success: true, findPhieuThu });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const getChiTietPhieuThuTongHop = async (req, res, next) => {
  try {
    const { ma, ma_phieu_thu } = req.body;
    const getThongTinCoBanSinhVien = await sequelize.query(
      `select sv.ho_ten_sinh_vien,sv.ma_sinh_vien,sv.nien_khoa ,bdt.ten_bac_dao_tao,pt.don_vi_thu
    from sinhviendb.sinh_vien as sv
    left join sinhviendb.bacdaotao as bdt on sv.ma_bac_dao_tao = bdt.ma_bac_dao_tao
    left join sinhviendb.hoc_phi_sinh_vien as hpsv on hpsv.ma_sinh_vien = sv.ma_sinh_vien
    left join sinhviendb.hoc_phi as hp on hp.ma_hoc_phi = hpsv.ma_hoc_phi
    left join sinhviendb.phieu_thu as pt on pt.ma_phieu_thu = hp.ma_phieu_thu
    where sv.ma_sinh_vien = ${ma} and pt.ma_phieu_thu = ${ma_phieu_thu}
    group by sv.ho_ten_sinh_vien,sv.ma_sinh_vien,sv.nien_khoa ,bdt.ten_bac_dao_tao,pt.don_vi_thu`,
      { type: QueryTypes.SELECT }
    );

    const getChiTietPhieuThu = await sequelize.query(
      `select hp.ma_hoc_phi,mh.ten_mon_hoc,hk.thu_tu_hoc_ki,hk.nam_hoc_bat_dau,hk.nam_hoc_ket_thuc,hp.so_tien
    from sinhviendb.sinh_vien as sv
    left join sinhviendb.bacdaotao as bdt on sv.ma_bac_dao_tao = bdt.ma_bac_dao_tao
    left join sinhviendb.hoc_phi_sinh_vien as hpsv on hpsv.ma_sinh_vien = sv.ma_sinh_vien
    left join sinhviendb.hoc_phi as hp on hp.ma_hoc_phi = hpsv.ma_hoc_phi
    left join sinhviendb.phieu_thu as pt on pt.ma_phieu_thu = hp.ma_phieu_thu
    left join sinhviendb.lop_hoc_phan as lhp on hp.ma_lop_hoc_phan = lhp.ma_lop_hoc_phan
    left join sinhviendb.hoc_phan as hpp on hpp.ma_hoc_phan = lhp.ma_hoc_phan
    left join sinhviendb.mon_hoc as mh on hpp.ma_mon_hoc = mh.ma_mon_hoc
    left join sinhviendb.hoc_ki as hk on hk.ma_hoc_ki = lhp.ma_hoc_ki
    where sv.ma_sinh_vien = ${ma} and pt.ma_phieu_thu = ${ma_phieu_thu}
    group by hp.ma_hoc_phi,mh.ten_mon_hoc,hk.thu_tu_hoc_ki,hk.nam_hoc_bat_dau,hk.nam_hoc_ket_thuc,hp.so_tien`,
      { type: QueryTypes.SELECT }
    );
    responseHanlder.ok(res, {
      success: true,
      getThongTinCoBanSinhVien,
      getChiTietPhieuThu,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getDanhSachPhieuThuSinhVien = async (req, res, next) => {
  try {
    const ma = req.payload.userId;
    const foundSinhVien = await SinhVien.findOne({
      where: { ma_sinh_vien: ma },
    });
    if (!foundSinhVien) {
      return res
        .status(403)
        .json({ error: { message: "Không tìm thấy sinh viên" } });
    }
    const dsHocPhiSinhVien = await sequelize.query(
      `select pt.* , sum(hp.so_tien_da_nop) as tong_tien
        from phieu_thu as pt 
        left join hoc_phi as hp on hp.ma_phieu_thu = pt.ma_phieu_thu
        left join hoc_phi_sinh_vien as hpsv on hpsv.ma_hoc_phi = hp.ma_hoc_phi
        left join sinh_vien as sv on hpsv.ma_sinh_vien = sv.ma_sinh_vien
        where sv.ma_sinh_vien = '${ma}'
        group by pt.ma_phieu_thu, hp.so_tien_da_nop`,
      { type: QueryTypes.SELECT }
    );
    res.status(201).json({ success: true, dsHocPhiSinhVien });
  } catch (error) {
    next(error);
  }
};

const getChiTietPhieuThuTongHopBySV = async (req, res, next) => {
  try {
    const ma = req.payload.userId;
    const foundSinhVien = await SinhVien.findOne({
      where: { ma_sinh_vien: `${ma}` },
    });
    if (!foundSinhVien)
      return res
        .status(403)
        .json({ error: { message: "Không tìm thấy sinh viên" } });
    const { ma_phieu_thu } = req.body;

    const getChiTietPhieuThu = await sequelize.query(
      `select hp.ma_hoc_phi,mh.ten_mon_hoc,hk.thu_tu_hoc_ki,hk.nam_hoc_bat_dau,hk.nam_hoc_ket_thuc,hp.so_tien,pt.ngay_thu
    from sinhviendb.sinh_vien as sv
    left join sinhviendb.bacdaotao as bdt on sv.ma_bac_dao_tao = bdt.ma_bac_dao_tao
    left join sinhviendb.hoc_phi_sinh_vien as hpsv on hpsv.ma_sinh_vien = sv.ma_sinh_vien
    left join sinhviendb.hoc_phi as hp on hp.ma_hoc_phi = hpsv.ma_hoc_phi
    left join sinhviendb.phieu_thu as pt on pt.ma_phieu_thu = hp.ma_phieu_thu
    left join sinhviendb.lop_hoc_phan as lhp on hp.ma_lop_hoc_phan = lhp.ma_lop_hoc_phan
    left join sinhviendb.hoc_phan as hpp on hpp.ma_hoc_phan = lhp.ma_hoc_phan
    left join sinhviendb.mon_hoc as mh on hpp.ma_mon_hoc = mh.ma_mon_hoc
    left join sinhviendb.hoc_ki as hk on hk.ma_hoc_ki = lhp.ma_hoc_ki
    where sv.ma_sinh_vien = '${ma}' and pt.ma_phieu_thu = '${ma_phieu_thu}'
    group by hp.ma_hoc_phi,mh.ten_mon_hoc,hk.thu_tu_hoc_ki,hk.nam_hoc_bat_dau,hk.nam_hoc_ket_thuc,hp.so_tien`,
      { type: QueryTypes.SELECT }
    );
    // responseHanlder.ok(res, { success: true, getChiTietPhieuThu })
    res.status(201).json({ success: true, getChiTietPhieuThu });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getKetQuaHocTap = async (req, res, next) => {
  try {
    const ma = req.payload.userId;
    const foundSinhVien = await SinhVien.findOne({
      where: { ma_sinh_vien: `${ma}` },
    });
    if (!foundSinhVien)
      return res
        .status(403)
        .json({ error: { message: "Không tìm thấy sinh viên" } });

    const { ma_hoc_ki } = req.body;

    const getKetQuaHocTap = await sequelize.query(
      `SELECT sinhviendb.hoc_ki.thu_tu_hoc_ki, sinhviendb.hoc_ki.nam_hoc_bat_dau, sinhviendb.hoc_ki.nam_hoc_ket_thuc, sinhviendb.lop_hoc_phan.ma_lop_hoc_phan, sinhviendb.mon_hoc.ten_mon_hoc, sinhviendb.hoc_phan.so_tin_chi_ly_thuyet, 
    sinhviendb.ket_qua_hoc_tap.diem_tk_1, sinhviendb.ket_qua_hoc_tap.diem_tk_2, sinhviendb.ket_qua_hoc_tap.diem_tk_3, sinhviendb.ket_qua_hoc_tap.diem_tk_4, sinhviendb.ket_qua_hoc_tap.diem_tk_5, 
    sinhviendb.ket_qua_hoc_tap.diem_th_1, sinhviendb.ket_qua_hoc_tap.diem_th_2, sinhviendb.ket_qua_hoc_tap.diem_th_3, sinhviendb.ket_qua_hoc_tap.diem_th_4, sinhviendb.ket_qua_hoc_tap.diem_th_5, 
    sinhviendb.ket_qua_hoc_tap.diem_ck, sinhviendb.ket_qua_hoc_tap.diem_gk, sinhviendb.ket_qua_hoc_tap.diem_tk_hs_10, sinhviendb.ket_qua_hoc_tap.diem_tk_hs_4, sinhviendb.ket_qua_hoc_tap.diem_chu, 
    sinhviendb.ket_qua_hoc_tap.xep_loai, sinhviendb.ket_qua_hoc_tap.tinh_trang_hoc_tap,sinhviendb.hoc_phan.so_tin_chi_thuc_hanh
FROM     sinhviendb.hoc_ki INNER JOIN
    sinhviendb.lop_hoc_phan ON sinhviendb.hoc_ki.ma_hoc_ki = sinhviendb.lop_hoc_phan.ma_hoc_ki INNER JOIN
    sinhviendb.hoc_phan ON sinhviendb.lop_hoc_phan.ma_hoc_phan = sinhviendb.hoc_phan.ma_hoc_phan INNER JOIN
    sinhviendb.ket_qua_hoc_tap ON sinhviendb.lop_hoc_phan.ma_lop_hoc_phan = sinhviendb.ket_qua_hoc_tap.ma_lop_hoc_phan INNER JOIN
    sinhviendb.mon_hoc ON sinhviendb.hoc_phan.ma_mon_hoc = sinhviendb.mon_hoc.ma_mon_hoc INNER JOIN
    sinhviendb.sinh_vien ON sinhviendb.ket_qua_hoc_tap.ma_sinh_vien = sinhviendb.sinh_vien.ma_sinh_vien
WHERE sinhviendb.sinh_vien.ma_sinh_vien = '${ma}' and sinhviendb.hoc_ki.ma_hoc_ki = '${ma_hoc_ki}'`,
      { type: QueryTypes.SELECT }
    );
    res.status(201).json({ success: true, getKetQuaHocTap });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getLopHocPhanKhongTrung = async (req, res, next) => {
  try {
    const { ma, ma_hoc_ki } = req.body;
    const ma_sinh_vien = req.payload.userId;
    const foundSinhVien = await SinhVien.findOne({
      where: { ma_sinh_vien: `${ma_sinh_vien}` },
    });
    if (!foundSinhVien)
      return res
        .status(403)
        .json({ error: { message: "Không tìm thấy sinh viên" } });

    let DsHocPhan = await sequelize.query(
      `select mh.ten_mon_hoc,lhp.trang_thai,lhp.ma_lop_hoc_phan,lhp.ten_lop_hoc_phan,lhp.so_luong_dang_ki_hien_tai,lhp.so_luong_dang_ki_toi_da,hk.ma_hoc_ki,tkb.tiet_hoc_bat_dau,tkb.tiet_hoc_ket_thuc,tkb.ngay_hoc_trong_tuan,pclhp.nhom_thuc_hanh_phu_trach
      ,pclhp.ma_phan_cong
      from sinhviendb.hoc_phan as hp
      left join sinhviendb.lop_hoc_phan as lhp on hp.ma_hoc_phan = lhp.ma_hoc_phan
      left join sinhviendb.mon_hoc as mh on hp.ma_mon_hoc = mh.ma_mon_hoc
      left join sinhviendb.hoc_ki as hk on lhp.ma_hoc_ki = hk.ma_hoc_ki
      left join sinhviendb.phan_cong_lop_hoc_phan as pclhp on pclhp.ma_lop_hoc_phan = lhp.ma_lop_hoc_phan
      left join sinhviendb.thoi_khoa_bieu as tkb on tkb.ma_phan_cong_lop_hoc_phan = pclhp.ma_phan_cong
       where hp.ma_hoc_phan = '${ma}' and hk.ma_hoc_ki = '${ma_hoc_ki}'`,
      { type: QueryTypes.SELECT }
    );
    let DsHocPhanDaDky = await sequelize.query(
      `select tkb.tiet_hoc_bat_dau,tkb.tiet_hoc_ket_thuc,tkb.ngay_hoc_trong_tuan
      from sinhviendb.sinh_vien as sv
      left join sinhviendb.hoc_phi_sinh_vien as hpsv on sv.ma_sinh_vien = hpsv.ma_sinh_vien
      left join sinhviendb.hoc_phi as hp on hp.ma_hoc_phi = hpsv.ma_hoc_phi
      left join sinhviendb.lop_hoc_phan as lhp on hp.ma_lop_hoc_phan = lhp.ma_lop_hoc_phan
      left join sinhviendb.phan_cong_lop_hoc_phan as pclhp on pclhp.ma_lop_hoc_phan = lhp.ma_lop_hoc_phan
      left join sinhviendb.hoc_phan as hpp on hpp.ma_hoc_phan = lhp.ma_hoc_phan
      left join sinhviendb.hoc_ki as hk on lhp.ma_hoc_ki = hk.ma_hoc_ki
      left join sinhviendb.mon_hoc as mh on mh.ma_mon_hoc = hpp.ma_mon_hoc
      left join sinhviendb.thoi_khoa_bieu as tkb on tkb.ma_phan_cong_lop_hoc_phan = pclhp.ma_phan_cong
      left join sinhviendb.thoi_khoa_bieu_sinh_vien as tkbsv on tkbsv.ma_thoi_khoa_bieu = tkb.ma_thoi_khoa_bieu
      where sv.ma_sinh_vien = ${ma_sinh_vien} and hk.ma_hoc_ki = ${ma_hoc_ki} 
      group by  tkb.tiet_hoc_bat_dau,tkb.tiet_hoc_ket_thuc,tkb.ngay_hoc_trong_tuan`,
      { type: QueryTypes.SELECT }
    );
    if (Array.isArray(DsHocPhan) && Array.isArray(DsHocPhanDaDky)) {
      DsHocPhan = DsHocPhan.filter((element) => {
        return !DsHocPhanDaDky.some((i) => {
          return (
            (element.ngay_hoc_trong_tuan == i.ngay_hoc_trong_tuan &&
              element.tiet_hoc_bat_dau >= i.tiet_hoc_bat_dau &&
              element.tiet_hoc_ket_thuc <= i.tiet_hoc_ket_thuc) ||
            element.nhom_thuc_hanh_phu_trach != 0
          );
        });
      });
    }
    responseHanlder.ok(res, { success: true, DsHocPhan });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getThongTinSinhVienAndroid = async (req, res, next) => {
  try {
    const ma = req.payload.userId;
    const foundSinhVien = await SinhVien.findOne({
      where: { ma_sinh_vien: `${ma}` },
    });
    if (!foundSinhVien)
      return res
        .status(403)
        .json({ error: { message: "Không tìm thấy sinh viên" } });

    const { ma_hoc_ki } = req.body;

    const getKetQuaHocTap = await sequelize.query(
      `SELECT sinhviendb.hoc_ki.thu_tu_hoc_ki, sinhviendb.hoc_ki.nam_hoc_bat_dau, sinhviendb.hoc_ki.nam_hoc_ket_thuc, sinhviendb.lop_hoc_phan.ma_lop_hoc_phan, sinhviendb.mon_hoc.ten_mon_hoc, sinhviendb.hoc_phan.so_tin_chi_ly_thuyet, 
    sinhviendb.ket_qua_hoc_tap.diem_tk_1, sinhviendb.ket_qua_hoc_tap.diem_tk_2, sinhviendb.ket_qua_hoc_tap.diem_tk_3, sinhviendb.ket_qua_hoc_tap.diem_tk_4, sinhviendb.ket_qua_hoc_tap.diem_tk_5, 
    sinhviendb.ket_qua_hoc_tap.diem_th_1, sinhviendb.ket_qua_hoc_tap.diem_th_2, sinhviendb.ket_qua_hoc_tap.diem_th_3, sinhviendb.ket_qua_hoc_tap.diem_th_4, sinhviendb.ket_qua_hoc_tap.diem_th_5, 
    sinhviendb.ket_qua_hoc_tap.diem_ck, sinhviendb.ket_qua_hoc_tap.diem_gk, sinhviendb.ket_qua_hoc_tap.diem_tk_hs_10, sinhviendb.ket_qua_hoc_tap.diem_tk_hs_4, sinhviendb.ket_qua_hoc_tap.diem_chu, 
    sinhviendb.ket_qua_hoc_tap.xep_loai, sinhviendb.ket_qua_hoc_tap.tinh_trang_hoc_tap,sinhviendb.hoc_phan.so_tin_chi_thuc_hanh
FROM     sinhviendb.hoc_ki INNER JOIN
    sinhviendb.lop_hoc_phan ON sinhviendb.hoc_ki.ma_hoc_ki = sinhviendb.lop_hoc_phan.ma_hoc_ki INNER JOIN
    sinhviendb.hoc_phan ON sinhviendb.lop_hoc_phan.ma_hoc_phan = sinhviendb.hoc_phan.ma_hoc_phan INNER JOIN
    sinhviendb.ket_qua_hoc_tap ON sinhviendb.lop_hoc_phan.ma_lop_hoc_phan = sinhviendb.ket_qua_hoc_tap.ma_lop_hoc_phan INNER JOIN
    sinhviendb.mon_hoc ON sinhviendb.hoc_phan.ma_mon_hoc = sinhviendb.mon_hoc.ma_mon_hoc INNER JOIN
    sinhviendb.sinh_vien ON sinhviendb.ket_qua_hoc_tap.ma_sinh_vien = sinhviendb.sinh_vien.ma_sinh_vien
WHERE sinhviendb.sinh_vien.ma_sinh_vien = '${ma}' and sinhviendb.hoc_ki.ma_hoc_ki = '${ma_hoc_ki}'`,
      { type: QueryTypes.SELECT }
    );
    res.status(201).json({ success: true, getKetQuaHocTap });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  getHocKiSinhVien,
  getMonHocSinhVienChuaHoc,
  getLopHocPhanByHocPhan,
  getChiTietLopHocPhan,
  DangKiHocPhan,
  getThongTinSinhvien,
  getDanhSachHocPhi,
  getMonDaDangKiTrongHocKi,
  getThoiKhoaBieuSinhVienTrongMotTuan,
  thanhToanHocPhiTrucTuyen,
  xacNhanThanhToanTrucTuyen,
  getChiTietPhieuThuTongHop,
  getDanhSachPhieuThuSinhVien,
  getChiTietPhieuThuTongHopBySV,
  getKetQuaHocTap,
  getLopHocPhanKhongTrung,
};
