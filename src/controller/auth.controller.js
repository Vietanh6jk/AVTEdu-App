const SinhVien = require("../models/sinhvien.model");
const client = require("../helpers/connect_redis");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
} = require("../helpers/jwt.service");
const { createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification } = require("firebase/auth");
const { defaultAuth } = require("../config/firebase.config");
const { use } = require("../router/auth.router");
const Admin = require("../models/admin.model");
const XLSX = require("xlsx");
const fs = require('fs');
const multer = require("multer");
const GiangVien = require("../models/giangvien.model");

const storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, "");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage, limits: { fileSize: 20000000 } }).single(
  "uploadFile"
);


//Hàm đăng nhập sinh viên
const signIn = async (req, res, next) => {
  console.log(req.body);
  try {
    const { ma, password } = req.body;
    const sinh_vien = await SinhVien.findOne({ where: { ma_sinh_vien: `${ma}` } });
    if (!ma) {
      return res
        .status(403)
        .json({ error: { message: "Tài khoản không tồn tại" } });
    }
    // console.log(sinh_vien.mat_khau)
    //Check mật khẩu đã mã hoá 
    const isValid = await sinh_vien.isValidPassword(password);
    if (!(isValid)) {
      return res
        .status(403)
        .json({ error: { message: "Tài khoản hoặc mật khẩu không khớp !!!" } });
    }
    console.log("-----------------------Đã đăng nhập--------------------------");

    //Tạo accessToken
    const accessToken = await signAccessToken(ma);
    //Tạo refeshToken
    const refreshToken = await signRefreshToken(ma);
    await res.cookie('authorization', accessToken, { maxAge: 900000, httpOnly: true });
    await res.cookie('refreshToken', refreshToken, { maxAge: 1900000, httpOnly: true });
    return res
      .status(200)
      .json({ success: true, accessToken, refreshToken, sinh_vien });
  } catch (error) {
    next(error);
  }
}
//Hàm đăng nhập admin
const signInAdmin = async (req, res, next) => {
  console.log(req.body);
  try {
    const { ma, password } = req.body;
    const admin = await Admin.findOne({ where: { ma_admin: `${ma}` } });
    if (!ma) {
      return res
        .status(403)
        .json({ error: { message: "Tài khoản không tồn tại" } });
    }
    // console.log(sinh_vien.mat_khau)
    //Check mật khẩu đã mã hoá 
    const isValid = await admin.isValidPassword(password);
    if (!(isValid)) {
      return res
        .status(403)
        .json({ error: { message: "Tài khoản hoặc mật khẩu không khớp !!!" } });
    }
    console.log("-----------------------Đã đăng nhập--------------------------");
    //Tạo accessToken
    const accessToken = await signAccessToken(ma);
    //Tạo refeshToken
    const refreshToken = await signRefreshToken(ma);
    await res.cookie('authorization', accessToken, { maxAge: 900000, httpOnly: true });
    await res.cookie('refreshToken', refreshToken, { maxAge: 1900000, httpOnly: true });
    return res
      .status(200)
      .json({ success: true, accessToken, refreshToken, admin });
  } catch (error) {
    next(error);
  }
}

