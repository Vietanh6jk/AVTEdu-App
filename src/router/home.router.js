const experss = require('express');
const router = experss.Router();

const AuthsRouter = require("./auth.router");
router.use("/auth", AuthsRouter);

const AdminsRouter = require("./admin.router");
router.use("/admin", AdminsRouter);

const userRequest = require("./userRequest.router");
router.use("/userRequest", userRequest);

const GiangVienRouter = require("./giangvien.router");
router.use("/giangvien", GiangVienRouter);

router.get('/hello', function (req, res) {
    res.send("Thanh toán thành công");
    
})

module.exports = router;