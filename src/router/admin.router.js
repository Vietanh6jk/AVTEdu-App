const express = require("express");
const AdminCreateController = require("../controller/admin.controller/create.controller");
const AdminGetController = require("../controller/admin.controller/get.controller");
const AdminUpdateController = require("../controller/admin.controller/update.controller");
const { verifyAccessToken } = require("../helpers/jwt.service");
const router = express.Router();

router
  .route("/createSinhVien")
  .post(verifyAccessToken, AdminCreateController.createSinhVien);
router
  .route("/createKhoa")
  .post(verifyAccessToken, AdminCreateController.createKhoa);
router
  .route("/createTonGiao")
  .post(verifyAccessToken, AdminCreateController.createTonGiao);
router
  .route("/createAdmin")
  .post(verifyAccessToken, AdminCreateController.createAdmin);
router
  .route("/createMonHoc")
  .post(verifyAccessToken, AdminCreateController.createMonHoc);
router
  .route("/createHocPhan")
  .post(verifyAccessToken, AdminCreateController.createHocPhan);
router
  .route("/createChuyenNganh")
  .post(verifyAccessToken, AdminCreateController.createChuyenNganh);
router
  .route("/createChuyenNganhHocPhan")
  .post(verifyAccessToken, AdminCreateController.createChuyenNganhHocPhan);
router
  .route("/createGiangVien")
  .post(verifyAccessToken, AdminCreateController.createGiangVien);
router
  .route("/createHocKi")
  .post(verifyAccessToken, AdminCreateController.createHocKi);
router
  .route("/createLopHocPhan")
  .post(verifyAccessToken, AdminCreateController.createLopHocPhan);
router
  .route("/createPhanCongLopHocPhan")
  .post(verifyAccessToken, AdminCreateController.createPhanCongLopHocPhan);
router
  .route("/createThoiKhoaBieu")
  .post(verifyAccessToken, AdminCreateController.createThoiKhoaBieu);
router
  .route("/createLoaiPhongHoc")
  .post(verifyAccessToken, AdminCreateController.createLoaiPhongHoc);
router
  .route("/createPhongHoc")
  .post(verifyAccessToken, AdminCreateController.createPhongHoc);
router
  .route("/createBangDiem")
  .post(verifyAccessToken, AdminCreateController.createBangDiem);
router
  .route("/createThoiKhoaBieuSinhVien")
  .post(verifyAccessToken, AdminCreateController.createThoiKhoaBieuSinhVien);
//Cần mã sinh viên ở body
router
  .route("/getDanhSachPhieuThuSinhVien")
  .put(verifyAccessToken, AdminGetController.getDanhSachPhieuThuSinhVien);
//Cần mã sinh viên ở body  
router
  .route("/getDanhSachHocPhiSinhVien")
  .put(verifyAccessToken, AdminGetController.getDanhSachHocPhiSinhVien);
//Cần mã sinh viên ở param
router
  .route("/getDanhSachPhieuThuSinhVienParam")
  .get(verifyAccessToken, AdminGetController.getDanhSachPhieuThuSinhVienParam);
//Cần mã sinh viên ở param
router
  .route("/getDanhSachHocPhiSinhVienParam")
  .get(verifyAccessToken, AdminGetController.getDanhSachHocPhiSinhVienParam);
// router
//   .route("/thanhToanHocPhiSinhVien")
//   .put(AdminCreateController.thanhToanHocPhiSinhVien);  
router
  .route("/createThoiKhoaBieuSinhVien")
  .post(verifyAccessToken, AdminCreateController.createThoiKhoaBieuSinhVien);
//Cần mã sinh viên và danh sách mã học phí đã chọn  
router
  .route("/thanhToanCongNoSinhVien")
  .put(verifyAccessToken, AdminUpdateController.thanhToanCongNoSinhVien);
router
  .route("/getDSDiemSinhVienTheoLop")
  .put(verifyAccessToken, AdminGetController.getDanhSachDiemSinhVienByMaLopHP);
router
  .route("/updateDiemMotSinhVien")
  .put(verifyAccessToken, AdminUpdateController.updateDiemMotSinhVien);
router
  .route("/getDSKhoa")
  .get(verifyAccessToken, AdminGetController.getDanhSachKhoa);
router
  .route("/getDsSVByKhoa")
  .put(verifyAccessToken, AdminGetController.getDanhSachSinhVienByKhoa);
router
  .route("/getDsChuyenNganhTheoKhoa")
  .put(verifyAccessToken, AdminGetController.getDSChuyenNganhTheoKhoa);
router
  .route("/getDSMonHoc")
  .get(verifyAccessToken, AdminGetController.getDanhSachMonHoc);

module.exports = router;