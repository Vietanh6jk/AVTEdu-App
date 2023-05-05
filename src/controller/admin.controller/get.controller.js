
const bcrypt = require("bcryptjs");
const { QueryTypes } = require("sequelize");
const { ConnectDB } = require("../../config/mysql.config");
const Admin = require("../../models/admin.model");
const ChuyenNganh = require("../../models/chuyennganh.models");
const ChuyenNganhHocPhan = require("../../models/chuyennganhhocphan.model");
const GiangVien = require("../../models/giangvien.model");
const HocKi = require("../../models/hocki.model");
const HocPhan = require("../../models/hocphan.model");
const KetQuaHocTap = require("../../models/ketquahoctap.model");
const Khoa = require("../../models/khoa.model");
const KhoaHoc = require("../../models/khoahoc.model");
const LoaiPhongHoc = require("../../models/loaiphonghoc.model");
const LopHocPhan = require("../../models/lophocphan.model");
const MoHinhDaoTao = require("../../models/mohinhdaotao.model");
const MonHoc = require("../../models/monhoc.model");
const PhanCongLopHocPhan = require("../../models/phanconglophocphan.model");
const PhongHoc = require("../../models/phonghoc.model");
const SinhVien = require("../../models/sinhvien.model");
const ThoiKhoaBieu = require("../../models/thoikhoabieu.model");
const ThoiKhoaBieuSinhVien = require("../../models/thoikhoabieusinhvien.model");
const TonGiao = require("../../models/tongiao.model");
const TrangThaiHocTap = require("../../models/trangthaihoctap.model");

const sequelize = ConnectDB().getInstance();

