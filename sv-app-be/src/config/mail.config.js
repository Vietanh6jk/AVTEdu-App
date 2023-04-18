const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');


// Tạo đối tượng transporter với cấu hình SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host:'smtp.gmail.com',
  port:465,
  secure:true,
  auth: {
    user: 'avteduapp@gmail.com',
    pass: 'tocxuaeswmvqrctl'
  }
});
//Tạo theme của mail với Mailgen
let MailGenerator = new Mailgen({
  theme: "salted",
  product : {
      name: "AVTEdu-App",
      link : 'https://mailgen.js/'
  }
})
// const handlebarOptions = {
//   viewEngine: {
//     extName: ".handlebars",
//     partialsDir: path.resolve('./views'),
//     defaultLayout: false,
//   },
//   viewPath: path.resolve('./views'),
//   extName: ".handlebars",
// }

// transporter.use('compile', hbs(handlebarOptions));

//Data mẫu cần truyền khi gửi mail
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



// Hàm gửi email
async function sendMail(data,ma_sinh_vien,mail_sinh_vien,ten_sinh_vien,phuong_thuc_thanh_toan) {
    try {
      //Data mẫu cần truyền khi gửi mail
        let response = {
        body: {
            name : ten_sinh_vien,
            intro: ["Đây là hóa đơn về học phí của bạn","Ngày thanh toán:"+new Date(),'Phương thức thanh toán:'+phuong_thuc_thanh_toan],
            table : {
                data : data
                },     
        }
        }
      //Cấu hình data vào vào nội dung html mail  
      let mail = MailGenerator.generate(response)  
      //Địa chỉ gửi và nhận của mail
        let message = {
            from: 'avteduapp@gmail.com',
            to: mail_sinh_vien,
            subject: "Phiếu thu học phí của "+ma_sinh_vien,
            html: mail
        }
      // Gửi email
      const sendMailSample =  transporter.sendMail(message, function(error, info){
        console.log('Email sent: ' + info.response);
      });     
    } catch (error) {
      console.error('Error occurred while sending email:', error.message);
    }
  }

module.exports = {sendMail}