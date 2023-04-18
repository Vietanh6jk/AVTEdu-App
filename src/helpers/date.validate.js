const { format } = require('date-fns');
function getWeekDates(date) {
    let days = [];
   

    // Lấy ngày đầu tiên của tuần bằng cách tính ngày của ngày đầu tiên và trừ đi số ngày từ ngày đó tới Thứ 2
    let firstDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() +1);
  
    // Lặp qua 7 ngày trong tuần và lấy ngày của mỗi ngày
    for (let i = 0; i < 7; i++) {
      let day = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + i);
      days.push({date:fomartDate(day),wod:day.getDay(),originDay:day});
    }
  
    return days;
  }
 function getWeekDay(date){
    const weekday = date.getDay(); // trả về số nguyên từ 0 đến 6
    const formatter = new Intl.DateTimeFormat('vi-VN', { weekday: 'long' });
    return formatter.format(date);
 } 
 function fomartDate(date){
    const dateFormat = 'yyyy-MM-dd';
    return format(date,dateFormat)
 }
 function fomartDateToFE(date){
   const dateFormat = 'dd/MM/yyyy';
   return format(date,dateFormat)
}
module.exports ={ getWeekDates ,getWeekDay,fomartDate,fomartDateToFE};