//Hàm đăng nhập giảng viên
const signInGiangVien = async (req, res, next) => {
  console.log(req.body);
  try {
    const { ma, password } = req.body;
    const giangvien = await GiangVien.findOne({ where: { ma_giang_vien: `${ma}` } });
    if (!ma) {
      return res
        .status(403)
        .json({ error: { message: "Tài khoản không tồn tại" } });
    }
    // console.log(sinh_vien.mat_khau)
    //Check mật khẩu đã mã hoá 
    const isValid = await giangvien.isValidPassword(password);
    if (!(isValid)) {
      return res
        .status(403)
        .json({ error: { message: "Tài khoản hoặc mật khẩu không khớp !!!" } });
    }
    console.log("-----------------------Đã đăng nhập--------------------------");
    //Tạo accessToken
    const accessToken = await signAccessToken(ma);
    //Tạo refeshToken
    const refreshToken = await signRefreshToken(ma);
    await res.cookie('authorization', accessToken, { maxAge: 900000, httpOnly: true });
    await res.cookie('refreshToken', refreshToken, { maxAge: 1900000, httpOnly: true });
    return res
      .status(200)
      .json({ success: true, accessToken, refreshToken, giangvien });
  } catch (error) {
    next(error);
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(403).json({ message: "không có refreshtoken" });
    }
    console.log(refreshToken);
    const { userId } = await verifyRefreshToken(refreshToken);
    console.log(userId);
    const accessToken = await signAccessToken(userId);
    const refToken = await signRefreshToken(userId);
    return res.status(200).json({ accessToken, refToken });
  } catch (error) {
    next(error);
  }
};
const AuthercationEmail = async (req, res, next) => {
  try {
    const { ma, email } = req.body;
    createUserWithEmailAndPassword(defaultAuth, email, ma).then(() => {
      console.log("Thêm email thành công")
      return res.status(200).json({ success: true, email, ma });
    })
      .catch(function (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode) {
          console.log(errorMessage);
          console.log(error);
        }

      });
  } catch (error) {
    next(error);
  }
};
const CheckVerificationEmail = async (req, res, next) => {
  try {
    const userId = req.payload.userId;
    const sinh_vien = await SinhVien.findOne({ where: { ma_sinh_vien: `${userId}` } });
    //Đăng nhập vào firebase
    await signInWithEmailAndPassword(defaultAuth, sinh_vien.email, sinh_vien.ma_sinh_vien)
      .then((userCredential) => {
        // Signed in    
        console.log("Đã đăng nhập " + sinh_vien.email);
        onAuthStateChanged(defaultAuth, (user) => {
          if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            const uid = user.uid;
            console.log('id la:' + uid)
            const emailVerified = user.emailVerified;
            console.log(emailVerified);
            if (!emailVerified) {
              sendEmailVerification(user)
                .then(() => {
                  return res.status(200).json({ success: true, msg: "Email verification sent!" });
                  // ...
                });
              // ...
            } else {
              return res.status(200).json({ success: true, msg: "Email đã xác thực" + sinh_vien.email });
            }
          }
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });

  } catch (error) {
    next(error);
  }
};
const Logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    // console.log(req.headers);
    if (!refreshToken) {
      return res.status(403).json({ message: "không có refreshtoken" });
    }
    const { userId } = await verifyRefreshToken(refreshToken);
    const user = await SinhVien.findOne({ where: { ma_sinh_vien: `${userId}` } });
    console.log(user)
    client.del(userId.toString(), (err, reply) => {
      if (err) return res.status(500).json({ message: "Lỗi không xác định" });
      res.clearCookie("authorization");
      res.clearCookie("refreshToken");
      return res.status(200).json({ message: "Đăng xuất thành công " + userId });
    });
  } catch (error) {
    next(error);
  }
};
///Đổi mật khẩu đang lỗi
const ChangePassword = async (req, res, next) => {
  try {
    const { password, reEnterPassword, newPassword } = req.body;
    console.log(req.payload);
    // Check if there is a user with the same user
    const foundUser = await User.findOne({ _id: req.payload.userId });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    //Check password co ton tai khong
    const isValid = await foundUser.isValidPassword(password);
    if (!isValid) {
      return res
        .status(403)
        .json({ error: { message: "Password Không Đúng " } });
    }
    //Check password co giong khong
    if (password !== reEnterPassword) {
      return res
        .status(403)
        .json({ error: { message: "Password Nhập Sai!!!" } });
    }
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash (salt + hash)
    const passwordHashed = await bcrypt.hash(newPassword, salt);
    // Re-assign password hashed
    const newChangePassword = passwordHashed;
    //Change Password
    foundUser.password = newChangePassword;
    await foundUser.save();
    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
////Quên mật khẩu- Đang lỗi 
const forgotPassword = async (req, res, next) => {
  try {
    const { phone, code, Password, reEnterPassword } = req.body;
    if (Password !== reEnterPassword) {
      return res
        .status(403)
        .send([{ message: "Password and reEnterpassword Không giống nhau " }]);
    }
    const result = await verifyOtp(phone, code);
    if (result) {
      const FoundUser = await User.findOne({ phone });
      // Generate a salt
      const salt = await bcrypt.genSalt(10);
      // Generate a password hash (salt + hash)
      const passwordHashed = await bcrypt.hash(Password, salt);
      // Re-assign password hashed
      const newChangePassword = passwordHashed;
      //Change Password
      FoundUser.password = newChangePassword;
      await FoundUser.save();
      res
        .status(200)
        .send([{ message: "Password đã được cập nhật ", FoundUser }]);
    } else {
      res.status(400).send([
        {
          msg: "Code is used or expired",
          param: "otp",
        },
      ]);
    }
  } catch (error) {
    next(error);
  }
};

const getFile = async (req, res, next) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json(err);
      }
      console.log(req.file)
      let path = req.file.buffer;
      var workbook = await XLSX.read(path);
      var sheet_name_list = workbook.SheetNames;
      let json = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheet_name_list[0]]
      );
      const listImport = [{}];
      // console.log(json);
      listImport.shift();
      for (let i = 8; i < json.length; i++) {
        listImport.push({
          stt: json[i].__EMPTY,
          ma_sinh_vien: json[i].__EMPTY_1,
          ho: json[i].__EMPTY_2,
          ten: json[i].__EMPTY_3,
          gioi_tinh: json[i].__EMPTY_4,
          ngay_sinh: json[i].__EMPTY_5,
          st_tuan_1: json[i].__EMPTY_7,
          st_tuan_2: json[i].__EMPTY_10,
          st_tuan_3: json[i].__EMPTY_13,
          st_tuan_4: json[i].__EMPTY_16,
          st_tuan_5: json[i].__EMPTY_19,
          st_tuan_6: json[i].__EMPTY_22,
          st_tuan_7: json[i].__EMPTY_25,
          st_tuan_8: json[i].__EMPTY_28,
          st_tuan_9: json[i].__EMPTY_31,
          st_tuan_10: json[i].__EMPTY_34,
          vang_co_phep: json[i].__EMPTY_36,
          vang_ko_phep: json[i].__EMPTY_37,
          tong_so_tiet: json[i].__EMPTY_38,
          phan_tram_vang: json[i].__EMPTY_39
        })
      }
      // fs.unlink(path, (err) => {
      //   if (err) throw err;
      //   console.log('File deleted!');
      // });
      return res.status(200).send(listImport);
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  signIn,
  refreshToken,
  AuthercationEmail,
  CheckVerificationEmail,
  Logout,
  signInAdmin,
  getFile,
  signInGiangVien
};