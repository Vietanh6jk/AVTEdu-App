const experss = require('express');
const { verifyAccessToken } = require("../helpers/jwt.service");
const router = experss.Router();

const GiangVienController = require("../controller/giangvien.controller");

router
  .route("/getDanhSanhSachSinhVienTheoLopHocPhan")
  .post(verifyAccessToken,GiangVienController.getDanhSanhSachSinhVienTheoLopHocPhan);
router
  .route("/getThoiKhoaBieuGiangVienTrongMotTuan")
  .post(verifyAccessToken,GiangVienController.getThoiKhoaBieuGiangVienTrongMotTuan);

  module.exports = router;  