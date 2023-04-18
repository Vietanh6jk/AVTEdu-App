require('dotenv').config();
require('./helpers/connect_redis');
const http = require('http');
const express = require('express');
const { route } = require('./router/home.router');
const app = express();
const server = http.createServer(app);
const SinhVien = require('./models/sinhvien.model');
const Khoa = require('./models/khoa.model');
const BacDaoTao = require('./models/bacdaotao.model');
const DanToc = require('./models/dantoc.model');
const KhoaHoc = require('./models/khoahoc.model');
const MoHinhDaoTao = require('./models/mohinhdaotao.model');
const TonGiao = require('./models/tongiao.model');
const TrangThaiHocTap = require('./models/trangthaihoctap.model');
const Admin = require('./models/admin.model');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');


const PORT = process.env.PORT || 9090

const homeRouter = require('./router/home.router');
const { ConnectDB } = require('./config/mysql.config');
const ChuyenNganhHocPhan = require('./models/chuyennganhhocphan.model');
const HocKi = require('./models/hocki.model');
const LopHocPhan = require('./models/lophocphan.model');
const HocPhan = require('./models/hocphan.model');
const LoaiPhongHoc = require('./models/loaiphonghoc.model');
const PhanCongLopHocPhan = require('./models/phanconglophocphan.model');
const PhongHoc = require('./models/phonghoc.model');
const ThoiKhoaBieu = require('./models/thoikhoabieu.model');
const ThoiKhoaBieuSinhVien = require('./models/thoikhoabieusinhvien.model');
const GiangVien = require('./models/giangvien.model');
const MonHoc = require('./models/monhoc.model');
const ChuyenNganh = require('./models/chuyennganh.models');
const KetQuaHocTap = require('./models/ketquahoctap.model');
const HocPhi = require('./models/hocphi.model');
const HocPhiSinhVien = require('./models/hocphisinhvien.model');
const PhieuThu = require('./models/phieuthu.model');


ConnectDB().getInstance();
const corsConfig = {
  credentials: true,
  origin: true,
};
//Hiện kết quả request trên termail
app.use(morgan('dev'));
app.use(cors(corsConfig));
//Chặn lỗi CORS policy
// app.use(function(req, res, next) {
//   var allowedOrigins = [   'http://localhost:3000' ];
//   var origin = req.headers.origin;
//   if (allowedOrigins.indexOf(origin) > -1) {
//     res.header("Access-Control-Allow-Origin", origin);
//   }
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("controller/public"));
app.use(cookieParser());
app.use("/", homeRouter);







// SinhVien.sync();
TrangThaiHocTap.sync();
Khoa.sync();
BacDaoTao.sync();
DanToc.sync();
KhoaHoc.sync();
MoHinhDaoTao.sync();
TonGiao.sync();
TrangThaiHocTap.sync();
Admin.sync();
MonHoc.sync();
SinhVien.sync();
HocKi.sync();
HocPhan.sync();
LopHocPhan.sync();
ChuyenNganh.sync();
LoaiPhongHoc.sync();
PhanCongLopHocPhan.sync();
PhongHoc.sync();
ThoiKhoaBieu.sync();
ThoiKhoaBieuSinhVien.sync();
ChuyenNganhHocPhan.sync();
GiangVien.sync({ alter: true });
KetQuaHocTap.sync();
HocPhi.sync();
HocPhiSinhVien.sync();
PhieuThu.sync();
// Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});
// Error handler function
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  // res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT,PATCH, DELETE');

  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,a_custom_header'); //notice here carefully

  // res.setHeader('Access-Control-Allow-Credentials', true);
  // next();

  // response to client
  return res.status(status).json({
    error: {
      message: error.message,
    },
  });



});

// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
//   res.setHeader('Access-Control-Expose-Headers', 'X-Requested-With,content-type');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// })

server.listen(PORT, function () {
  console.log(`Server is listening in port ${PORT}`);
})