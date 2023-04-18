
const bcrypt = require("bcryptjs");
const Admin = require("../../models/admin.model");
const ChuyenNganh = require("../../models/chuyennganh.models");
const ChuyenNganhHocPhan = require("../../models/chuyennganhhocphan.model");
const GiangVien = require("../../models/giangvien.model");
const HocKi = require("../../models/hocki.model");
const HocPhan = require("../../models/hocphan.model");
const KetQuaHocTap = require("../../models/ketquahoctap.model");
const Khoa = require("../../models/khoa.model");
const LoaiPhongHoc = require("../../models/loaiphonghoc.model");
const LopHocPhan = require("../../models/lophocphan.model");
const MonHoc = require("../../models/monhoc.model");
const PhanCongLopHocPhan = require("../../models/phanconglophocphan.model");
const PhongHoc = require("../../models/phonghoc.model");
const SinhVien = require("../../models/sinhvien.model");
const ThoiKhoaBieu = require("../../models/thoikhoabieu.model");
const ThoiKhoaBieuSinhVien = require("../../models/thoikhoabieusinhvien.model");
const TonGiao = require("../../models/tongiao.model");



//Hàm tạo sinh viên bằng admin
const createSinhVien = async (req, res, next) => {
  try {
    console.log("----------------createSinhVien-----------------------------");
    const { ma, ten, ngay_sinh, email, gioitinh, sdt, so_cmnd, khoa, chuyennganh } = req.body;
    const password = "12345";
    // Check có sinh viên nào trùng không
    const foundUser = await SinhVien.findOne({ where: { ma_sinh_vien: `${ma}` } });
    if (foundUser)
      return res
        .status(403)
        .json({ error: { message: "Mã đã được sử dụng." } });
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash (salt + hash)
    const passwordHashed = await bcrypt.hash(password, salt);
    // Re-assign password hashed
    const newPassword = passwordHashed;
    //Tạo sinh viên mới
    const newUser = await SinhVien.create({
      ma_sinh_vien: ma,
      ho_ten_sinh_vien: ten,
      ngay_sinh: ngay_sinh,
      email: email,
      gioitinh: gioitinh,
      mat_khau: newPassword,
      so_dien_thoai: sdt,
      so_cmnd: so_cmnd,
      nien_khoa: "2022-2026",
      ma_khoa: khoa,
      ma_chuyen_nganh: chuyennganh
    });
    return res.status(201).json({ success: true, newUser });
  } catch (error) {
    next(error);
  }
};
// Hàm tạo khoa mới
const createKhoa = async (req, res, next) => {
  try {
    const { ma, ten, mota } = req.body;
    const foundKhoa = await Khoa.findOne({ where: { ma_khoa: `${ma}` } });
    if (foundKhoa) {
      return res
        .status(403)
        .json({ error: { message: "Mã đã được sử dụng." } });
    }
    const newKhoa = await Khoa.create({
      ma_khoa: ma,
      ten_khoa: ten,
      mo_ta: mota,
    });
    return res.status(201).json({ success: true, newKhoa });
  } catch (error) {
    next(error);
  }
}
//Hàm tạo tôn giáo mới
const createTonGiao = async (req, res, next) => {
  try {
    const { ma, ten, mota } = req.body;
    // const foundKhoa= await Khoa.findOne({ where: { ma_khoa:`${ma}` } });
    // if(foundKhoa){
    //   return res
    //     .status(403)
    //     .json({ error: { message: "Mã đã được sử dụng." } });
    // }
    const newTonGiao = await TonGiao.create({
      ma_ton_giao: ma,
      ten_ton_giao: ten,
      mo_ta: mota
    });
    return res.status(201).json({ success: true, newTonGiao });
  } catch (error) {
    next(error);
  }
}
//Hàm tạo Giảng Viên mới 
const createGiangVien = async (req, res, next) => {
  try {
    const { ma, ten, mota, ma_khoa, ngay_sinh, email, gioitinh, username, password } = req.body;
    const foundGiangVien = await GiangVien.findOne({ where: { ma_giang_vien: `${ma}` } });
    if (foundGiangVien) {
      return res
        .status(403)
        .json({ error: { message: "Mã đã được sử dụng." } });
    }
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash (salt + hash)
    const passwordHashed = await bcrypt.hash(password, salt);
    // Re-assign password hashed
    const newPassword = passwordHashed;

    const newGiangVien = await GiangVien.create({
      ma_giang_vien: ma,
      ten_giang_vien: ten,
      ma_khoa: ma_khoa,
      ngay_sinh: ngay_sinh,
      email: email,
      gioi_tinh: gioitinh,
      username: username,
      password: newPassword
    });
    return res.status(201).json({ success: true, newGiangVien });
  } catch (error) {
    next(error);
  }
}
const createAdmin = async (req, res, next) => {
  try {
    const { ma, ten, mat_khau, ma_khoa } = req.body;
    const foundKhoa = await Khoa.findOne({ where: { ma_khoa: `${ma_khoa}` } });
    if (!foundKhoa) {
      return res
        .status(403)
        .json({ error: { message: "Mã khoa không tồn tại ." } });
    }
    const foundAdmin = await Admin.findOne({ where: { ma_admin: `${ma}` } });
    if (foundAdmin) {
      return res
        .status(403)
        .json({ error: { message: "Mã admin đã tồn tại ." } });
    }
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash (salt + hash)
    const passwordHashed = await bcrypt.hash(mat_khau, salt);
    // Re-assign password hashed
    const newPassword = passwordHashed;
    const newAdmin = await Admin.create({
      ma_admin: ma,
      username: ten,
      mat_khau: newPassword,
      ma_khoa: ma_khoa,

    });
    return res.status(201).json({ success: true, newAdmin });
  } catch (error) {
    next(error);
  }
}
const createMonHoc = async (req, res, next) => {
  try {
    const { ma, ten, mota, ma_khoa } = req.body;
    const foundMonHoc = await MonHoc.findOne({ where: { ma_mon_hoc: `${ma}` } });
    if (foundMonHoc) {
      return res
        .status(403)
        .json({ error: { message: "Mã môn học đã tồn tại ." } });
    }
    const newMonHoc = await MonHoc.create({
      ma_mon_hoc: ma,
      ten_mon_hoc: ten,
      ma_khoa: ma_khoa,
      mo_ta: mota

    });
    return res.status(201).json({ success: true, newMonHoc });
  } catch (error) {
    next(error);
  }
}
const createHocPhan = async (req, res, next) => {
  try {
    const { ma, tin_lt, tin_th, hoc_phan_bat_buoc, ma_td, ma_sh, ma_tq, ma_mon_hoc, mota } = req.body;
    const foundHocPhan = await HocPhan.findOne({ where: { ma_hoc_phan: `${ma}` } });
    if (foundHocPhan) {
      return res
        .status(403)
        .json({ error: { message: "Mã học phần đã tồn tại ." } });
    }
    const newHocPhan = await HocPhan.create({
      ma_hoc_phan: ma,
      so_tin_chi_ly_thuyet: tin_lt,
      so_tin_chi_thuc_hanh: tin_th,
      hoc_phan_bat_buoc: hoc_phan_bat_buoc,
      ma_hoc_phan_tuong_duong: ma_td,
      ma_hoc_phan_song_hanh: ma_sh,
      ma_mon_tien_quyet: ma_tq,
      ma_mon_hoc: ma_mon_hoc,
      mo_ta: mota

    });
    return res.status(201).json({ success: true, newHocPhan });
  } catch (error) {
    next(error);
  }
}
const createChuyenNganh = async (req, res, next) => {
  try {
    const { ma, ten, ma_khoa, so_tin_chi, mota } = req.body;
    const foundChuyenNganh = await ChuyenNganh.findOne({ where: { ma_chuyen_nganh: `${ma}` } });
    if (foundChuyenNganh) {
      return res
        .status(403)
        .json({ error: { message: "Mã chuyên ngành đã tồn tại ." } });
    }
    const newChuyenNganh = await ChuyenNganh.create({
      ma_chuyen_nganh: ma,
      ten_chuyen_nganh: ten,
      so_tin_chi: so_tin_chi,
      ma_khoa: ma_khoa,
      mo_ta: mota
    });
    return res.status(201).json({ success: true, newChuyenNganh });
  } catch (error) {
    next(error);
  }
}
const createChuyenNganhHocPhan = async (req, res, next) => {
  try {
    const { ma, ma_chuyen_nganh, ma_hoc_phan } = req.body;
    const foundChuyenNganhHocPhan = await ChuyenNganhHocPhan.findOne({ where: { ma: `${ma}` } });
    if (foundChuyenNganhHocPhan) {
      return res
        .status(403)
        .json({ error: { message: "Mã chuyên ngành học phần đã tồn tại ." } });
    }
    const newChuyenNganhHocPhan = await ChuyenNganhHocPhan.create({
      ma: ma,
      ma_chuyen_nganh: ma_chuyen_nganh,
      ma_hoc_phan: ma_hoc_phan,
    });
    return res.status(201).json({ success: true, newChuyenNganhHocPhan });
  } catch (error) {
    next(error);
  }
}
const createHocKi = async (req, res, next) => {
  try {
    const { ma, nam_hoc_bat_dau, nam_ket_thuc, thu_tu_hoc_ki, mo_ta } = req.body;
    const foundHocKi = await HocKi.findOne({ where: { ma_hoc_ki: `${ma}` } });
    if (foundHocKi) {
      return res
        .status(403)
        .json({ error: { message: "Mã học kì đã tồn tại ." } });
    }
    const newHocKi = await HocKi.create({
      ma_hoc_ki: ma,
      nam_hoc_bat_dau: nam_hoc_bat_dau,
      nam_hoc_ket_thuc: nam_ket_thuc,
      thu_tu_hoc_ki: thu_tu_hoc_ki,
      mo_ta: mo_ta
    });
    return res.status(201).json({ success: true, newHocKi });
  } catch (error) {
    next(error);
  }
}
const createLopHocPhan = async (req, res, next) => {
  try {
    const { ma, ten, ten_vt, sl_sv_td, sl_dk_ht, so_nhom_th, loai, trang_thai, ma_hoc_ki, ma_hoc_phan, mo_ta } = req.body;
    const foundLopHocPhan = await LopHocPhan.findOne({ where: { ma_lop_hoc_phan: `${ma}` } });
    if (foundLopHocPhan) {
      return res
        .status(403)
        .json({ error: { message: "Mã lớp học phần đã tồn tại ." } });
    }
    const newLopHocPhan = await LopHocPhan.create({
      ma_lop_hoc_phan: ma,
      ten_lop_hoc_phan: ten,
      ten_viet_tat: ten_vt,
      so_luong_dang_ki_toi_da: sl_sv_td,
      so_luong_dang_ki_hien_tai: sl_dk_ht,
      so_nhom_thuc_hanh: so_nhom_th,
      loai: loai,
      trang_thai: trang_thai,
      ma_hoc_ki: ma_hoc_ki,
      ma_hoc_phan: ma_hoc_phan,
      mo_ta: mo_ta
    });
    return res.status(201).json({ success: true, newLopHocPhan });
  } catch (error) {
    next(error);
  }
}
const createPhanCongLopHocPhan = async (req, res, next) => {
  try {
    const { ma, loai, nhom_th_pt, sl_sv_pt, ma_giang_vien, ma_lop_hoc_phan, ghi_chu } = req.body;
    const foundPhanCongLopHocPhan = await PhanCongLopHocPhan.findOne({ where: { ma_phan_cong: `${ma}` } });
    if (foundPhanCongLopHocPhan) {
      return res
        .status(403)
        .json({ error: { message: "Mã phân công lớp học phần đã tồn tại ." } });
    }
    const newPhanCongLopHocPhan = await PhanCongLopHocPhan.create({
      ma_phan_cong: ma,
      loai_hoc_phan_phu_trach: loai,
      nhom_thuc_hanh_phu_trach: nhom_th_pt,
      so_luong_sv_phu_trach: sl_sv_pt,
      ma_giang_vien: ma_giang_vien,
      ma_lop_hoc_phan: ma_lop_hoc_phan,
      ghi_chu: ghi_chu
    });
    return res.status(201).json({ success: true, newPhanCongLopHocPhan });
  } catch (error) {
    next(error);
  }
}
const createThoiKhoaBieu = async (req, res, next) => {
  try {
    const { ma, loai, ngay_hoc_trong_tuan, nhom_thuc_hanh, thoi_gian_bat_dau, thoi_gian_ket_thuc, tiet_hoc_bat_dau, tiet_hoc_ket_thuc, ma_phan_cong_lop_hoc_phan, ma_phong_hoc, ghi_chu } = req.body;
    const foundThoiKhoaBieu = await ThoiKhoaBieu.findOne({ where: { ma_thoi_khoa_bieu: `${ma}` } });
    if (foundThoiKhoaBieu) {
      return res
        .status(403)
        .json({ error: { message: "Mã thời khoá biểu đã tồn tại ." } });
    }
    const newThoiKhoaBieu = await ThoiKhoaBieu.create({
      ma_thoi_khoa_bieu: ma,
      loai_hoc_phan: loai,
      ngay_hoc_trong_tuan: ngay_hoc_trong_tuan,
      nhom_thuc_hanh: nhom_thuc_hanh,
      thoi_gian_bat_dau: thoi_gian_bat_dau,
      thoi_gian_ket_thuc: thoi_gian_ket_thuc,
      tiet_hoc_bat_dau: tiet_hoc_bat_dau,
      tiet_hoc_ket_thuc: tiet_hoc_ket_thuc,
      ma_phan_cong_lop_hoc_phan: ma_phan_cong_lop_hoc_phan,
      ma_phong_hoc: ma_phong_hoc,
      ghi_chu: ghi_chu
    });
    return res.status(201).json({ success: true, newThoiKhoaBieu });
  } catch (error) {
    next(error);
  }
}
const createLoaiPhongHoc = async (req, res, next) => {
  try {
    const { ma, ten, mo_ta } = req.body;
    const foundLoaiPhongHoc = await LoaiPhongHoc.findOne({ where: { ma_loai_phong_hoc: `${ma}` } });
    if (foundLoaiPhongHoc) {
      return res
        .status(403)
        .json({ error: { message: "Mã loại phòng học đã tồn tại ." } });
    }
    const newLoaiPhongHoc = await LoaiPhongHoc.create({
      ma_loai_phong_hoc: ma,
      ten_loai_phong_hoc: ten,
      mo_ta: mo_ta
    });
    return res.status(201).json({ success: true, newLoaiPhongHoc });
  } catch (error) {
    next(error);
  }
}
const createPhongHoc = async (req, res, next) => {
  try {
    const { ma, ten_day_nha, ten_phong_hoc, ma_loai_phong_hoc, ghi_chu } = req.body;
    const foundPhongHoc = await PhongHoc.findOne({ where: { ma_phong_hoc: `${ma}` } });
    if (foundPhongHoc) {
      return res
        .status(403)
        .json({ error: { message: "Mã phòng học đã tồn tại ." } });
    }
    const newPhongHoc = await PhongHoc.create({
      ma_phong_hoc: ma,
      ten_day_nha: ten_day_nha,
      ten_phong_hoc: ten_phong_hoc,
      ma_loai_phong_hoc: ma_loai_phong_hoc,
      ghi_chu: ghi_chu
    });
    return res.status(201).json({ success: true, newPhongHoc });
  } catch (error) {
    next(error);
  }
}
const createBangDiem = async (req, res, next) => {
  try {
    const { ma, tk1, tk2, tk3, tk4, tk5, th1, th2, th3, th4, th5, gk, ck, tk_he4, tk_he10, diem_chu, xep_loai, ghi_chu, ma_sinh_vien, ma_lop_hoc_phan,
      tinh_trang_hoc_tap, ngay_dang_ki } = req.body;
    const foundBangDiem = await KetQuaHocTap.findOne({ where: { ma_ket_qua_hoc_tap: `${ma}` } });
    if (foundBangDiem) {
      return res
        .status(403)
        .json({ error: { message: "Mã kết quả học tập đã tồn tại ." } });
    }
    const newBangDiem = await KetQuaHocTap.create({
      ma_ket_qua_hoc_tap: ma,
      diem_tk_1: tk1,
      diem_tk_2: tk2,
      diem_tk_3: tk3,
      diem_tk_4: tk4,
      diem_tk_5: tk5,
      diem_th_1: th1,
      diem_th_2: th2,
      diem_th_3: th3,
      diem_th_4: th4,
      diem_th_5: th5,
      diem_gk: gk,
      diem_ck: ck,
      diem_tk_hs_4: tk_he4,
      diem_tk_hs_10: tk_he10,
      diem_chu: diem_chu,
      xep_loai: xep_loai,
      ghi_chu: ghi_chu,
      ma_sinh_vien: ma_sinh_vien,
      ma_lop_hoc_phan: ma_lop_hoc_phan,
      tinh_trang_hoc_tap: tinh_trang_hoc_tap,
      ngay_dang_ki: ngay_dang_ki,
    });
    return res.status(201).json({ success: true, newBangDiem });
  } catch (error) {
    next(error);
  }
}
const createThoiKhoaBieuSinhVien = async (req, res, next) => {
  try {
    const { ma, loai_ngay_hoc, ma_sinh_vien, ma_thoi_khoa_bieu, ghi_chu } = req.body;
    const foundThoiKhoaBieuSinhVien = await ThoiKhoaBieuSinhVien.findOne({ where: { ma: `${ma}` } });
    if (foundThoiKhoaBieuSinhVien) {
      return res
        .status(403)
        .json({ error: { message: "Mã thời khoá biểu sinh viên đã tồn tại ." } });
    }
    const newThoiKhoaBieuSV = await ThoiKhoaBieuSinhVien.create({
      ma: ma,
      loai_ngay_hoc: loai_ngay_hoc,
      ma_sinh_vien: ma_sinh_vien,
      ma_thoi_khoa_bieu: ma_thoi_khoa_bieu,
      ghi_chu: ghi_chu
    });
    return res.status(201).json({ success: true, newThoiKhoaBieuSV });
  } catch (error) {
    next(error);
  }
}
module.exports = {
  createSinhVien,
  createKhoa,
  createTonGiao,
  createAdmin,
  createMonHoc,
  createHocPhan,
  createChuyenNganh,
  createChuyenNganhHocPhan,
  createGiangVien,
  createHocKi,
  createLopHocPhan,
  createPhanCongLopHocPhan,
  createThoiKhoaBieu,
  createLoaiPhongHoc,
  createPhongHoc,
  createBangDiem,
  createThoiKhoaBieuSinhVien,
};