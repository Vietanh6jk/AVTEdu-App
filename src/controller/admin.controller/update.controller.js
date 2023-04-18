const bcrypt = require("bcryptjs");
const { ConnectDB } = require("../../config/mysql.config");
const { QueryTypes, Model } = require("sequelize");
const responseHandler = require("../../handlers/response.handler");
const Admin = require("../../models/admin.model");
const BacDaoTao = require("../../models/bacdaotao.model");
const ChuyenNganh = require("../../models/chuyennganh.models");
const ChuyenNganhHocPhan = require("../../models/chuyennganhhocphan.model");
const DanToc = require("../../models/dantoc.model");
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
const HocPhi = require("../../models/hocphi.model");
const PhieuThu = require("../../models/phieuthu.model");


const sequelize = ConnectDB().getInstance();

const updateSinhVien = async (req, res, next) => {
  try {
    const { ma, ten, ngay_sinh, email, gioitinh, hktt, sdt, so_cmnd } =
      req.body;
    const result = await SinhVien.update(
      {
        ho_ten_sinh_vien: ten,
        ngay_sinh,
        email,
        gioitinh,
        ho_khau_thuong_tru: hktt,
        so_dien_thoai: sdt,
        so_cmnd,
      },
      {
        where: { ma_sinh_vien: ma },
      }
    );
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
// const getDanhSachAdmin = async (req,res,next) =>{
//   try {
//     const result = await Admin.findAll({limit:10});
//     return res.status(201).json({ success: true, result});
//   } catch (error) {
//     next(error);
//   }
// }
const updateBacDaoTao = async (req, res, next) => {
  try {
    const { ma, ten_bac_dao_tao, mota } = req.body;

    const result = BacDaoTao.update(
      {
        ten_bac_dao_tao: ten_bac_dao_tao,
        mota: mota,
      },
      { where: { ma_bac_dao_tao: ma } }
    );
    return responseHandler.ok(res, { success: true, result });
  } catch (error) {
    return responseHandler.error(res, { success: false, error });
  }
};
const updateChuyenNganh = async (req, res, next) => {
  try {
    const { ma, ten, ma_khoa, so_tin_chi, mota } = req.body;
    const foundChuyenNganh = await ChuyenNganh.findOne({
      where: { ma_chuyen_nganh: `${ma}` },
    });
    if (!foundChuyenNganh) {
      return responseHandler.badrequest(res, { success: false, msg: "Không tìm thấy mã chuyên ngành" })
    }
    const result = await ChuyenNganh.update({
      ten_chuyen_nganh: ten,
      so_tin_chi: so_tin_chi,
      ma_khoa: ma_khoa,
      mo_ta: mota,
    }, { where: { ma_chuyen_nganh: `${ma}` } });
    return responseHandler.ok(res, { success: true, result })
  } catch (error) {
    return responseHandler.error(res, { success: false, error })
  }
};
const updateChuyenNganhHocPhan = async (req, res, next) => {
  try {
    const { ma, ma_chuyen_nganh, ma_hoc_phan } = req.body;
    const foundChuyenNganhHocPhan = await ChuyenNganhHocPhan.findOne({ where: { ma: `${ma}` } });
    if (foundChuyenNganhHocPhan) {
      return responseHandler.badrequest(res, { success: false, msg: "Không tìm thấy mã chuyên ngành học phần" })
    }
    const result = await ChuyenNganhHocPhan.update({
      ma_chuyen_nganh: ma_chuyen_nganh,
      ma_hoc_phan: ma_hoc_phan,
    }, { where: { ma: `${ma}` } });
    return responseHandler.ok(res, { success: true, result })
  } catch (error) {
    return responseHandler.error(res, { success: false, error })
  }
};
const updateDanToc = async (req, res, next) => {
  try {
    const { ma_dan_toc, ten_dan_toc, mo_ta } = req.body;
    const foundDanToc = await DanToc.findOne({ where: { ma_dan_toc: `${ma_dan_toc}` } });
    if (foundDanToc) {
      return responseHandler.badrequest(res, { success: false, msg: "Không tìm thấy mã dân tộc" })
    }
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
const getDanhSachGiangVien = async (req, res, next) => {
  try {
    const result = await GiangVien.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
const getDanhSachHocKi = async (req, res, next) => {
  try {
    const result = await HocKi.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
const getDanhSachHocPhan = async (req, res, next) => {
  try {
    const result = await HocPhan.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
const getDanhSachHocPhi = async (req, res, next) => {
  try {
    const result = await HocPhi.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
const getDanhSachHocPhiSinhVien = async (req, res, next) => {
  try {
    const result = await HocPhiSinhVien.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
const getDanhSachKetQuaHocTap = async (req, res, next) => {
  try {
    const result = await KetQuaHocTap.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
const getDanhSachKhoa = async (req, res, next) => {
  try {
    const result = await Khoa.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
const getDanhSachKhoaHoc = async (req, res, next) => {
  try {
    const result = await KhoaHoc.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
const getDanhSachLoaiPhongHoc = async (req, res, next) => {
  try {
    const result = await LoaiPhongHoc.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
const getDanhSachLopHocPhan = async (req, res, next) => {
  try {
    const result = await LopHocPhan.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
const getDanhSachMoHinhDaoTao = async (req, res, next) => {
  try {
    const result = await MoHinhDaoTao.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
const getDanhSachMonHoc = async (req, res, next) => {
  try {
    const result = await MonHoc.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
const getDanhSachPhanCongLopHocPhan = async (req, res, next) => {
  try {
    const result = await PhanCongLopHocPhan.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
const getDanhSachPhongHoc = async (req, res, next) => {
  try {
    const result = await PhongHoc.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
const getDanhSachThoiKhoaBieu = async (req, res, next) => {
  try {
    const result = await PhanCongLopHocPhan.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
const getDanhSachThoiKhoaBieuSinhVien = async (req, res, next) => {
  try {
    const result = await ThoiKhoaBieuSinhVien.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
const getDanhSachTonGiao = async (req, res, next) => {
  try {
    const result = await TonGiao.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
const getDanhSachTrangThaiHocTap = async (req, res, next) => {
  try {
    const result = await TrangThaiHocTap.findAll({ limit: 10 });
    return res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};

const thanhToanCongNoSinhVien = async (req, res, next) => {
  try {
    // const {resultCode,orderId} = req.body
    const adminID = req.payload.userId;
    const { ma_sinh_vien, dsHocPhi } = req.body;
    const ma_phieu_thu = await PhieuThu.max("ma_phieu_thu");

    const foundGiaoVu = await Admin.findOne({
      where: { ma_admin: `${adminID}` },
    });
    const usernameAdmin = foundGiaoVu.username;
    console.log(usernameAdmin);

    const createPhieuThu = await PhieuThu.create({
      ma_phieu_thu: ma_phieu_thu + 1,
      ten_phieu_thu: "Thanh toán công nợ của" + ma_sinh_vien,
      ngay_thu: new Date(),
      ghi_chu: "...",
      don_vi_thu: usernameAdmin,
    })
    await dsHocPhi.map(async (ma_hoc_phi) => {

      let updateTienHocPhi = await sequelize.query(`update hoc_phi
      set hoc_phi.so_tien_da_nop = hoc_phi.so_tien 
      where hoc_phi.ma_hoc_phi = ${ma_hoc_phi}`, { type: QueryTypes.UPDATE });

      let updateCongNo = await sequelize.query(`update hoc_phi
      set hoc_phi.cong_no = 0 
      where hoc_phi.ma_hoc_phi = ${ma_hoc_phi}`, { type: QueryTypes.UPDATE });

      let updateTrangThai = await sequelize.query(`update hoc_phi
      set hoc_phi.trang_thai = 0 
      where hoc_phi.ma_hoc_phi = ${ma_hoc_phi}`, { type: QueryTypes.UPDATE });

      let updatePhieuThu = await sequelize.query(`update hoc_phi
      set hoc_phi.ma_phieu_thu = ${ma_phieu_thu + 1}
      where hoc_phi.ma_hoc_phi = ${ma_hoc_phi}`, { type: QueryTypes.UPDATE });

    })
    const dsUpdateHocPhi = await sequelize.query(`SELECT * FROM sinhviendb.hoc_phi where ma_phieu_thu=${ma_phieu_thu}`, { type: QueryTypes.SELECT })
    return responseHandler.ok(res, { ma_sinh_vien, dsUpdateHocPhi });
  } catch (error) {
    next(error)
  }
};

const updateDiemMotSinhVien = async (req, res, next) => {
  try {
    const { ma_ket_qua_hoc_tap, diem_tk_1, diem_tk_2, diem_tk_3, diem_tk_4,
      diem_tk_5, diem_th_1, diem_th_2, diem_th_3, diem_th_4, diem_th_5, diem_gk, diem_ck, diem_tk_hs_10, diem_tk_hs_4 } = req.body;
    const foundKetQuaHT = await KetQuaHocTap.findOne({
      where: { ma_ket_qua_hoc_tap: `${ma_ket_qua_hoc_tap}` },
    });
    if (!foundKetQuaHT) {
      return responseHandler.badrequest(res, { success: false, msg: "Không tìm thấy kết quả học tập" })
    }
    const result = await KetQuaHocTap.update({
      diem_tk_1: diem_tk_1,
      diem_tk_2: diem_tk_2,
      diem_tk_3: diem_tk_3,
      diem_tk_4: diem_tk_4,
      diem_tk_5: diem_tk_5,
      diem_th_1: diem_th_1,
      diem_th_2: diem_th_2,
      diem_th_3: diem_th_3,
      diem_th_4: diem_th_4,
      diem_th_5: diem_th_5,
      diem_gk: diem_gk,
      diem_ck: diem_ck,
      diem_tk_hs_10: diem_tk_hs_10,
      diem_tk_hs_4: diem_tk_hs_4
    }, { where: { ma_ket_qua_hoc_tap: `${ma_ket_qua_hoc_tap}` } });
    return responseHandler.ok(res, { success: true, result })
  } catch (error) {
    return responseHandler.error(res, { success: false, error })
  }
}
module.exports = {
  thanhToanCongNoSinhVien,
  updateDiemMotSinhVien
};
