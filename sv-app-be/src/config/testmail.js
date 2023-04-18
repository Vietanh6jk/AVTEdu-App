// const nodemailer = require('nodemailer');
// const Mailgen = require('mailgen');

const { sendMail } = require("./mail.config");

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   host:'smtp.gmail.com',
//   port:465,
//   secure:true,
//   auth: {
//     user: 'avteduapp@gmail.com',
//     pass: 'tocxuaeswmvqrctl'
//   }
// });

// let MailGenerator = new Mailgen({
//   theme: "salted",
//   product : {
//       name: "AVTEdu-App",
//       link : 'https://mailgen.js/'
//   }
// })
// // const handlebarOptions = {
// //   viewEngine: {
// //     extName: ".handlebars",
// //     partialsDir: path.resolve('./views'),
// //     defaultLayout: false,
// //   },
// //   viewPath: path.resolve('./views'),
// //   extName: ".handlebars",
// // }

// // transporter.use('compile', hbs(handlebarOptions));



// let response = {
//   body: {
//       name : "Nguyen Van D",
//       intro: ["Đây là hóa đơn về học phí của bạn","Ngày thanh toán:"+new Date(),'Phương thức thanh toán:MoMo'],
//       table : {
//           data : [
//             {
//               "Mã học phí ":1,
//               "Tên môn học": "Nhập Môn Lập Trình",
//               "Học kỳ/Năm học":"HK1(2010-2014)",
//               "Số tiền": 1680000
//           },
//           {
//              "Mã học phí ": 2,
//              "Tên môn học": "Giáo dục quốc phòng",
//              "Học kỳ/Năm học":"HK1(2010-2014)",
//              "Số tiền": 1680000
//           },
//           {
//             "Mã học phí ": "",
//             "Tên môn học": "",
//             "Học kỳ/Năm học":"Tổng cộng",
//             "Số tiền": 3360000
//          },
//           ],
//         },     
//   }
// }

// let mail = MailGenerator.generate(response)

// let message = {
//   from: 'avteduapp@gmail.com',
//   to: 'vietanh6jk@gmail.com',
//   subject: "Phiếu thu học phí của 19504781",
//   html: mail
// }


// const sendMailSample =  transporter.sendMail(message, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });

// module.exports = {}
