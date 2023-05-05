const express = require('express');
const userRequestController = require("../controller/userRequest.controller");
const { verifyAccessToken } = require('../helpers/jwt.service');
const router = express.Router();

//Api này lấy học kì của sinh viên đang đăng nhập
router
  .route("/getHocKiSinhVien")
  .get(verifyAccessToken, userRequestController.getHocKiSinhVien);
//Api này lấy những môn chưa học của sinh viên đang đăng nhập
router
  .route("/getMonSinhVienChuaHoc")
  .get(verifyAccessToken, userRequestController.getMonHocSinhVienChuaHoc);
//Api này lấy tất cả lớp học phần đang có của học phần cần mã học phần 
router
  .route("/getLopHocPhanByHocPhan")
  .put(userRequestController.getLopHocPhanByHocPhan);
//Api này lấy chi tiết lớp học phần đang chọn cần mã lớp học phần  
router
  .route("/getChiTietLopHocPhan")
  .put(userRequestController.getChiTietLopHocPhan);

//Api này đăng kí học phần đang chọn cần mã phân công lớp học phần và mã học kì đang chọn     
router
  .route("/dangKiHocPhan")
  .post(verifyAccessToken, userRequestController.DangKiHocPhan);
//Api này lấy những thông tin của sinh viên đang đăng nhập  
router
  .route("/getThongTinSinhVien")
  .get(verifyAccessToken, userRequestController.getThongTinSinhvien);
//Api này lấy công nợ của sinh viên đang đăng nhập  
router
  .route("/getDanhSachHocPhi")
  .get(verifyAccessToken, userRequestController.getDanhSachHocPhi);
//Api này lấy những môn đã đăng kí trong 1 học kì của sinh viên đang đăng nhập cần mã học kì  
router
  .route("/getMonDaDangKiTrongHocKi")
  .put(verifyAccessToken, userRequestController.getMonDaDangKiTrongHocKi);
//Api này lấy những môn trong thời khoá biểu trong 1 tuần của sinh viên đang đăng nhập cần ngày hiện tại  
router
  .route("/getThoiKhoaBieuSinhVienTrongMotTuan")
  .put(verifyAccessToken, userRequestController.getThoiKhoaBieuSinhVienTrongMotTuan);
router
  .route("/thanhToanHocPhiTrucTuyen")
  .put(verifyAccessToken, userRequestController.thanhToanHocPhiTrucTuyen);
router
  .route("/xacNhanThanhToanTrucTuyen")
  .put(userRequestController.xacNhanThanhToanTrucTuyen);
//Cần mã sinh viên và danh sách mã phiếu thu
router
  .route("/getChiTietPhieuThuTongHop")
  .put(userRequestController.getChiTietPhieuThuTongHop);
router
  .route("/getDSPhieuThuBySinhVien")
  .put(verifyAccessToken, userRequestController.getDanhSachPhieuThuSinhVien);
router
  .route("/getChiTietPhieuThuTongHopBySV")
  .put(verifyAccessToken, userRequestController.getChiTietPhieuThuTongHopBySV);
router
  .route("/getKetQuaHocTap")
  .put(verifyAccessToken, userRequestController.getKetQuaHocTap);
  router
  .route("/getLopHocPhanKhongTrung")
  .put(verifyAccessToken, userRequestController.getLopHocPhanKhongTrung);  


module.exports = router;