const getDanhSachSinhVien = async (req, res, next) => {
  try {
    const result = await SinhVien.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
const getDanhSachAdmin = async (req, res, next) => {
  try {
    const result = await Admin.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
const getDanhSachBacDaoTao = async (req, res, next) => {
  try {
    const result = await BacDaoTao.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
const getDanhSachChuyenNganh = async (req, res, next) => {
  try {
    const result = await ChuyenNganh.findAll({ limit: 40 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
const getDanhSachChuyenNganhHocPhan = async (req, res, next) => {
  try {
    const result = await ChuyenNganhHocPhan.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
const getDanhSachDanToc = async (req, res, next) => {
  try {
    const result = await DanToc.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
const getDanhSachGiangVien = async (req, res, next) => {
  try {
    const result = await GiangVien.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
const getDanhSachHocKi = async (req, res, next) => {
  try {
    const result = await HocKi.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
const getDanhSachHocPhan = async (req, res, next) => {
  try {
    const result = await HocPhan.findAll({ limit: 20 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
const getDanhSachHocPhi = async (req, res, next) => {
  try {
    const result = await HocPhi.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
// const getDanhSachHocPhiSinhVien = async (req,res,next) =>{
//   try {
//     const result = await HocPhiSinhVien.findAll({limit:10});
//     return res.status(201).json({ success: true, result});
//   } catch (error) {
//     next(error);
//   }
// }
const getDanhSachKetQuaHocTap = async (req, res, next) => {
  try {
    const result = await KetQuaHocTap.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
const getDanhSachKhoa = async (req, res, next) => {
  try {
    const result = await Khoa.findAll({ limit: 20 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
const getDanhSachKhoaHoc = async (req, res, next) => {
  try {
    const result = await KhoaHoc.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
const getDanhSachLoaiPhongHoc = async (req, res, next) => {
  try {
    const result = await LoaiPhongHoc.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
const getDanhSachLopHocPhan = async (req, res, next) => {
  try {
    const result = await LopHocPhan.findAll({ limit: 20 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
const getDanhSachMoHinhDaoTao = async (req, res, next) => {
  try {
    const result = await MoHinhDaoTao.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
const getDanhSachMonHoc = async (req, res, next) => {
  try {
    const result = await MonHoc.findAll({ limit: 20 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
const getDanhSachPhanCongLopHocPhan = async (req, res, next) => {
  try {
    const result = await PhanCongLopHocPhan.findAll({ limit: 20 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
const getDanhSachPhongHoc = async (req, res, next) => {
  try {
    const result = await PhongHoc.findAll({ limit: 20 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
const getDanhSachThoiKhoaBieu = async (req, res, next) => {
  try {
    const result = await ThoiKhoaBieu.findAll({ limit: 30 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
const getDanhSachThoiKhoaBieuSinhVien = async (req, res, next) => {
  try {
    const result = await ThoiKhoaBieuSinhVien.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
const getDanhSachTonGiao = async (req, res, next) => {
  try {
    const result = await TonGiao.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
const getDanhSachTrangThaiHocTap = async (req, res, next) => {
  try {
    const result = await TrangThaiHocTap.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
}
const getDanhSachHocPhiSinhVien = async (req, res, next) => {
  try {
    const { ma } = req.body
    const foundSinhVien = await SinhVien.findOne({
      where: { ma_sinh_vien: ma },
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
                      where sv.ma_sinh_vien = '${ma}'`,
      { type: QueryTypes.SELECT }
    );
    res.status(201).json({ success: true, dsHocPhiSinhVien });
  } catch (error) {
    next(error);
  }
};
const getDanhSachPhieuThuSinhVien = async (req, res, next) => {
  try {
    const { ma } = req.body
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
const getDanhSachHocPhiSinhVienParam = async (req, res, next) => {
  try {
    const ma = req.query.ma
    const foundSinhVien = await SinhVien.findOne({
      where: { ma_sinh_vien: ma },
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
                      where sv.ma_sinh_vien = '${ma}'`,
      { type: QueryTypes.SELECT }
    );
    res.status(201).json({ success: true, dsHocPhiSinhVien });
  } catch (error) {
    next(error);
  }
};
const getDanhSachPhieuThuSinhVienParam = async (req, res, next) => {
  try {
    const ma = req.query.ma
    const foundSinhVien = await SinhVien.findOne({
      where: { ma_sinh_vien: ma },
    });
    if (!foundSinhVien) {
      return res
        .status(403)
        .json({ error: { message: "Không tìm thấy sinh viên" } });
    }
    const dsHocPhiSinhVien = await sequelize.query(
      `select pt.*
        from phieu_thu as pt 
        left join hoc_phi as hp on hp.ma_phieu_thu = pt.ma_phieu_thu
        left join hoc_phi_sinh_vien as hpsv on hpsv.ma_hoc_phi = hp.ma_hoc_phi
        left join sinh_vien as sv on hpsv.ma_sinh_vien = sv.ma_sinh_vien
        where sv.ma_sinh_vien = '${ma}'`,
      { type: QueryTypes.SELECT }
    );
    res.status(201).json({ success: true, dsHocPhiSinhVien });
  } catch (error) {
    next(error);
  }
};
const getDanhSachDiemSinhVienByMaLopHP = async (req, res, next) => {
  try {
    const { maLHP } = req.body
    const foundLop = await LopHocPhan.findOne({
      where: { ma_lop_hoc_phan: maLHP },
    });
    if (!foundLop) {
      return res
        .status(403)
        .json({ error: { message: "Không tìm thấy lớp học phần" } });
    }
    //'${maLHP}'`
    const dssv = await sequelize.query(
      `SELECT sinhviendb.sinh_vien.ma_sinh_vien, sinhviendb.sinh_vien.ho_ten_sinh_vien, sinhviendb.ket_qua_hoc_tap.diem_tk_1, sinhviendb.ket_qua_hoc_tap.diem_tk_2, sinhviendb.ket_qua_hoc_tap.diem_tk_3, sinhviendb.ket_qua_hoc_tap.diem_tk_4, 
      sinhviendb.ket_qua_hoc_tap.diem_tk_5, sinhviendb.ket_qua_hoc_tap.diem_th_1, sinhviendb.ket_qua_hoc_tap.diem_th_2, sinhviendb.ket_qua_hoc_tap.diem_th_3, sinhviendb.ket_qua_hoc_tap.diem_th_4, 
      sinhviendb.ket_qua_hoc_tap.diem_th_5, sinhviendb.ket_qua_hoc_tap.diem_gk, sinhviendb.ket_qua_hoc_tap.diem_ck, sinhviendb.ket_qua_hoc_tap.diem_tk_hs_10, sinhviendb.ket_qua_hoc_tap.ma_ket_qua_hoc_tap,
      sinhviendb.hoc_phan.so_tin_chi_ly_thuyet, sinhviendb.hoc_phan.so_tin_chi_thuc_hanh,sinhviendb.ket_qua_hoc_tap.diem_tk_hs_4
FROM     sinhviendb.chuyen_nganh INNER JOIN
      sinhviendb.chuyen_nganh_hoc_phan ON sinhviendb.chuyen_nganh.ma_chuyen_nganh = sinhviendb.chuyen_nganh_hoc_phan.ma_chuyen_nganh INNER JOIN
      sinhviendb.hoc_phan ON sinhviendb.chuyen_nganh_hoc_phan.ma_hoc_phan = sinhviendb.hoc_phan.ma_hoc_phan INNER JOIN
      sinhviendb.khoa ON sinhviendb.chuyen_nganh.ma_khoa = sinhviendb.khoa.ma_khoa INNER JOIN
      sinhviendb.lop_hoc_phan ON sinhviendb.hoc_phan.ma_hoc_phan = sinhviendb.lop_hoc_phan.ma_hoc_phan INNER JOIN
      sinhviendb.ket_qua_hoc_tap ON sinhviendb.lop_hoc_phan.ma_lop_hoc_phan = sinhviendb.ket_qua_hoc_tap.ma_lop_hoc_phan INNER JOIN
      sinhviendb.hoc_ki ON sinhviendb.lop_hoc_phan.ma_hoc_ki = sinhviendb.hoc_ki.ma_hoc_ki INNER JOIN
      sinhviendb.sinh_vien ON sinhviendb.chuyen_nganh.ma_chuyen_nganh = sinhviendb.sinh_vien.ma_chuyen_nganh AND sinhviendb.khoa.ma_khoa = sinhviendb.sinh_vien.ma_khoa AND 
      sinhviendb.ket_qua_hoc_tap.ma_sinh_vien = sinhviendb.sinh_vien.ma_sinh_vien
where sinhviendb.lop_hoc_phan.ma_lop_hoc_phan = '${maLHP}'`,
      { type: QueryTypes.SELECT }
    );
    res.status(201).json({ success: true, dssv });
  } catch (error) {
    next(error);
  }
};
const getDanhSachSinhVienByKhoa = async (req, res, next) => {

  try {
    const { maKhoa } = req.body;
    const dssv = await sequelize.query(
      `SELECT sinhviendb.chuyen_nganh.ten_chuyen_nganh, sinhviendb.khoa.ten_khoa, sinhviendb.sinh_vien.ma_sinh_vien, sinhviendb.sinh_vien.ho_ten_sinh_vien, sinhviendb.sinh_vien.ngay_sinh, sinhviendb.sinh_vien.email, 
                        sinhviendb.sinh_vien.gioitinh, sinhviendb.sinh_vien.so_dien_thoai, sinhviendb.sinh_vien.so_cmnd, sinhviendb.sinh_vien.nien_khoa, sinhviendb.sinh_vien.mat_khau
      FROM     sinhviendb.chuyen_nganh INNER JOIN
                        sinhviendb.khoa ON sinhviendb.chuyen_nganh.ma_khoa = sinhviendb.khoa.ma_khoa INNER JOIN
                        sinhviendb.sinh_vien ON sinhviendb.chuyen_nganh.ma_chuyen_nganh = sinhviendb.sinh_vien.ma_chuyen_nganh AND sinhviendb.khoa.ma_khoa = sinhviendb.sinh_vien.ma_khoa
                where sinhviendb.khoa.ma_khoa = '${maKhoa}'`,
      { type: QueryTypes.SELECT }
    );
    res.status(201).json({ success: true, dssv });
  } catch (error) {
    next(error);
  }
};

const getDSChuyenNganhTheoKhoa = async (req, res, next) => {

  try {
    const { maKhoa } = req.body;
    const ds = await sequelize.query(
      `select * from sinhviendb.chuyen_nganh where ma_khoa = '${maKhoa}'`,
      { type: QueryTypes.SELECT }
    );
    res.status(201).json({ success: true, ds });
  } catch (error) {
    next(error);
  }
};
const getDSMonTheoKhoa = async (req, res, next) => {

  try {
    const { maKhoa } = req.body;
    const ds = await sequelize.query(
      `select * from sinhviendb.mon_hoc where ma_khoa = '${maKhoa}'`,
      { type: QueryTypes.SELECT }
    );
    res.status(201).json({ success: true, ds });
  } catch (error) {
    next(error);
  }
};

const getDSHocPhanTheoChuyenNganh = async (req, res, next) => {

  try {
    const { maCN } = req.body;
    const ds = await sequelize.query(
      `SELECT sinhviendb.hoc_phan.*
      FROM     sinhviendb.chuyen_nganh INNER JOIN
                        sinhviendb.chuyen_nganh_hoc_phan ON sinhviendb.chuyen_nganh.ma_chuyen_nganh = sinhviendb.chuyen_nganh_hoc_phan.ma_chuyen_nganh INNER JOIN
                        sinhviendb.hoc_phan ON sinhviendb.chuyen_nganh_hoc_phan.ma_hoc_phan = sinhviendb.hoc_phan.ma_hoc_phan
                where sinhviendb.chuyen_nganh.ma_chuyen_nganh ='${maCN}'`,
      { type: QueryTypes.SELECT }
    );
    res.status(201).json({ success: true, ds });
  } catch (error) {
    next(error);
  }
};

const getDSLopTheoHocKi = async (req, res, next) => {

  try {
    const { maHK } = req.body;
    const ds = await sequelize.query(
      `select * from sinhviendb.lop_hoc_phan where sinhviendb.lop_hoc_phan.ma_hoc_ki = '${maHK}'`,
      { type: QueryTypes.SELECT }
    );
    res.status(201).json({ success: true, ds });
  } catch (error) {
    next(error);
  }
};
const getDSLopTheoChuyenNganhHocKi = async (req, res, next) => {

  try {
    const { maHK, maCN } = req.body;
    const ds = await sequelize.query(
      `SELECT sinhviendb.lop_hoc_phan.*
      FROM     sinhviendb.lop_hoc_phan INNER JOIN
                        sinhviendb.hoc_ki ON sinhviendb.lop_hoc_phan.ma_hoc_ki = sinhviendb.hoc_ki.ma_hoc_ki INNER JOIN
                        sinhviendb.hoc_phan ON sinhviendb.lop_hoc_phan.ma_hoc_phan = sinhviendb.hoc_phan.ma_hoc_phan INNER JOIN
                        sinhviendb.chuyen_nganh_hoc_phan ON sinhviendb.hoc_phan.ma_hoc_phan = sinhviendb.chuyen_nganh_hoc_phan.ma_hoc_phan INNER JOIN
                        sinhviendb.chuyen_nganh ON sinhviendb.chuyen_nganh_hoc_phan.ma_chuyen_nganh = sinhviendb.chuyen_nganh.ma_chuyen_nganh
                where sinhviendb.hoc_ki.ma_hoc_ki = '${maHK}' and sinhviendb.chuyen_nganh.ma_chuyen_nganh =  '${maCN}'`,
      { type: QueryTypes.SELECT }
    );
    res.status(201).json({ success: true, ds });
  } catch (error) {
    next(error);
  }
};

const getDSPhanCongTheoMaGiangVien = async (req, res, next) => {

  try {
    const { maGV } = req.body;
    const ds = await sequelize.query(
      `select * from sinhviendb.phan_cong_lop_hoc_phan where ma_giang_vien ='${maGV}'`,
      { type: QueryTypes.SELECT }
    );
    res.status(201).json({ success: true, ds });
  } catch (error) {
    next(error);
  }
};

const getDSPhanCongTheoMaLHP = async (req, res, next) => {

  try {
    const { maLHP } = req.body;
    const ds = await sequelize.query(
      `select * from sinhviendb.phan_cong_lop_hoc_phan where ma_lop_hoc_phan ='${maLHP}'`,
      { type: QueryTypes.SELECT }
    );
    res.status(201).json({ success: true, ds });
  } catch (error) {
    next(error);
  }
};
const getDSTKBTheoMaCNVaHocKi = async (req, res, next) => {

  try {
    const { maHK, maCN } = req.body;
    const ds = await sequelize.query(
      `SELECT sinhviendb.thoi_khoa_bieu.*
      FROM     sinhviendb.chuyen_nganh INNER JOIN
                        sinhviendb.chuyen_nganh_hoc_phan ON sinhviendb.chuyen_nganh.ma_chuyen_nganh = sinhviendb.chuyen_nganh_hoc_phan.ma_chuyen_nganh INNER JOIN
                        sinhviendb.hoc_phan ON sinhviendb.chuyen_nganh_hoc_phan.ma_hoc_phan = sinhviendb.hoc_phan.ma_hoc_phan INNER JOIN
                        sinhviendb.lop_hoc_phan ON sinhviendb.hoc_phan.ma_hoc_phan = sinhviendb.lop_hoc_phan.ma_hoc_phan INNER JOIN
                        sinhviendb.hoc_ki ON sinhviendb.lop_hoc_phan.ma_hoc_ki = sinhviendb.hoc_ki.ma_hoc_ki INNER JOIN
                        sinhviendb.phan_cong_lop_hoc_phan ON sinhviendb.lop_hoc_phan.ma_lop_hoc_phan = sinhviendb.phan_cong_lop_hoc_phan.ma_lop_hoc_phan INNER JOIN
                        sinhviendb.thoi_khoa_bieu ON sinhviendb.phan_cong_lop_hoc_phan.ma_phan_cong = sinhviendb.thoi_khoa_bieu.ma_phan_cong_lop_hoc_phan
               where sinhviendb.hoc_ki.ma_hoc_ki = '${maHK}' and sinhviendb.chuyen_nganh.ma_chuyen_nganh = '${maCN}'`,
      { type: QueryTypes.SELECT }
    );
    res.status(201).json({ success: true, ds });
  } catch (error) {
    next(error);
  }
};

const getDsPhongTheoTen = async (req, res, next) => {

  try {
    const { tenP } = req.body;
    const ds = await sequelize.query(
      `select * from sinhviendb.phong_hoc where ten_phong_hoc =  '${tenP}'`,
      { type: QueryTypes.SELECT }
    );
    res.status(201).json({ success: true, ds });
  } catch (error) {
    next(error);
  }
};

const taoMaSinhVien = async (req, res, next) => {
  const newMaSinhVien = await SinhVien.max("ma_sinh_vien");
  res.status(201).json({ success: true, newMaSinhVien });
};

module.exports = {
  taoMaSinhVien,
  getDanhSachAdmin,
  getDanhSachBacDaoTao,
  getDanhSachChuyenNganh,
  getDanhSachChuyenNganhHocPhan,
  getDanhSachDanToc,
  getDanhSachGiangVien,
  getDanhSachHocKi,
  getDanhSachHocPhan,
  getDanhSachHocPhi,
  getDanhSachHocPhiSinhVien,
  getDanhSachKetQuaHocTap,
  getDanhSachKhoa,
  getDanhSachKhoaHoc,
  getDanhSachLoaiPhongHoc,
  getDanhSachLopHocPhan,
  getDanhSachMoHinhDaoTao,
  getDanhSachMonHoc,
  getDanhSachPhanCongLopHocPhan,
  getDanhSachPhongHoc,
  getDanhSachSinhVien,
  getDanhSachThoiKhoaBieu,
  getDanhSachThoiKhoaBieuSinhVien,
  getDanhSachTonGiao,
  getDanhSachTrangThaiHocTap,
  getDanhSachPhieuThuSinhVien,
  getDanhSachHocPhiSinhVienParam,
  getDanhSachPhieuThuSinhVienParam,
  getDanhSachDiemSinhVienByMaLopHP,
  getDanhSachSinhVienByKhoa,
  getDSChuyenNganhTheoKhoa,
  getDSMonTheoKhoa,
  getDSHocPhanTheoChuyenNganh,
  getDSLopTheoHocKi,
  getDSLopTheoChuyenNganhHocKi,
  getDSPhanCongTheoMaGiangVien,
  getDSPhanCongTheoMaLHP,
  getDSTKBTheoMaCNVaHocKi,
  getDsPhongTheoTen
}

